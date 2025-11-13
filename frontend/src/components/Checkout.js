import React from "react";
import { useEffect, useState } from "react";
import Header from "../includes/Header";
import { getCheckoutAll, getCheckoutByUser } from "../services/apiServices";
import { toast } from "react-toastify";

const Checkout = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [userIdInput, setUserIdInput] = useState("");

    useEffect(() => {
    // Load tất cả check-outs ban đầu
    const fetchCheckouts = async () => {
      try {
        const response = await getCheckoutAll();
        const checkoutsArray = response.data.result || [];
        setCheckouts(checkoutsArray);
        toast.success("Fetched all check-outs successfully!");
      } catch (error) {
        toast.error("Failed to fetch check-outs.");
        console.error(error);
      }
    };
    fetchCheckouts();
  }, []);
    // Lấy checkout theo userId
    const handleSearch = async () => {
    if (!userIdInput) return toast.warning("Please enter a User ID");
    try {
      const response = await getCheckoutByUser(userIdInput);
      const checkoutsArray = response.data.result || [];
      setCheckouts(checkoutsArray);
      toast.success(`Fetched check-outs for user ${userIdInput}`);
    } catch (error) {
      toast.error("Failed to fetch check-outs for this user");
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
      <h2 style={{ marginTop: "40px" }}>Checkout Component</h2>

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
      {checkouts.length > 0 ? (
        <div style={{ marginTop: "30px" }}>
          {checkouts.map((item, index) => (
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
                <strong>Checkout ID:</strong> {item.CheckoutId}
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

export default Checkout;