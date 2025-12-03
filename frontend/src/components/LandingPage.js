import React from "react";
import Header from "../includes/Header";
import "../styles/landing.css";
import CameraView from "./CameraView";

const LandingPage = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ff512f 30%, #dd2476 90%)",
        minHeight: "100vh",
        color: "white",
        textAlign: "center",
      }}
    >
      <Header />
      <br />
      <br />
      <br />
      <br />

      <div className="landing-text">
        <h1>
          Project 1: Hệ thống camera checkin checkout dùng nhận dụng khuôn mặt
        </h1>
        <p>Được thực hiện bởi: Ngô Chí Kiên - 20235355</p>
        
        {/* Thẻ p này chỉ được chứa text và thẻ a, KHÔNG ĐƯỢC chứa CameraView */}
        <p>
          Link github project:{" "}
          <a
            href="https://github.com/kienlc102/Project-1"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fff", textDecoration: "underline", marginLeft: "0.5rem" }}
          >
            kienlc102/Project-1
          </a>
        </p>
      </div>

      {/* CameraView phải nằm RA NGOÀI thẻ div landing-text hoặc ít nhất là ra ngoài thẻ p */}
      <CameraView />
      
    </div>
  );
};

export default LandingPage;