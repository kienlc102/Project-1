from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import numpy as np
import cv2
import base64
import threading
import sys

# Thêm đường dẫn đến demo Open Model Zoo
sys.path.append("../demo/face_recognition_demo/python")

from face_recognition_demo import build_argparser, FrameProcessor
from faces_database import FacesDatabase
from face_identifier import FaceIdentifier

app = FastAPI()

# Cho phép React frontend truy cập
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # hoặc domain thật nếu deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Config ====================
DATABASE_DIR = Path("../demo/face_recognition_demo/python/database")
DATABASE_DIR.mkdir(parents=True, exist_ok=True)

# Khởi tạo pipeline nhận diện khuôn mặt
args = build_argparser().parse_args([
    "-i", "0",  # placeholder
    "-m_fd", "../demo/face_recognition_demo/python/intel/face-detection-adas-0001/FP32/face-detection-adas-0001.xml",
    "-m_lm", "../demo/face_recognition_demo/python/intel/landmarks-regression-retail-0009/FP32/landmarks-regression-retail-0009.xml",
    "-m_reid", "../demo/face_recognition_demo/python/intel/face-reidentification-retail-0095/FP32/face-reidentification-retail-0095.xml",
    "-fg", str(DATABASE_DIR),
    "--no_show"
])

frame_processor = FrameProcessor(args)
faces_database = FacesDatabase(args.fg, frame_processor.face_identifier,
                               frame_processor.landmarks_detector,
                               frame_processor.face_detector if args.run_detector else None,
                               args.no_show)
frame_processor.face_identifier.set_faces_database(faces_database)

# Đảm bảo thread an toàn
frame_lock = threading.Lock()


# ==================== API ====================

class ImageData(BaseModel):
    image: str  # base64 từ frontend


@app.post("/verify-face")
async def verify_face(data: ImageData):
    """
    Nhận ảnh base64 từ frontend, chạy nhận diện, trả về verified_name hoặc null.
    """
    if not data.image:
        return {"id": "null"}

    # Giải mã base64 thành ảnh OpenCV
    try:
        header, encoded = data.image.split(",", 1)
    except ValueError:
        encoded = data.image
    img_data = base64.b64decode(encoded)
    np_img = np.frombuffer(img_data, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if frame is None:
        return {"id": None}

    with frame_lock:
        detections = frame_processor.process(frame)

    verified_name = None

    for roi, landmarks, identity in zip(*detections):
        if identity.id != FaceIdentifier.UNKNOWN_ID:
            verified_name = frame_processor.face_identifier.get_identity_label(identity.id)
            break  # chỉ lấy khuôn mặt đầu tiên nhận được

    return {"id": verified_name,
            "message": "Face Recognition API — Trả về verified_name hoặc null "}


@app.get("/")
def root():
    return {"message": "Face Recognition API — Trả về verified_name hoặc null"}


# ==================== Run ====================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)