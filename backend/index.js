import express from 'express';
import cors from 'cors';
import webRouter from './router/routers.js';

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: "http://localhost:3000", // chấp nhận từ frontend
    credentials: true,               // cho phép gửi cookie/token
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view', './src/views');
app.set('view engine', 'ejs');

webRouter(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});