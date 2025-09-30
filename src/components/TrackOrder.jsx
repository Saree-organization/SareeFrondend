import React, { useEffect, useState } from "react";
import API from "../api/API";
import { Link, useNavigate } from "react-router-dom";
import "../css/TrackOrder.css";

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

  const handleStatusChange = (orderId) => {
    API.put(`admin/paymentChangeStatus/${orderId}/status`, {
      status: "Exchange",
    })
      .then(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.razorpayOrderId === orderId
              ? { ...o, orderStatus: "Exchange" }
              : o
          )
        );
        alert(
          "Exchange requested successfully! An admin will review your request."
        );
      })
      .catch((err) => {
        console.error("Failed to request exchange:", err);
        alert("Failed to request exchange. Try again later.");
      });
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
                    <span
                      className={`badge rounded-pill bg-${
                        order.paymentStatus === "Success"
                          ? "success"
                          : "warning"
                      } fs-6`}
                    >
                      {order.paymentStatus}
                    </span>
                    <span
                      className={`badge rounded-pill bg-${
                        order.orderStatus === "Delivered"
                          ? "success"
                          : order.orderStatus === "Exchange"
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
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0">
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: "5%" }}>
                          #
                        </th>
                        <th scope="col" style={{ width: "15%" }}>
                          Image
                        </th>
                        <th scope="col" style={{ width: "40%" }}>
                          Product Name
                        </th>
                        <th
                          scope="col"
                          className="text-center"
                          style={{ width: "20%" }}
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="text-end"
                          style={{ width: "20%" }}
                        >
                          Price
                        </th>
                      </tr>
                    </thead>
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
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center text-muted py-3"
                          >
                            No items found for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {order.orderStatus === "Delivered" && (
                  <div className="p-3 text-end border-top">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleStatusChange(order.razorpayOrderId)}
                    >
                      Request Exchange 🔄
                    </button>
                  </div>
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
