/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import API from "../../api/API";
import "../../css/Cart.css";
import { useCart } from "../../context/CartContext";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItemIds, setUpdatingItemIds] = useState([]);
  const { fetchCartCount } = useCart();

  const fetchCart = async () => {
    try {
      const token = Cookies.get("sareesloom-authToken");
      if (!token) {
        setError("Please log in to view your cart.");
        setLoading(false);
        return;
      }

      const response = await API.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        console.error("API response is not an array:", response.data);
        setCartItems([]);
        setError("Failed to fetch cart data. Please try again.");
      }
    } catch (err) {
      console.error("API call failed:", err);
      setError("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCartCount]);

  // ✅ Updated quantity handler with button disable & rollback
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 0) return;
    if (updatingItemIds.includes(cartItemId)) return;

    const originalCartItems = [...cartItems];
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    setUpdatingItemIds((prev) => [...prev, cartItemId]);

    try {
      const token = Cookies.get("sareesloom-authToken");
      const response = await API.put(
        `/api/cart/update-quantity/${cartItemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If item removed (quantity 0)
      if (!response.data.updatedItem && newQuantity === 0) {
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
        fetchCartCount();
        alert("Item removed from cart!");
        return;
      }

      const updatedData = response.data.updatedItem;
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === updatedData.id
            ? { ...item, quantity: updatedData.quantity }
            : item
        )
      );
      fetchCartCount();
    } catch (err) {
      console.error("Update quantity failed:", err);
      alert(
        err.response?.data?.message || "Failed to update quantity. Check stock."
      );
      // Rollback on error
      setCartItems(originalCartItems);
      fetchCartCount();
    } finally {
      setUpdatingItemIds((prev) => prev.filter((id) => id !== cartItemId));
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const token = Cookies.get("sareesloom-authToken");
      await API.delete(`/api/cart/remove/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      fetchCartCount();
      alert("Item removed from cart!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item.");
    }
  };

  const calculateCartTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.variant?.priceAfterDiscount || 0) * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    const orderTotal = calculateCartTotal();
    if (orderTotal <= 0) {
      alert("Your cart is empty or the total is 0.");
      return;
    }
    navigate("/checkout/address");
  };

  const handleCheckouts = async () => {
    try {
      const orderTotal = calculateCartTotal();
      if (orderTotal <= 0) {
        alert("Your cart is empty or the total is 0.");
        return;
      }

      const token = Cookies.get("sareesloom-authToken");
      const { data } = await API.post(
        "/api/payment/create-order",
        { amount: parseFloat(orderTotal) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_RJ1F2vjHY8vjny",
        amount: data.amount,
        currency: "INR",
        name: "Saree Shop",
        description: "Payment for your order",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          const paymentData = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            totalAmount: orderTotal,
          };

          try {
            const verificationResponse = await API.post(
              "/api/payment/verify",
              paymentData
            );
            alert(verificationResponse.data.message);
            setCartItems([]);
            fetchCartCount();
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert(
              error.response?.data?.message || "Payment verification failed!"
            );
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        notes: { address: "Your address here" },
        theme: { color: "#A52A2A" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(err.response?.data?.message || "Failed to proceed to checkout.");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  if (loading)
    return (
      <div className="cart-page">
        <div className="loader"></div>
        <p>Loading your cart...</p>
      </div>
    );

  if (error)
    return (
      <div className="cart-page">
        <p className="error-message">{error}</p>
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="cart-page">
        <p>
          Your cart is empty! <Link to="/">Start shopping</Link>.
        </p>
      </div>
    );

  return (
    <div className="cart-page">
      <h2>My Shopping Cart 🛍️</h2>
      <div className="cart-container">
        <div className="cart-table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Color</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="product-info">
                      <img
                        src={item.variant?.images?.[0]}
                        alt={item.variant?.name}
                        className="product-image"
                      />
                      <span>{item.variant?.name}</span>
                    </div>
                  </td>
                  <td>{item.variant?.color}</td>
                  <td>Rs. {item.variant?.priceAfterDiscount}</td>

                  <td className="quantity-controls">
                    <button
                      disabled={updatingItemIds.includes(item.id)}
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      min="1"
                      disabled={updatingItemIds.includes(item.id)}
                    />

                    <button
                      disabled={updatingItemIds.includes(item.id)}
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </td>

                  <td>
                    Rs. {item.variant?.priceAfterDiscount * item.quantity}
                  </td>

                  <td>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>Rs. {calculateCartTotal()}</span>
          </div>

          <div className="summary-item">
            <span>Shipping:</span> <span>Free</span>
          </div>

          <div className="summary-total">
            <span>Total:</span>
            <span>Rs. {calculateCartTotal()}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
