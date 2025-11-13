import React, { useEffect, useState } from "react";
import Header from "../includes/Header";
import { getCheckinAll, getCheckinByUser } from "../services/apiServices";
import { toast } from "react-toastify";

const Checkin = () => {
  const [checkins, setCheckins] = useState([]);
  const [userIdInput, setUserIdInput] = useState("");

  useEffect(() => {
    // Load tất cả check-ins ban đầu
    const fetchCheckins = async () => {
      try {
        const response = await getCheckinAll();
        const checkinsArray = response.data.result || [];
        setCheckins(checkinsArray);
        toast.success("Fetched all check-ins successfully!");
      } catch (error) {
        toast.error("Failed to fetch check-ins.");
        console.error(error);
      }
    };
    fetchCheckins();
  }, []);

  // Lấy checkin theo userId
  const handleSearch = async () => {
    if (!userIdInput) return toast.warning("Please enter a User ID");

    try {
      const response = await getCheckinByUser(userIdInput);
      const checkinsArray = response.data.result || [];
      setCheckins(checkinsArray);
      toast.success(`Fetched check-ins for user ${userIdInput}`);
    } catch (error) {
      toast.error("Failed to fetch check-ins for this user");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ff512f 30%, #dd2476 90%)",
        minHeight: "100vh",
        color: "white",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <Header />
      <h2 style={{ marginTop: "40px" }}>Checkin Component</h2>

      {/* Input tìm kiếm theo User ID */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userIdInput}
          onChange={(e) => setUserIdInput(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "none" }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 15px",
            marginLeft: "10px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#fff",
            color: "#dd2476",
          }}
        >
          Search
        </button>
      </div>

      {/* Hiển thị danh sách check-ins */}
      {checkins.length > 0 ? (
        <div style={{ marginTop: "30px" }}>
          {checkins.map((item, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                padding: "15px",
                margin: "10px auto",
                width: "50%",
              }}
            >
              <p>
                <strong>Checkin ID:</strong> {item.CheckinId}
              </p>
              <p>
                <strong>User ID:</strong> {item.userId}
              </p>
              <p>
                <strong>Time:</strong> {new Date(item.time).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: "30px" }}>No check-ins found.</p>
      )}
    </div>
  );
};

export default Checkin;
