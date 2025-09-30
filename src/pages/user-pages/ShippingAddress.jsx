import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/API";
import "../../css/Checkout.css";

function ShippingAddress() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState([]); // selectedAddressId is initialized to null
  const [selectedAddressId, setSelectedAddressId] = useState(null); // New Address Form State

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false); // ********************************** // 1. Fetching user addresses and cart items (useEffect) // **********************************

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Please log in to manage addresses and view your order.");
          setLoading(false);
          return;
        } // --- Fetch Cart Items ---

        const cartResponse = await API.get("/api/cart");
        if (Array.isArray(cartResponse.data)) {
          setCartItems(cartResponse.data);
        } else {
          setCartItems([]);
          console.error(
            "API cart response is not an array:",
            cartResponse.data
          );
        } // --- Fetch Addresses ---

        const addressResponse = await API.get("/api/user/addresses");

        if (
          Array.isArray(addressResponse.data) &&
          addressResponse.data.length > 0
        ) {
          setAddresses(addressResponse.data);
          setSelectedAddressId(String(addressResponse.data[0].id));
          setShowNewAddressForm(false);
        } else {
          setAddresses([]);
          setSelectedAddressId(null);
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load order details or saved addresses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Razorpay script loading logic

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []); // ********************************** // Cart calculation and address saving // **********************************

  const calculateCartTotal = () => {
    if (!Array.isArray(cartItems)) return 0;

    return cartItems.reduce(
      (total, item) =>
        item.variant?.priceAfterDiscount && item.quantity
          ? total + item.variant.priceAfterDiscount * item.quantity
          : total,
      0
    );
  };

  const dummyFetchCartCount = () => {
    console.log("Cart count refresh called (dummy function).");
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (
      !newAddress.fullName ||
      !newAddress.street ||
      !newAddress.pincode ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.phone
    ) {
      alert("Please fill in all address fields.");
      return;
    }

    try {
      const response = await API.post("/api/user/addresses", newAddress);
      const savedAddress = response.data;
      setAddresses([...addresses, savedAddress]);
      setSelectedAddressId(String(savedAddress.id));
      setShowNewAddressForm(false);
      setNewAddress({
        fullName: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
      });
      alert("New address saved and selected successfully!");
    } catch (err) {
      console.error("Failed to save new address:", err);
      alert(
        err.response?.data?.message ||
          "Failed to save address. Please try again."
      );
    }
  };

  // --- NEW CANCELLATION LOGIC ---

  /**
   * Informs the backend to update the status of the pre-created order to 'Cancelled'.
   * This runs when the user closes the Razorpay payment popup.
   */
  const handlePaymentDismissal = async (orderId) => {
    try {
      // Call the backend endpoint to mark the order as Cancelled
      await API.post("/api/payment/cancel-order", {
        razorpayOrderId: orderId,
      });
      console.log(`Order ${orderId} marked as Cancelled on server.`);
    } catch (err) {
      console.error("Failed to mark order as cancelled on server:", err);
      // We usually don't alert the user here unless the failure is critical.
    }
  }; // ********************************** // 2. Proceed to Payment (UPDATED) // **********************************

  const handleProceedToPayment = async () => {
    const orderTotal = calculateCartTotal();

    if (!selectedAddressId) {
      alert("Please select a shipping address to proceed.");
      return;
    }

    if (orderTotal <= 0) {
      alert("Your cart is empty or the total is 0.");
      navigate("/cart");
      return;
    }

    try {
      const token = localStorage.getItem("authToken"); // Step 1: Create Order in Backend (Status: 'Created')

      const { data } = await API.post(
        "/api/payment/create-order",
        {
          amount: parseFloat(orderTotal),
          shippingAddressId: selectedAddressId,
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
        order_id: data.razorpayOrderId, // Success Handler

        handler: async function (response) {
          const paymentData = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            totalAmount: orderTotal,
            shippingAddressId: selectedAddressId,
          };

          try {
            // Step 3: Verify Payment and update status to 'Success'
            const verificationResponse = await API.post(
              "/api/payment/verify",
              paymentData
            );
            alert(verificationResponse.data.message);
            dummyFetchCartCount();
            setCartItems([]);
            navigate("/track-order");
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert(
              error.response?.data?.message || "Payment verification failed!"
            );
          }
        },

        // ⭐ FIX: Handle user cancellation/dismissal
        modal: {
          ondismiss: function () {
            console.log("Razorpay window closed by user. Cancelling order...");
            // Step 4: Call backend to change order status to 'Cancelled'
            handlePaymentDismissal(data.razorpayOrderId);
            alert(
              "Payment was cancelled. Your order has been automatically cancelled."
            );
          },
        },

        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#A52A2A",
        },
      }; // Step 2: Open Razorpay Popup

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(err.response?.data?.message || "Failed to proceed to payment.");
    }
  }; // ********************************** // 3. Render logic (No change needed here) // **********************************

  if (loading)
    return (
      <div className="checkout-page">
                <p>Loading address options...</p>     {" "}
      </div>
    );
  if (error)
    return (
      <div className="checkout-page">
                <p className="error-message">{error}</p>     {" "}
      </div>
    );

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="checkout-page">
               {" "}
        <p className="error-message">
                    Your cart is empty. Please add items to proceed.        {" "}
        </p>
             {" "}
      </div>
    );
  }

  return (
    <div className="checkout-page">
            <h2>Shipping Address & Payment</h2>     {" "}
      <div className="checkout-content">
               {" "}
        <div className="address-section">
                    <h3>1. Select Delivery Address</h3>         {" "}
          <div className="saved-addresses-list">
                       {" "}
            {addresses.length === 0 && !showNewAddressForm ? (
              <p className="info-message">
                                कृपया आगे बढ़ने के लिए एक नया शिपिंग एड्रेस
                जोड़ें।              {" "}
              </p>
            ) : null}
                        {/* Saved Addresses List */}           {" "}
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`address-card ${
                  String(selectedAddressId) === String(addr.id)
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelectedAddressId(String(addr.id))}
              >
                               {" "}
                <input
                  type="radio"
                  name="shippingAddress"
                  checked={String(selectedAddressId) === String(addr.id)}
                  readOnly
                />
                               {" "}
                <label>
                                    <strong>{addr.fullName}</strong>           
                       {" "}
                  <p>
                                        {addr.street}, {addr.city}, {addr.state}{" "}
                    - {addr.pincode}                 {" "}
                  </p>
                                    <p>Phone: {addr.phone}</p>               {" "}
                </label>
                             {" "}
              </div>
            ))}
                        {/* Add New Address Button */}           {" "}
            {addresses.length > 0 && (
              <button
                className="add-new-btn"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
              >
                               {" "}
                {showNewAddressForm
                  ? "Cancel New Address"
                  : "+ Add a New Address"}
                             {" "}
              </button>
            )}
                     {" "}
          </div>
                    {/* New Address Form */}         {" "}
          {(showNewAddressForm || addresses.length === 0) && (
            <form className="new-address-form" onSubmit={handleSaveNewAddress}>
                           {" "}
              {addresses.length > 0 && <h4>Enter New Address Details</h4>}
                           {" "}
              <input
                type="text"
                placeholder="Full Name"
                value={newAddress.fullName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, fullName: e.target.value })
                }
                required
              />
                           {" "}
              <input
                type="text"
                placeholder="Street Address, Area"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                required
              />
                           {" "}
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                required
              />
                           {" "}
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                required
              />
                           {" "}
              <input
                type="text"
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pincode: e.target.value })
                }
                required
              />
                           {" "}
              <input
                type="text"
                placeholder="Phone Number"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
                required
              />
                           {" "}
              <button type="submit" className="save-address-btn">
                                Save Address & Select              {" "}
              </button>
                         {" "}
            </form>
          )}
                 {" "}
        </div>
               {" "}
        <div className="order-summary-and-payment">
                    <h3>2. Order Summary</h3>         {" "}
          <div className="cart-summary">
                       {" "}
            <div className="summary-item">
                            <span>Subtotal:</span>             {" "}
              <span>Rs. {calculateCartTotal()}</span>           {" "}
            </div>
                       {" "}
            <div className="summary-item">
                            <span>Shipping:</span>             {" "}
              <span>Free</span>           {" "}
            </div>
                       {" "}
            <div className="summary-total">
                            <span>Total:</span>             {" "}
              <span>Rs. {calculateCartTotal()}</span>           {" "}
            </div>
                       {" "}
            <button
              className="checkout-btn"
              onClick={handleProceedToPayment} // The button is enabled if selectedAddressId is NOT null/undefined AND cart total > 0
              disabled={!selectedAddressId || calculateCartTotal() <= 0}
            >
                            Proceed to Payment (Rs. {calculateCartTotal()})    
                     {" "}
            </button>
                     {" "}
          </div>
                   {" "}
          <p className="payment-note">
                        By clicking 'Proceed to Payment', you agree to our
            terms.          {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}

export default ShippingAddress;
