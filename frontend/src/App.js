import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  
  // Lấy URL API từ biến môi trường hoặc dùng mặc định localhost
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Lỗi fetch:", err));
  }, [API_URL]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Danh sách User (Project 1) - Chiều Thứ Hai - Ca3 - Thực hành OSS</h1>
      <p>Backend URL: {API_URL}</p>
      <ul>
        {users.length > 0 ? (
          users.map(user => (
            <li key={user.id}>{user.name} - {user.email}</li>
          ))
        ) : (
          <li>Đang tải dữ liệu hoặc chưa kết nối được Backend...</li>
        )}
      </ul>
    </div>
  );
}

export default App;