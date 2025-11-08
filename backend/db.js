const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,       // Cổng MySQL mặc định XAMPP
  user: 'root',
  password: '',      // hoặc mật khẩu bạn đặt trong XAMPP
  database: 'testdb', // tên database của bạn
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
