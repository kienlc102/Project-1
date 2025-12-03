import express from 'express';
import cors from 'cors';
import webRouter from './router/routers.js';

const app = express();
const PORT = 8080;

const allowedOrigins = [
  "http://localhost:3000",      // React chạy trên máy local
  "http://127.0.0.1:3000",      // React chạy qua loopback IP
  "http://192.168.1.10:3000",   // Ví dụ: React chạy trên điện thoại/máy khác (thay IP máy bạn vào)
  "http://localhost:8000"       // Nếu FastAPI gọi Express (trường hợp hiếm nếu server gọi server)
];

app.use(cors({
    origin: function (origin, callback) {
        // Cho phép request không có origin (như Postman, hoặc server-to-server từ FastAPI/Python)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            // Nếu origin không nằm trong danh sách cho phép
            var msg = 'Lỗi CORS: Domain ' + origin + ' không được phép truy cập.';
            return callback(new Error(msg), false);
        }
        
        // Hợp lệ
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view', './src/views');
app.set('view engine', 'ejs');

webRouter(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});