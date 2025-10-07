import React, { useEffect, useState } from "react";
import API from "../../api/API.jsx";
import "../../css/adminUsers.css";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // profile icon

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = (pageNumber = 0, size = 10) => {
    API.get(`/admin/getAllUsers?page=${pageNumber}&size=${size}`)
      .then((res) => {
        console.log(res.data)
        setUsers(res.data.users);
        setPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.totalItems);
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  return (
    <div className="admin-users">
      <h2>All Users ({totalItems})</h2>

      <div className="user-grid">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="user-card"
              onClick={() => navigate(`/admin/user-profile/${user.id}`)}
            >
              <div className="user-icon">
                <User size={36} color="#0077b6" />
              </div>
              <div className="user-info">
                <p className="user-id">ID: {user.id}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <button onClick={() => fetchUsers(page - 1)} disabled={page === 0}>Prev</button>
        <span> Page {page + 1} of {totalPages} </span>
        <button onClick={() => fetchUsers(page + 1)} disabled={page + 1 === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default AdminUsers;
