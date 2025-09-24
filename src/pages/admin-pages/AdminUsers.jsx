import React, { useEffect, useState } from "react";
import API from "../../api/API.jsx";
import "../../css/adminUsers.css"; // import CSS
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const [users, setUsers] = useState([]);
    const navigate = useNavigate(); // hook for navigation

  useEffect(() => {
    API.get("/admin/getAllUsers")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);



  return (
    <div className="admin-users">
      <h2>All Users</h2>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} onClick={() => navigate(`/admin/user-profile/${user.id}`) }>
              <td>{user.id}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
