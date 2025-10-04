import React, { useEffect, useState } from 'react';
import API from "../../api/API";
import "../../css/adminOrders.css";
import { useNavigate } from 'react-router-dom';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedDate, setAppliedDate] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    API.get(`/api/payment/admin-orders`)
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  };

  const handleFilterClick = () => {
    setAppliedStatus(filterStatus);
    setAppliedDate(filterDate);
  };

  const handleStatusChange = (orderId, newStatus) => {
    API.put(`admin/paymentChangeStatus/${orderId}/status`, { status: newStatus })
      .then(() => fetchOrders())
      .catch(err => console.error("Error updating status:", err));
  };

  console.log(orders)
  const filteredOrders = orders.filter(o => {
    let statusOk = true;
    let dateOk = true;

    if (appliedStatus) {
      statusOk = (o.orderStatus?.toUpperCase() || "") === appliedStatus.toUpperCase();
    }
    if (appliedDate) {
      const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
      dateOk = orderDate === appliedDate;
    }
    return statusOk && dateOk;
  });

  if (orders.length === 0) return <div className="no-orders">No orders found.</div>;

const getNextStatuses = (status) => {
  switch (status) {
    case "Shipping":
      return ["Out for Delivery"];
    case "Out for Delivery":
      return ["Delivered"];
    case "Request For Exchange":   
      return ["Approved For Exchange", "Rejected For Exchange"];
    case "Approved For Exchange":   
      return ["Exchanged"];
    case "Rejected For Exchange":   
      return ["Approved For Exchange"]  
    default:
      return [];
  }
}

  return (
    <div className="admin-orders">
      {/* Filters */}
      <div className="filters">
        <label>
          Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
           
            <option value="Cancalled">Cancalled</option>
            <option value="Shipping">Shipping</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Exchange">Exchange</option>
            <option value="Exchanged">Exchanged</option>
          </select>
        </label>
        <label>
          Date:
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        </label>
        <button className="filter-btn" onClick={handleFilterClick}>Filter</button>
      </div>

      <table className="orders-table">
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
            <tr key={order.razorpayOrderId}>
              <td>{order.userId}</td>
              <td>{order.razorpayOrderId}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>₹{order.totalAmount}</td>
              <td className="status-cell">
                <span className={`status-text ${order.orderStatus.replace(/\s+/g, '-').toLowerCase()}`}>
                  {order.orderStatus}
                </span>
                {getNextStatuses(order.orderStatus).length > 0 && (
                  <select
                    className="status-select"
                    onChange={(e) => handleStatusChange(order.razorpayOrderId, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Change Status</option>
                    {getNextStatuses(order.orderStatus).map((next) => (
                      <option key={next} value={next}>{next}</option>
                    ))}
                  </select>
                )}
              </td>
              <td>
                {order.items && order.items.length > 0 && (
                  <ul className="items-list">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="item">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="item-img"
                          onClick={() => navigate(`/admin/user-profile/${order.userId}`)}
                        />
                        <span className="item-text">
                          {item.productName} × {item.quantity} @ ₹{item.price}
                        </span>
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
