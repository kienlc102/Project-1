import cv2
from pathlib import Path

# Haar Cascade cho detect mặt
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# Thư mục gốc lưu database
BASE_DIR = Path("faces_database")
BASE_DIR.mkdir(exist_ok=True)

person_name = input("Nhập tên người: ")
person_dir = BASE_DIR / person_name
person_dir.mkdir(exist_ok=True)

cap = cv2.VideoCapture(0)
count = 0
print("Nhấn 'c' để chụp ảnh, 'q' để thoát.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    # Vẽ rectangle quanh mặt
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    cv2.imshow("Webcam", frame)
    key = cv2.waitKey(1) & 0xFF

    if key == ord("c"):
        if len(faces) == 0:
            print("Không detect được mặt!")
            continue

        # Chỉ lấy mặt đầu tiên detect được
        x, y, w, h = faces[0]
        face_img = frame[y:y + h, x:x + w]
        count += 1
        filename = person_dir / f"{count}.jpg"
        cv2.imwrite(str(filename), face_img)
        print(f"Đã lưu: {filename}")

    elif key == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
