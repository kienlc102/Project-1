import React, { useState } from "react";
import Header from "../includes/Header";
import axios from "axios";
import { toast } from "react-toastify";
import CameraView from "./CameraView";

const RegisterUser = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const PYTHON_API = "http://localhost:8000";

  // --- LOGIC GIỮ NGUYÊN ---
  const handleLiveRegister = async () => {
    if (!name.trim()) return toast.warning("Vui lòng nhập tên trước!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      const res = await axios.post(`${PYTHON_API}/register-from-frame`, formData);
      toast.success(res.data.message);
      setName(""); 
    } catch (err) {
      const msg = err.response?.data?.detail || "Lỗi kết nối server!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !file) return toast.warning("Vui lòng nhập tên và chọn ảnh!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);
      const res = await axios.post(`${PYTHON_API}/register-user`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      setName("");
      setFile(null);
      document.getElementById("fileInput").value = ""; 
    } catch (err) {
      const msg = err.response?.data?.detail || "Lỗi kết nối server!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ================= STYLES =================
  const pageStyle = {
    background: "linear-gradient(135deg, #ff512f 30%, #dd2476 90%)",
    minHeight: "100vh",
    color: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    paddingBottom: "50px",
  };

  // Wrapper để chứa 2 cột (Camera và Form)
  const mainContainer = {
    display: "flex",
    flexDirection: "row",     // Xếp ngang
    flexWrap: "wrap",         // Tự xuống dòng trên mobile
    justifyContent: "center", // Căn giữa màn hình
    alignItems: "flex-start", // Căn đỉnh
    gap: "40px",              // Khoảng cách giữa Camera và Form
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px"
  };

  // Style chung cho các khối kính mờ
  const glassBase = {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  };

  // Khối chứa Camera (Bên trái)
  const cameraSection = {
    ...glassBase,
    flex: "1 1 400px", // Co giãn, tối thiểu 400px
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px" // Đảm bảo chiều cao cân đối
  };

  // Khối chứa Form (Bên phải)
  const formSection = {
    ...glassBase,
    flex: "1 1 400px", // Co giãn, tối thiểu 400px
    textAlign: "center"
  };

  // ... Các style nhỏ giữ nguyên ...
  const labelStyle = { display: "block", textAlign: "left", fontWeight: "bold", marginBottom: "10px", marginLeft: "10px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.9 };
  const inputStyle = { width: "100%", padding: "15px 25px", borderRadius: "30px", border: "none", outline: "none", background: "rgba(255, 255, 255, 0.9)", color: "#333", fontSize: "16px", marginBottom: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", boxSizing: "border-box" };
  const buttonPrimary = { width: "100%", padding: "15px", borderRadius: "30px", border: "none", cursor: "pointer", background: "#fff", color: "#dd2476", fontWeight: "bold", fontSize: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", transition: "transform 0.2s, box-shadow 0.2s", marginTop: "10px" };
  const buttonSecondary = { ...buttonPrimary, background: "transparent", border: "2px solid rgba(255,255,255,0.8)", color: "#fff", boxShadow: "none" };
  const dividerStyle = { display: "flex", alignItems: "center", margin: "30px 0", color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: "bold" };
  const lineStyle = { flex: 1, height: "1px", background: "rgba(255,255,255,0.3)" };

  return (
    <div style={pageStyle}>
      <Header />
      
      {/* Tiêu đề trang */}
      <div style={{ padding: "40px 0 20px 0", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0,0,0,0.2)", margin: 0 }}>
          Đăng Ký Thành Viên
        </h2>
        <p style={{ opacity: 0.8, marginTop: "10px" }}>Quét khuôn mặt trực tiếp hoặc tải ảnh lên</p>
      </div>

      {/* CONTAINER CHÍNH: Xếp Camera và Form ngang hàng */}
      <div style={mainContainer}>
        
        {/* CỘT 1: CAMERA VIEW */}
        <div style={cameraSection}>
           <h3 style={{marginBottom: "20px", opacity: 0.9}}>Live Camera</h3>
           {/* Đặt CameraView vào đây */}
           <div style={{ width: "100%", borderRadius: "15px", overflow: "hidden" }}>
              <CameraView />
           </div>
           <p style={{marginTop: "15px", fontSize: "13px", opacity: 0.7}}>
             * Hãy giữ khuôn mặt ở chính giữa khung hình
           </p>
        </div>

        {/* CỘT 2: FORM ĐĂNG KÝ */}
        <div style={formSection}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>1. Nhập ID / Tên</label>
            <input
              type="text"
              placeholder="Ví dụ: 20235555"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
             <label style={labelStyle}>2. Chọn phương thức</label>
             <button 
              onClick={handleLiveRegister} 
              disabled={loading}
              style={buttonPrimary}
              onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
            >
              {loading ? "Đang xử lý..." : "📸 Chụp & Đăng ký từ Camera"}
            </button>
          </div>

          <div style={dividerStyle}>
            <div style={lineStyle}></div>
            <span style={{ padding: "0 15px" }}>HOẶC</span>
            <div style={lineStyle}></div>
          </div>

          <form onSubmit={handleUploadRegister}>
            <input 
              id="fileInput"
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ ...inputStyle, padding: "10px", background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer" }} 
            />
            <button 
              type="submit" 
              disabled={loading}
              style={buttonSecondary}
              onMouseOver={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.transform = "scale(1.02)"; }}
              onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.transform = "scale(1)"; }}
            >
              {loading ? "Đang tải lên..." : "⬆️ Tải ảnh từ máy"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default RegisterUser;