require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Cấu hình Pool (Hồ bơi kết nối) - Tự động quản lý kết nối đóng/mở
// Kiểm tra xem có đang dùng TiDB không (dựa vào host)
const isTiDB = process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'project1_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Dòng quan trọng mới thêm: Nếu là TiDB thì bật SSL, còn ở Local (Docker) thì tắt
  ssl: isTiDB ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined
});

// Kiểm tra kết nối lúc khởi động (để log ra terminal cho vui)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Cảnh báo: Chưa kết nối được DB ngay lập tức (Docker đang khởi động MySQL...).');
  } else {
    console.log('Kết nối thành công tới Database MySQL!');
    connection.release(); // Trả kết nối về hồ
  }
});

app.get('/', (req, res) => {
  res.send('Backend Node.js đang chạy ổn định!');
});

// API lấy danh sách users
app.get('/api/users', (req, res) => {
  // Dùng pool.query thì nó sẽ tự lấy kết nối sống để chạy lệnh
  pool.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error("Lỗi query:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại port ${port}`);
});