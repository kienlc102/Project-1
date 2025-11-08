import os
import shutil

def flatten_database(input_folder="database", output_folder="gallery"):
    """
    Chép tất cả ảnh từ các folder con trong database/ vào gallery/,
    đổi tên file theo dạng <folder>_<số>.jpg để demo nhận dạng đúng tên.
    """
    if os.path.exists(output_folder):
        shutil.rmtree(output_folder)
    os.makedirs(output_folder, exist_ok=True)

    for person_name in os.listdir(input_folder):
        person_dir = os.path.join(input_folder, person_name)
        if not os.path.isdir(person_dir):
            continue

        for idx, filename in enumerate(os.listdir(person_dir)):
            if filename.lower().endswith((".jpg", ".jpeg", ".png")):
                src = os.path.join(person_dir, filename)
                dst = os.path.join(output_folder, f"{person_name}_{idx}.jpg")
                shutil.copy2(src, dst)

    print(f"✅ Gallery prepared at {output_folder}, ready for face_recognition_demo.py")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--db", default="database", help="Folder database chứa các subfolder mỗi người")
    parser.add_argument("--gallery", default="gallery", help="Folder đầu ra để demo sử dụng")
    args = parser.parse_args()

    flatten_database(args.db, args.gallery)

