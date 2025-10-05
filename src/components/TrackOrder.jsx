import React, { useEffect, useState } from "react";
import API from "../api/API";
import { Link, useNavigate } from "react-router-dom";
import "../css/TrackOrder.css";

// एक्सचेंज के लिए अधिकतम दिनों की सीमा (इसे Backend की ExchangeService से मैच करना चाहिए)
const EXCHANGE_WINDOW_DAYS = 15;

function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Please log in to view your orders.");
          setLoading(false);
          return;
        }

        const response = await API.get("/api/payment/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          const updatedOrders = response.data.map((order) => ({
            ...order,
            // सुनिश्चित करें कि orderStatus सेट है
            orderStatus: order.orderStatus || "Processing",
          }));
          setOrders(updatedOrders);
        } else {
          setError("Failed to fetch order data.");
          setOrders([]);
        }
      } catch (err) {
        console.error("API call failed:", err);
        if (err.response && err.response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("authToken");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError("Failed to fetch orders. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // पुराने handleStatusChange फ़ंक्शन को हटा दिया गया है
  // क्योंकि Exchange अब एक अलग API और फ़्लो के माध्यम से होता है।

  const isExchangePossible = (order) => {
    if (order.orderStatus !== "Delivered") {
      return false;
    }
    // डिलीवरी की तारीख से एक्सचेंज विंडो चेक करें (backend logic से मेल खाता है)
    const deliveredDate = new Date(order.createdAt); // यहां आपको Order Entity में DeliveredDate चाहिए होगा
    const currentDate = new Date();
    const daysSinceDelivery =
      (currentDate - deliveredDate) / (1000 * 60 * 60 * 24);

    return daysSinceDelivery <= EXCHANGE_WINDOW_DAYS;
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center loader-container">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Fetching your orders, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <p className="alert alert-danger">{error}</p>
        {error.includes("log in") && (
          <Link to="/login" className="btn btn-primary mt-3">
            Go to Login
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-5 track-order-page">
      <h2 className="mb-4 text-center">My Orders 📦</h2>
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="alert alert-info">
            You have not placed any successful orders yet.
            <Link to="/" className="alert-link ms-2">
              Start shopping
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.razorpayOrderId} className="card mb-4 shadow-sm">
              <div className="card-header bg-light p-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <h5 className="mb-2 mb-sm-0 me-3">
                    Order ID:{" "}
                    <span className="fw-normal text-muted">
                      {order.razorpayOrderId || "N/A"}
                    </span>
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    {/* Payment Status Badge */}
                    <span
                      className={`badge rounded-pill bg-${
                        order.paymentStatus === "Success"
                          ? "success"
                          : "warning"
                      } fs-6`}
                    >
                      {order.paymentStatus}
                    </span>
                    {/* Order Status Badge */}
                    <span
                      className={`badge rounded-pill bg-${
                        order.orderStatus === "Delivered"
                          ? "success"
                          : order.orderStatus.includes("Exchange")
                          ? "info"
                          : order.orderStatus === "Shipping" ||
                            order.orderStatus === "Processing"
                          ? "primary"
                          : "secondary"
                      } fs-6`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
                <p className="card-text text-muted mb-0 mt-2">
                  Total Amount:{" "}
                  <span className="fw-bold">Rs. {order.totalAmount}</span>
                </p>
                <p className="card-text text-muted">
                  Order Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0">
                    {/* Table Headings... */}
                    <tbody>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <img
                                src={
                                  item.imageUrl ||
                                  "https://via.placeholder.com/50"
                                }
                                alt={item.productName || "Product"}
                                className="img-thumbnail"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td>{item.productName || "Unnamed Item"}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">
                              Rs. {item.price * item.quantity}
                            </td>
                            {/* NEW: Exchange Button for each Order Item */}
                            <td className="text-end">
                              {/*
                                💡 महत्वपूर्ण: OrderItem ID के लिए आपको
                                OrderItemResponse DTO में एक 'orderItemId' फील्ड
                                जोड़ना होगा, जो Backend से आ रहा हो।
                              */}
                              {isExchangePossible(order) &&
                                order.orderStatus !== "Exchange_Processing" && (
                                  <Link
                                    // हम Item ID और Order ID दोनों को भेज रहे हैं
                                    to={`/exchange-request/${order.razorpayOrderId}/${item.orderItemId}`}
                                    className="btn btn-outline-info btn-sm ms-2"
                                  >
                                    Exchange 🔄
                                  </Link>
                                )}

                              {order.orderStatus.includes("Exchange") && (
                                <span className="text-info fw-bold">
                                  In Exchange Process
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center text-muted py-3"
                          >
                            No items found for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Note: Total Order Exchange Button removed. Individual item exchange is better. */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
