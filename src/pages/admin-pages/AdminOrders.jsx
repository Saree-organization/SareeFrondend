import React, { useEffect, useState } from 'react';
import API from "../../api/API";
import "../../css/adminOrders.css";
import { useNavigate } from 'react-router-dom';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // filter form state
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // applied filters
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedDate, setAppliedDate] = useState("");

  useEffect(() => {
    API.get(`/api/payment/admin-orders`)
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  // click to apply filters
  const handleFilterClick = () => {
    setAppliedStatus(filterStatus);
    setAppliedDate(filterDate);
  };

  // filtered list
  const filteredOrders = orders.filter(o => {
    let statusOk = true;
    let dateOk = true;

    if (appliedStatus) {
      statusOk = o.status.toUpperCase() === appliedStatus.toUpperCase();
    }
    if (appliedDate) {
      const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
      dateOk = orderDate === appliedDate;
    }
    return statusOk && dateOk;
  });

  if (orders.length === 0) return <div>No orders found.</div>;

  return (
    <div className="admin-orders">
      {/* Filters */}
      <div className="filters">
        <label>
          Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>
        <button className="filter-btn" onClick={handleFilterClick}>Filter</button>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.razorpayOrderId} onClick={() => navigate(`/admin/user-profile/${order.userId}`)}>
              <td>{order.userId}</td>
              <td>{order.razorpayOrderId}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>
                {order.items && order.items.length > 0 && (
                  <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                    {order.items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: "8px" }}>
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "8px" }}
                        />
                        {item.productName} × {item.quantity} @ ₹{item.price}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;
