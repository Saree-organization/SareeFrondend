import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from "../../api/API";
import "../../css/adminUserProfile.css";

function AdminUserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Fetch user info
    API.get(`/api/payment/admin/user/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => setError(err.response?.data || "Failed to fetch user"));
  }, [userId]);

  useEffect(() => {
    // Fetch paginated user orders
    API.get(`/api/payment/admin/user-orders/${userId}?page=${page}&size=5`)
      .then(res => {
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error("Error fetching orders:", err));
  }, [userId, page]);

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading user...</div>;

  return (
    <div className="admin-user-profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>

      <h3>User Orders</h3>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} className="order-card">
            <p><strong>Order ID:</strong> {order.razorpayOrderId}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  <img src={item.imageUrl} alt={item.productName} />
                  {item.productName} × {item.quantity} @ ₹{item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}



       <div className="pagination-container">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button disabled={page + 1 === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default AdminUserProfile;
