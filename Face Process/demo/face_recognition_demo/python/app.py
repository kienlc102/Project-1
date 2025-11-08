from flask import Flask, Response
import threading

# Import demo
# Giả sử bạn đã chỉnh demo để expose frame_global
import face_recognition_demo as demo

app = Flask(__name__)

def generate_frames():
    print("1234")
    while True:
        if demo.frame_global is None:
            print("frame global:",demo.frame_global)
            continue
        import cv2
        ret2, buffer = cv2.imencode('.jpg', demo.frame_global)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    return '<h2>OpenVINO Face Recognition Demo</h2><img src="/video_feed" width="640" height="480">'

@app.route('/video_feed')
def video_feed():
    print("123")
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

def run_flask():
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)

# Start Flask thread
threading.Thread(target=run_flask, daemon=True).start()

# Start demo
demo.main()  # giả sử demo gốc có function main()
video_feed()
