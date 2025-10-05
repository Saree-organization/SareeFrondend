// FILE: src/components/ExchangeForm.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/API";

// Razorpay SDK loading helper (No need to repeat, assume it's implemented)
const loadRazorpay = (options) => {
  /* ... implementation ... */
};

function ExchangeForm() {
  const { razorpayOrderId, orderItemId } = useParams(); // दोनों IDs प्राप्त करें
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedNewVariant, setSelectedNewVariant] = useState(null);

  const [variantsList, setVariantsList] = useState([]);
  const [reason, setReason] = useState("");
  const [priceDifference, setPriceDifference] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("authToken");

  // --- Data Fetching ---
  useEffect(() => {
    if (!token || !orderItemId) {
      setError("Missing authentication or item ID.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Fetch Variants List (Exchange options)
        const variantsRes = await API.get("/sarees/allVariants", {
          // Hypothetical API for all variants
          headers: { Authorization: `Bearer ${token}` },
        });
        setVariantsList(variantsRes.data || []);

        // 2. Fetch the specific OrderItem by ID (The item being returned)
        // 💡 NOTE: आपको Backend में यह नया GET API बनाना होगा: /api/payment/order-item/{orderItemId}
        const itemRes = await API.get(
          `/api/payment/order-item/${orderItemId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSelectedItem(itemRes.data);
        setReason(`Returning: ${itemRes.data.productName}`);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load exchange details or saree list.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderItemId, token]);

  // --- Price Difference Calculation ---
  useEffect(() => {
    if (selectedItem && selectedNewVariant) {
      const quantity = selectedItem.quantity || 1;
      const oldPrice = selectedItem.price * quantity;
      const newPrice = selectedNewVariant.priceAfterDiscount * quantity;

      const difference = newPrice - oldPrice;
      setPriceDifference(Math.round(difference * 100) / 100);
    } else {
      setPriceDifference(0);
    }
  }, [selectedItem, selectedNewVariant]);

  // --- Razorpay Handler ---
  const handleRazorpayPayment = (data) => {
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: data.amount * 100, // Backend sends amount in Rs. We convert to paise
      currency: data.currency,
      name: "Saree.com Exchange Payment",
      order_id: data.razorpayOrderId,
      handler: async (response) => {
        try {
          // Payment successful, now verify with Backend
          await API.post("/api/exchange/verify-payment", {
            razorpayOrderId: data.razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          alert("Payment successful! Your new Saree pickup is scheduled.");
          navigate("/track-order");
        } catch (error) {
          alert("Payment verification failed. Contact support.");
        }
      },
      theme: { color: "#ff69b4" },
    };
    loadRazorpay(options);
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !selectedItem || !selectedNewVariant || !reason) {
      alert("Please ensure all selections are made.");
      return;
    }

    try {
      const response = await API.post(
        "/api/exchange/request",
        {
          orderItemId: selectedItem.orderItemId,
          newVariantId: selectedNewVariant.id,
          reason: reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 202 Status = Payment Required (Backend sends this when priceDifference > 0)
      if (response.status === 202 && response.data.razorpayOrderId) {
        alert("New saree is more expensive. Initiating payment.");
        handleRazorpayPayment(response.data);
      } else {
        // 200 OK: Simple Exchange
        alert(
          "Exchange request submitted successfully! Your pickup is scheduled."
        );
        navigate("/track-order");
      }
    } catch (error) {
      alert(
        `Exchange failed: ${error.response?.data?.message || "Server error"}`
      );
      console.error("Submission Error:", error.response);
    }
  };

  if (loading)
    return (
      <div
        className="container mt-5 text-center loader-container"
        style={{
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading exchange options and order details...</p>
      </div>
    );

  if (error)
    return <div className="container mt-5 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Exchange Saree for Order {razorpayOrderId}</h2>

      {/* ... (UI for item being returned) ... */}

      <form onSubmit={handleSubmit}>
        {/* ... (UI for selecting new variant) ... */}

        <div className="mb-3">
          <label className="form-label fw-bold">
            Select New Saree (Variant):
          </label>
          <select
            className="form-select"
            required
            onChange={(e) => {
              const variant = variantsList.find(
                (v) => v.id.toString() === e.target.value
              );
              setSelectedNewVariant(variant);
            }}
          >
            <option value="">-- Choose New Saree --</option>
            {variantsList.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} ({variant.color}) - Rs.{" "}
                {variant.priceAfterDiscount}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Reason for Exchange:</label>
          <textarea
            className="form-control"
            rows="2"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Price Difference Display */}
        {priceDifference !== 0 && (
          <div
            className={`alert mt-4 ${
              priceDifference > 0 ? "alert-warning" : "alert-success"
            }`}
          >
            {priceDifference > 0 ? (
              <p className="mb-0 fw-bold">
                Price Difference to Pay: Rs. {priceDifference}
              </p>
            ) : (
              <p className="mb-0 fw-bold">
                Price Difference Refund: Rs. {Math.abs(priceDifference)}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={!selectedNewVariant}
        >
          Submit Exchange Request
        </button>
      </form>
    </div>
  );
}

export default ExchangeForm;
