import React, { useEffect, useState } from "react";
import API from "../api/API";
import { Link, useNavigate } from "react-router-dom";
import "../css/TrackOrder.css";
import Cookies from "js-cookie";

function TrackOrder() {
  // ... (Your states and functions remain unchanged)

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchOrders = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const token = Cookies.get("sareesloom-authToken");

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
        Cookies.remove("sareesloom-authToken");
        Cookies.remove("sareesloom-userRole");
        localStorage.clear();

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
  }, [navigate]); // 🎯 COD CHANGES 1: Exchange request logic updated to use the appropriate Order Identifier

  const handleStatusChange = (orderId, razorpayOrderId) => {
    // If razorpayOrderId exists (Online order), use it. Otherwise, use the internal orderId (COD order).
    // The Backend's /cancel-order API now handles this mixed identifier logic.
    const idToUse = razorpayOrderId || String(orderId); // Assuming your admin API accepts the order identifier in the path

    API.put(`admin/paymentChangeStatus/${idToUse}/status`, {
      status: "Request For Exchange",
    })
      .then(() => {
        setOrders((prev) =>
          prev.map(
            (
              o // Update the status based on whether it's an online or internal ID match
            ) =>
              o.razorpayOrderId === idToUse ||
              (!o.razorpayOrderId && String(o.id) === idToUse)
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
        {/* ... (Login link) */}
      </div>
    );
  }

  return (
    <div className="container track-order-page">
      <h2 className="mb-4 text-center">My Orders 📦</h2>
      {loading ? (
        /* ... (Loading spinner) */
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Fetching orders...</p>
        </div>
      ) : orders.length === 0 ? (
        /* ... (No orders message) */
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
          {orders.map(
            (
              order // 🎯 COD CHANGES 2: key prop ensures unique rendering for COD and Online orders
            ) => (
              <div
                key={order.id || order.razorpayOrderId}
                className="card mb-4 shadow-sm"
              >
                <div className="card-header bg-light p-3">
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <h5 className="mb-2 mb-sm-0 me-3">
                      Order ID:
                      <span className="fw-normal text-muted">
                        {/* 🎯 COD CHANGES 3: Display Internal ID for COD orders */}
                        {order.razorpayOrderId || `ORD-${order.id}`}
                      </span>
                    </h5>
                    {/* 🎯 COD CHANGES 4: Display Payment Method */}
                    <span className="badge bg-secondary mb-2 mb-sm-0 me-3">
                      Payment:
                      {order.paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : "Online"}
                    </span>
                    <span
                      className={`badge rounded-pill fs-6 status-text ${order.orderStatus
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="card-text text-muted mb-0 mt-2">
                    Total Amount:
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
                              {/* 🎯 FIX APPLIED HERE: Quantity और Price सेल्स को स्वैप किया गया है 
                                                                ताकि वे स्क्रीन पर सही हेडिंग के नीचे दिखें। 
                                                                (Logical order: Name -> Quantity -> Price) */}
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
                        onClick={() =>
                          handleStatusChange(order.id, order.razorpayOrderId)
                        }
                      >
                        Request For Exchange 🔄
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
          {/* Pagination Buttons */}
          <div className="pagination-container">
            <button disabled={page === 0} onClick={() => fetchOrders(page - 1)}>
              Prev
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page + 1 === totalPages}
              onClick={() => fetchOrders(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TrackOrder;
