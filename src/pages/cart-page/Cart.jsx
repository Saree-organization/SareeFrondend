/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/API";
import "../../css/Cart.css";
import { useCart } from "../../context/CartContext";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { fetchCartCount } = useCart();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to view your cart.");
        setLoading(false);
        return;
      }

      const response = await API.get("/api/cart");

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

  // ⭐ नया Async फ़ंक्शन: स्टॉक चेक और क्वांटिटी अपडेट के लिए
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 0) return;

    // यदि Quantity 0 हो रही है, तो आइटम हटाने की पुष्टि करें
    if (newQuantity === 0) {
      const confirmRemove = window.confirm(
        "Do you want to remove this item from the cart?"
      );
      if (!confirmRemove) return;
    }

    // UI को Optimistically अपडेट करें (ताकि यूजर को तुरंत बदलाव दिखे)
    // यदि API फेल होता है, तो हम रोलबैक करेंगे।
    const originalCartItems = cartItems;
    setCartItems(
      cartItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const token = localStorage.getItem("authToken");
      const response = await API.put(
        `/api/cart/update-quantity/${cartItemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // यदि आइटम सफलतापूर्वक हटा दिया गया है (newQuantity 0 होने पर)
      if (!response.data.updatedItem && newQuantity === 0) {
        setCartItems(
          originalCartItems.filter((item) => item.id !== cartItemId)
        );
        fetchCartCount();
        alert("Item removed from cart!");
        return;
      }

      // यदि क्वांटिटी सफलतापूर्वक अपडेट हुई है, तो UI को API डेटा से फाइनल करें
      const updatedData = response.data.updatedItem;
      setCartItems((prevItems) =>
        prevItems.map((item) =>
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

      // API विफल होने पर UI को रोलबैक करें या पूरा कार्ट दोबारा fetch करें
      setCartItems(originalCartItems);
      fetchCartCount(); // यदि स्टॉक बदला है तो काउंट अपडेट करें
    }
  };

  // पुरानी handleQuantityChange को हटा दिया गया है

  const handleRemoveItem = async (cartItemId) => {
    try {
      await API.delete(`/api/cart/remove/${cartItemId}`);
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
      fetchCartCount();
      alert("Item removed from cart!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item.");
    }
  };

  const calculateCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.variant.priceAfterDiscount * item.quantity,
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

  // handleCheckouts (Razorpay) लॉजिक में कोई बदलाव नहीं
  const handleCheckouts = async () => {
    try {
      const orderTotal = calculateCartTotal();
      if (orderTotal <= 0) {
        alert("Your cart is empty or the total is 0.");
        return;
      }

      const token = localStorage.getItem("authToken");
      console.log("Auth Token:", token); // Debugging line

      const { data } = await API.post(
        "/api/payment/create-order",
        {
          amount: parseFloat(orderTotal), // also helps with issue #2
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        notes: {
          address: "Your address here",
        },
        theme: {
          color: "#A52A2A",
        },
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

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (loading)
    return (
      <div className="cart-page">
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
                      onClick={() =>
                        // ⭐ handleUpdateQuantity का उपयोग करें
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        // ⭐ handleUpdateQuantity का उपयोग करें
                        handleUpdateQuantity(
                          item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      min="1"
                    />

                    <button
                      onClick={() =>
                        // ⭐ handleUpdateQuantity का उपयोग करें
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </td>

                  <td>{item.variant?.priceAfterDiscount * item.quantity}</td>

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
