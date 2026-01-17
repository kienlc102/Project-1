import sys
import time
import logging
import threading
import cv2
import numpy as np
import requests
import re
import unicodedata
import uvicorn
from pathlib import Path
from datetime import datetime

from fastapi import FastAPI, Request, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FaceAuth")

sys.path.append("../demo/face_recognition_demo/python")

try:
    from face_recognition_demo import build_argparser, FrameProcessor
    from faces_database import FacesDatabase
    from face_identifier import FaceIdentifier
except ImportError:
    print(" LỖI: Không tìm thấy module 'face_recognition_demo'. Hãy kiểm tra lại đường dẫn sys.path.")
    sys.exit(1)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NODE_BACKEND_URL_CHECKIN = "http://localhost:8080/api/checkins/post" 
NODE_BACKEND_URL_CHECKOUT = "http://localhost:8080/api/checkouts/post"
DATABASE_DIR = Path("../demo/face_recognition_demo/python/database")
DATABASE_DIR.mkdir(parents=True, exist_ok=True)

print("⏳ Đang load Model AI...")
args = build_argparser().parse_args([
    "-i", "0",
    "-m_fd", "../demo/face_recognition_demo/python/intel/face-detection-adas-0001/FP32/face-detection-adas-0001.xml",
    "-m_lm", "../demo/face_recognition_demo/python/intel/landmarks-regression-retail-0009/FP32/landmarks-regression-retail-0009.xml",
    "-m_reid", "../demo/face_recognition_demo/python/intel/face-reidentification-retail-0095/FP32/face-reidentification-retail-0095.xml",
    "-fg", str(DATABASE_DIR),
    "--no_show"
])

frame_processor = FrameProcessor(args)
faces_database = FacesDatabase(
    args.fg, 
    frame_processor.face_identifier, 
    frame_processor.landmarks_detector, 
    frame_processor.face_detector if args.run_detector else None, 
    args.no_show
)
frame_processor.face_identifier.set_faces_database(faces_database)
print(" AI Engine đã sẵn sàng!")

frame_lock = threading.Lock()
latest_frame = None  # Chứa frame mới nhất từ ESP32

