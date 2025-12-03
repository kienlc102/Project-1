import React from 'react';

const CameraView = () => {
  // Đường dẫn đến API Python stream video
  const VIDEO_STREAM_URL = "http://localhost:8000/video_feed";

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Camera Giám Sát (Face ID)</h1>
      
      <div style={{ border: '5px solid #333', display: 'inline-block' }}>
        {/* Chỉ cần gán src vào thẻ img */}
        <img 
          src={VIDEO_STREAM_URL} 
          alt="Live Camera Feed" 
          width="640" 
          height="480"
          style={{ display: 'block' }}
        />
      </div>
      
      <p>Đang nhận dữ liệu từ Python Server...</p>
    </div>
  );
};

export default CameraView;