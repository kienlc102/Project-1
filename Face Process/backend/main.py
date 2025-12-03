from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse 
from pathlib import Path


import numpy as np
import cv2
import threading
import sys
import requests
import logging
import time
from datetime import datetime


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FaceAuth")
sys.path.append("../demo/face_recognition_demo/python")

try:
    from face_recognition_demo import build_argparser, FrameProcessor
    from faces_database import FacesDatabase
    from face_identifier import FaceIdentifier
except ImportError:
    print("❌ LỖI: Không tìm thấy module 'face_recognition_demo'.")
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

print("Đang load Model AI...")
args = build_argparser().parse_args([
    "-i", "0",
    "-m_fd", "../demo/face_recognition_demo/python/intel/face-detection-adas-0001/FP32/face-detection-adas-0001.xml",
    "-m_lm", "../demo/face_recognition_demo/python/intel/landmarks-regression-retail-0009/FP32/landmarks-regression-retail-0009.xml",
    "-m_reid", "../demo/face_recognition_demo/python/intel/face-reidentification-retail-0095/FP32/face-reidentification-retail-0095.xml",
    "-fg", str(DATABASE_DIR),
    "--no_show"
])
frame_processor = FrameProcessor(args)
faces_database = FacesDatabase(args.fg, frame_processor.face_identifier, frame_processor.landmarks_detector, frame_processor.face_detector if args.run_detector else None, args.no_show)
frame_processor.face_identifier.set_faces_database(faces_database)
print(" AI Engine đã sẵn sàng!")

# ==================== 1. BIẾN TOÀN CỤC ĐỂ CHỨA ẢNH ====================
frame_lock = threading.Lock()
latest_frame = None # Biến này sẽ chứa ảnh mới nhất từ ESP32 gửi lên

# ==================== 2. API NHẬN ẢNH TỪ ESP32 ====================
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

    # Xử lý nhận diện
    verified_name = None
    detections = frame_processor.process(frame)

    # Vẽ khung hình chữ nhật và tên lên ảnh để hiển thị trên React
    for roi, landmarks, identity in zip(*detections):
        # Lấy toạ độ box
        x_min, y_min = int(roi.position[0]), int(roi.position[1])
        x_max, y_max = int(roi.position[0] + roi.size[0]), int(roi.position[1] + roi.size[1])
        
        # Vẽ box
        cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
        
        if identity.id != FaceIdentifier.UNKNOWN_ID:
            verified_name = frame_processor.face_identifier.get_identity_label(identity.id)
            # Viết tên người nhận diện được
            cv2.putText(frame, verified_name, (x_min, y_min - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        else:
            cv2.putText(frame, "Unknown", (x_min, y_min - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

    with frame_lock:
        latest_frame = frame.copy() # Lưu bản sao của frame đã vẽ

    # gửi Node.js 
    if verified_name:
        logger.info(f"✅ NHẬN DIỆN: {verified_name}")
        try:
            now = datetime.now()
            current_hour = now.hour
            payload = {"id": verified_name, "timestamp": "now"}
            if current_hour > 12:
                threading.Thread(target=requests.post, args=(f'{NODE_BACKEND_URL_CHECKIN}/{verified_name}',), kwargs={'json': payload, 'timeout': 1}).start()
            else:
                threading.Thread(target=requests.post, args=(f'{NODE_BACKEND_URL_CHECKOUT}/{verified_name}',), kwargs={'json': payload, 'timeout': 1}).start()
        except Exception as e:
            logger.error(f"Lỗi Nodejs: {e}")

    return "OK"

# ==================== 3. HÀM TẠO STREAM CHO REACT ====================
def generate_frames():
    global latest_frame
    while True:
        with frame_lock:
            if latest_frame is None:
                time.sleep(0.01)
                continue
            
            # Encode ảnh sang JPEG
            (flag, encodedImage) = cv2.imencode(".jpg", latest_frame)
            if not flag:
                continue
            
        # Trả về format MJPEG
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')
        
        # Giới hạn FPS gửi đi để giảm tải (ví dụ 0.03s ~ 30fps)
        # time.sleep(0.03)

# ==================== 4. API STREAM VIDEO ====================
@app.get("/video_feed")
async def video_feed():
    """React sẽ gọi vào link này để lấy hình ảnh"""
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace;boundary=frame")

# ... (Main run giữ nguyên) ...
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)