def normalize_filename(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = text.replace(' ', '_')
    text = re.sub(r'[^a-zA-Z0-9_]', '', text)
    return text

def reload_database():
    global faces_database
    try:
        logger.info("Đang cập nhật lại Database nhận diện...")
        new_database = FacesDatabase(
            args.fg, 
            frame_processor.face_identifier, 
            frame_processor.landmarks_detector, 
            frame_processor.face_detector if args.run_detector else None, 
            args.no_show
        )
        faces_database = new_database
        frame_processor.face_identifier.set_faces_database(faces_database)
        logger.info(f" Cập nhật thành công! Tổng số users: {len(faces_database.database)}")
    except Exception as e:
        logger.error(f" Lỗi khi reload database: {e}")

@app.post("/verify-face")
async def verify_face(request: Request):
    global latest_frame
    
    body = await request.body()
    if not body: return "Empty"

    try:
        nparr = np.frombuffer(body, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception:
        return "Error"

    if frame is None: return "Bad Image"

    verified_name = None
    detections = frame_processor.process(frame)

    for roi, landmarks, identity in zip(*detections):
        x_min, y_min = int(roi.position[0]), int(roi.position[1])
        x_max, y_max = int(roi.position[0] + roi.size[0]), int(roi.position[1] + roi.size[1])
        
        cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
        
        if identity.id != FaceIdentifier.UNKNOWN_ID:
            verified_name = frame_processor.face_identifier.get_identity_label(identity.id)
            cv2.putText(frame, verified_name, (x_min, y_min - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        else:
            cv2.putText(frame, "Unknown", (x_min, y_min - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

    with frame_lock:
        latest_frame = frame.copy()

    if verified_name:
        logger.info(f" NHẬN DIỆN: {verified_name}")
        try:
            now = datetime.now()
            current_hour = now.hour
            payload = {"id": verified_name, "timestamp": "now"}
            
            target_url = NODE_BACKEND_URL_CHECKOUT if current_hour > 12 else NODE_BACKEND_URL_CHECKIN
            full_url = f'{target_url}/{verified_name}'
            
            threading.Thread(
                target=requests.post, 
                args=(full_url,), 
                kwargs={'json': payload, 'timeout': 1}
            ).start()
            
        except Exception as e:
            logger.error(f"Lỗi Nodejs: {e}")

    return "OK"

@app.post("/register-user")
async def register_user(name: str = Form(...), file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as e:
        raise HTTPException(status_code=400, detail="File ảnh lỗi")

    if img is None:
        raise HTTPException(status_code=400, detail="Không giải mã được ảnh")

    rois, _, _ = frame_processor.process(img)
    
    if len(rois) == 0:
        raise HTTPException(status_code=400, detail="Không tìm thấy khuôn mặt trong ảnh")
    if len(rois) > 1:
        raise HTTPException(status_code=400, detail="Ảnh có nhiều hơn 1 người, vui lòng chọn ảnh chỉ có 1 người.")

    roi = rois[0] 
    h, w, _ = img.shape

    x_min = max(int(roi.position[0]), 0)
    y_min = max(int(roi.position[1]), 0)
    x_max = min(int(roi.position[0] + roi.size[0]), w)
    y_max = min(int(roi.position[1] + roi.size[1]), h)

    face_crop = img[y_min:y_max, x_min:x_max]

    if face_crop.size == 0:
        raise HTTPException(status_code=400, detail="Lỗi khi cắt khuôn mặt.")

    safe_name = normalize_filename(name)
    user_dir = DATABASE_DIR / safe_name
    if not user_dir.exists():
        user_dir.mkdir(parents=True, exist_ok=True)
    
    filename = f"0.jpg"
    file_path = user_dir / filename
    cv2.imwrite(str(file_path), face_crop)
    
    reload_database()

    return {"status": "success", "message": f"Đã thêm user '{safe_name}'", "path": str(file_path)}

@app.post("/register-from-frame")
async def register_from_frame(name: str = Form(...)):
    global latest_frame
    
    if latest_frame is None:
        raise HTTPException(status_code=400, detail="Chưa nhận được tín hiệu từ Camera")

    with frame_lock:
        img = latest_frame.copy()

    rois, _, _ = frame_processor.process(img)

    if len(rois) == 0:
        raise HTTPException(status_code=400, detail="Không thấy mặt đâu cả! Hãy đứng chính diện.")
    if len(rois) > 1:
        raise HTTPException(status_code=400, detail="Có quá nhiều người trong khung hình.")

    roi = rois[0]
    h, w, _ = img.shape

    x_min = max(int(roi.position[0]), 0)
    y_min = max(int(roi.position[1]), 0)
    x_max = min(int(roi.position[0] + roi.size[0]), w)
    y_max = min(int(roi.position[1] + roi.size[1]), h)

    face_crop = img[y_min:y_max, x_min:x_max]

    if face_crop.size == 0:
        raise HTTPException(status_code=400, detail="Lỗi khi cắt khuôn mặt.")

    safe_name = normalize_filename(name)
    user_dir = DATABASE_DIR / safe_name
    if not user_dir.exists():
        user_dir.mkdir(parents=True, exist_ok=True)
        
    filename = f"0.jpg"
    file_path = user_dir / filename
    cv2.imwrite(str(file_path), face_crop) 

    reload_database()

    return {"status": "success", "message": f"Đã đăng ký '{safe_name}' từ Camera", "path": str(file_path)}

def generate_frames():
    global latest_frame
    while True:
        with frame_lock:
            if latest_frame is None:
                time.sleep(0.01)
                continue
            
            (flag, encodedImage) = cv2.imencode(".jpg", latest_frame)
            if not flag:
                continue
            
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace;boundary=frame")

# ==================== MAIN RUN ====================
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)