import React, { useEffect, useState } from 'react';
import API from "../../api/API";
import "../../css/adminOrders.css";
import { useNavigate } from 'react-router-dom';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  // filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedDate, setAppliedDate] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = (pageNumber = 0, size = 5, status = appliedStatus, date = appliedDate) => {
    const params = new URLSearchParams();
    params.append("page", pageNumber);
    params.append("size", size);

    if (status) params.append("status", status);
    if (date) params.append("date", date);

    API.get(`/api/payment/admin-orders?${params.toString()}`)
      .then(res => {
        setOrders(res.data.orders);
        setPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.totalItems);
      })
      .catch(err => console.error("Error fetching orders:", err));
  };

  const handleFilterClick = () => {
    setAppliedStatus(filterStatus);
    setAppliedDate(filterDate);
    fetchOrders(0, 5, filterStatus, filterDate); // use current filter values
  };

  const clearFilters = () => {
    setFilterStatus("");
    setFilterDate("");
    setAppliedStatus("");
    setAppliedDate("");
    fetchOrders(0, 5, "", ""); // reset filters
  };

  const handleStatusChange = (orderId, newStatus) => {
    API.put(`admin/paymentChangeStatus/${orderId}/status`, { status: newStatus })
      .then(() => fetchOrders(page))
      .catch(err => console.error("Error updating status:", err));
  };

  const getNextStatuses = (status) => {
    switch (status) {
      case "Shipping": return ["Out for Delivery"];
      case "Out for Delivery": return ["Delivered"];
      case "Request For Exchange": return ["Approved For Exchange", "Rejected For Exchange"];
      case "Approved For Exchange": return ["Exchanged"];
      case "Rejected For Exchange": return ["Approved For Exchange"];
      default: return [];
    }
  };

  return (
    <div className="admin-orders">
      {/* Filters */}
      <div className="filters">
        <label>
          Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Shipping">Shipping</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Request For Exchange">Request For Exchange</option>
            <option value="Approved For Exchange">Approved For Exchange</option>
            <option value="Rejected For Exchange">Rejected For Exchange</option>
            <option value="Exchanged">Exchanged</option>
          </select>
        </label>
        <label>
          Date:
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        </label>
        <button className="filter-btn" onClick={handleFilterClick}>Apply</button>
        <button className="clear-btn" onClick={clearFilters}>Clear</button>
      </div>

      {/* Total Orders */}
      <div className="total-orders">
        Total Orders: {totalItems}
      </div>

      {/* Orders Table */}
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
          {orders.map(order => (
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
                    {getNextStatuses(order.orderStatus).map(next => (
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

      {/* Pagination */}
      <div className="pagination-container">
        <button disabled={page === 0} onClick={() => fetchOrders(page - 1)}>Prev</button>
        <span> Page {page + 1} of {totalPages} </span>
        <button disabled={page + 1 === totalPages} onClick={() => fetchOrders(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default AdminOrders;
