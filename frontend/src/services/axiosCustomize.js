// src/services/axiosCustomize.js
import axios from "axios";
import { toast } from "react-toastify";

// Tạo instance axios riêng
const instance = axios.create({
  baseURL: "http://localhost:8080", // đổi theo backend của bạn
  withCredentials: true, // nếu cần gửi cookie/session
});

// Interceptor cho request (gắn token nếu có)
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response (xử lý lỗi tự động)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) toast.error("Unauthorized. Please log in again.");
      else if (status === 404) toast.error("API not found.");
      else if (status >= 500) toast.error("Server error.");
      else toast.error(error.response.data.message || "Error occurred.");
    } else {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export default instance;
