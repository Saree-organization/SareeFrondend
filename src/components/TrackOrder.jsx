import React, { useEffect, useState } from "react";
import API from "../api/API";
import "../css/TrackOrder.css";
import { Link, useNavigate } from "react-router-dom";

function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Debugging: check if token is being retrieved
        console.log("Auth token:", token);

        if (!token) {
          setError("Please log in to view your orders.");
          setLoading(false);
          return;
        }

        const response = await API.get("/api/payment/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setError("Failed to fetch order data.");
          setOrders([]);
        }
      } catch (err) {
        console.error("API call failed:", err);

        if (err.response && err.response.status === 401) {
          // Token might be invalid or expired
          setError("Session expired. Please log in again.");
          localStorage.removeItem("authToken");

          // Optional: redirect to login
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setError("Failed to fetch orders. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="track-order-page">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-order-page">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="track-order-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>
          You have not placed any orders yet. <Link to="/">Start shopping</Link>
          .
        </p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order ID: {order.razorpayOrderId || "N/A"}</h3>
                <span className={`order-status ${order.status?.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p>Total Amount: Rs. {order.totalAmount}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items && order.items.length > 0 ? (
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.variant?.name || "Unnamed Item"} - Qty:{" "}
                        {item.quantity} - Price: Rs. {item.price}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No items found for this order.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
