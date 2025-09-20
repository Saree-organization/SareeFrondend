import React, { useEffect, useState } from "react";
import API from "../api/API";
import { Link, useNavigate } from "react-router-dom";
// You'll need to import Bootstrap's CSS in your main App.js or index.js
// import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/TrackOrder.css"; // Keep this for any custom styles

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          // Add a default "Pending" status if the API doesn't provide one
          const updatedOrders = response.data.map((order) => ({
            ...order,
            status: order.status || "Pending",
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
      <div className="container mt-5 text-center">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <p className="alert alert-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 track-order-page">
      <h2 className="mb-4 text-center">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="alert alert-info">
            You have not placed any orders yet.{" "}
            <Link to="/">Start shopping</Link>.
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.razorpayOrderId} className="card mb-4">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    Order ID: {order.razorpayOrderId || "N/A"}
                  </h5>
                  <span
                    className={`badge bg-${
                      order.status === "Success"
                        ? "success"
                        : order.status === "Pending"
                        ? "warning"
                        : "danger"
                    } fs-6`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="card-text text-muted mb-0">
                  Total Amount: Rs. {order.totalAmount}
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
                        <th scope="col" style={{ width: "10%" }}>
                          #
                        </th>
                        <th scope="col" style={{ width: "15%" }}>
                          Image
                        </th>
                        <th scope="col">Product Name</th>
                        <th scope="col" className="text-center">
                          Quantity
                        </th>
                        <th scope="col" className="text-end">
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
                                } // Corrected to use imageUrl
                                alt={item.productName || "Product"} // Corrected to use productName
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
                            <td className="text-end">Rs. {(item.quantity*item.price)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted">
                            No items found for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
