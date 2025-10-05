import React, { useEffect, useState } from "react";
import API from "../api/API";
import { Link, useNavigate } from "react-router-dom";
import "../css/TrackOrder.css";

function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchOrders = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      const response = await API.get("/api/payment/orders", {
        params: { page: pageNumber, size: 5 }, // 5 orders per page
        headers: { Authorization: `Bearer ${token}` },
      });

      const { orders: newOrders, currentPage, totalPages } = response.data;

      setOrders(newOrders);
      setPage(currentPage);
      setTotalPages(totalPages);

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

  useEffect(() => {
    fetchOrders(0);
  }, [navigate]);

  const handleStatusChange = (orderId) => {
    API.put(`admin/paymentChangeStatus/${orderId}/status`, {
      status: "Request For Exchange",
    })
      .then(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.razorpayOrderId === orderId
              ? { ...o, orderStatus: "Request For Exchange" }
              : o
          )
        );
        alert("Exchange requested successfully! Admin will review it.");
      })
      .catch((err) => {
        console.error("Failed to request exchange:", err);
        alert("Failed to request exchange. Try again later.");
      });
  };

  if (error) {
    return (
      <div className="container text-center">
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
    <div className="container track-order-page">
      <h2 className="mb-4 text-center">My Orders 📦</h2>

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Fetching orders...</p>
        </div>
      ) : orders.length === 0 ? (
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
        <>
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
                  <span
                    className={`badge rounded-pill fs-6 status-text ${order.orderStatus
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <p className="card-text text-muted mb-0 mt-2">
                  Total Amount: <span className="fw-bold">Rs. {order.totalAmount}</span>
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
                        <th>#</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <img
                                src={item.imageUrl || "https://via.placeholder.com/50"}
                                alt={item.productName || "Product"}
                                className="img-thumbnail"
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                              />
                            </td>
                            <td>{item.productName || "Unnamed Item"}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">Rs. {item.price * item.quantity}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-3">
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
                      Request For Exchange 🔄
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Pagination Buttons */}
          <div className="pagination-container">
        <button disabled={page === 0} onClick={() => fetchOrders(page - 1)}>
          Prev
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button disabled={page + 1 === totalPages} onClick={() => fetchOrders(page + 1)}>
          Next
        </button>
      </div>
        </>
      )}
    </div>
  );
}

export default TrackOrder;
