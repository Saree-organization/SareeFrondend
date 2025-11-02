import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/API";
import "../../css/Checkout.css";
import Cookies from "js-cookie";

function ShippingAddress() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState([]); // selectedAddressId will hold the string ID of the selected address
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // 🎯 COD CHANGES 1: नया स्टेट - सिलेक्टेड पेमेंट मेथड को ट्रैक करने के लिए
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("ONLINE"); // Default to Online

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // -------------------------- Fetch Cart & Addresses --------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("sareesloom-authToken");

        if (!token) {
          setError("Please log in to manage addresses and view your order.");
          setLoading(false);
          return;
        } // Fetch Cart Items

        const cartResponse = await API.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(cartResponse.data)) setCartItems(cartResponse.data);
        else setCartItems([]); // Fetch Addresses

        const addressResponse = await API.get("/api/user/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (
          Array.isArray(addressResponse.data) &&
          addressResponse.data.length > 0
        ) {
          setAddresses(addressResponse.data); // 🎯 FIX: Force the selection of the first available address. // This ensures selectedAddressId is NOT null on load.

          const defaultAddress = addressResponse.data[0];
          const defaultAddressId = String(defaultAddress.id);

          console.log(
            "DEBUG: Addresses found. Defaulting to ID:",
            defaultAddressId
          );

          setSelectedAddressId(defaultAddressId);
          setShowNewAddressForm(false);
        } else {
          // No addresses found, ensure state is null/empty
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

    fetchData(); // Load Razorpay script

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []); // -------------------------- Cart Total --------------------------

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
  }; // -------------------------- Select Address --------------------------

  const handleSelectAddress = async (addressId) => {
    setSelectedAddressId(addressId);
    const token = Cookies.get("sareesloom-authToken");

    if (!token) return;

    try {
      // Mark as selected in DB (assuming backend handles the 'isSelected' logic)
      await API.put(
        `/api/user/addresses/select/${addressId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Selected address ID saved in database and state!");
    } catch (err) {
      console.error("Failed to save selected address:", err);
    }
  }; // -------------------------- Save New Address --------------------------

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (isSaving) return;

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

    setIsSaving(true);
    try {
      const token = Cookies.get("sareesloom-authToken");

      if (!token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const response = await API.post("/api/user/addresses", newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const savedAddress = response.data; // 1. Update local state

      setAddresses([...addresses, savedAddress]);
      const newAddressId = String(savedAddress.id);
      setSelectedAddressId(newAddressId); // Use new address ID
      setShowNewAddressForm(false);
      setNewAddress({
        fullName: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
      }); // 2. Select the new address in the backend

      await API.put(
        `/api/user/addresses/select/${newAddressId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        "New address saved and selected successfully! You can now proceed to payment."
      );
    } catch (err) {
      console.error("Failed to save new address:", err);
      alert(
        err.response?.data?.message ||
          "Failed to save address. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }; // -------------------------- Payment Cancellation --------------------------

  const handlePaymentDismissal = async (orderId) => {
    try {
      await API.post("/api/payment/cancel-order", { razorpayOrderId: orderId });
      console.log(`Order ${orderId} marked as Cancelled on server.`);
    } catch (err) {
      console.error("Failed to mark order as cancelled on server:", err);
    }
  }; // -------------------------- Proceed to Payment --------------------------

  const handleProceedToPayment = async () => {
    const orderTotal = calculateCartTotal();
    const addressToUse = selectedAddressId;
    // 🎯 COD CHANGES 2: सिलेक्टेड पेमेंट मेथड प्राप्त करें
    const paymentMethod = selectedPaymentMethod; // Final check to see if addressToUse has a value

    console.log("FINAL CHECK: Sending Address ID:", addressToUse);

    if (!addressToUse) {
      alert("Please select a shipping address to proceed.");
      return;
    }
    if (orderTotal <= 0) {
      alert("Your cart is empty or the total is 0.");
      navigate("/cart");
      return;
    }

    const numericAddressId = addressToUse ? Number(addressToUse) : null;

    try {
      const token = Cookies.get("sareesloom-authToken");

      // 🎯 COD CHANGES 3: Request Body में paymentMethod शामिल करें
      const requestBody = {
        amount: parseFloat(orderTotal),
        shippingAddressId: numericAddressId,
        paymentMethod: paymentMethod, // Backend को बताने के लिए कि यह COD या ONLINE है
      };

      const { data } = await API.post(
        "/api/payment/create-order",
        requestBody, // updated request body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🎯 COD CHANGES 4: अगर COD है, तो Razorpay को बाईपास करें
      if (paymentMethod === "COD") {
        alert("Order placed successfully with Cash on Delivery (COD)!");
        dummyFetchCartCount();
        setCartItems([]);
        navigate("/track-order"); // ऑर्डर ट्रैकिंग पेज पर भेजें
        return; // Razorpay लॉजिक को चलाने से रोकें
      }

      // 🎯 COD CHANGES 5: बाकी लॉजिक सिर्फ ONLINE PAYMENT के लिए (Razorpay)
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
            shippingAddressId: addressToUse,
          };
          try {
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
        modal: {
          ondismiss: function () {
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
        theme: { color: "#A52A2A" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(err.response?.data?.message || "Failed to proceed to payment.");
    }
  }; // -------------------------- Render Logic --------------------------

  if (loading)
    return (
      <div className="checkout-page">
               {" "}
        <div className="loader-container">
                    <div className="loader"></div>         {" "}
          <p>Loading address options...</p>       {" "}
        </div>
             {" "}
      </div>
    );
  if (error)
    return (
      <div className="checkout-page">
                <p className="error-message">{error}</p>     {" "}
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="checkout-page">
               {" "}
        <p className="error-message">
                    Your cart is empty. Please add items to proceed.        {" "}
        </p>
                <button onClick={() => navigate("/cart")}>Go to Cart</button>   
         {" "}
      </div>
    );

  return (
    <div className="checkout-page">
            <h2>Shipping Address & Payment</h2>     {" "}
      <div className="checkout-content">
               {" "}
        <div className="address-section">
                    <h3>1. Select Delivery Address</h3>         {" "}
          <div className="saved-addresses-list">
                       {" "}
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`address-card ${
                  String(selectedAddressId) === String(addr.id)
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleSelectAddress(String(addr.id))}
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
                       {" "}
            <button
              className="add-new-btn"
              onClick={() => setShowNewAddressForm(!showNewAddressForm)}
              disabled={isSaving}
            >
                           {" "}
              {showNewAddressForm
                ? "Cancel New Address"
                : "+ Add a New Address"}
                         {" "}
            </button>
                     {" "}
          </div>
                   {" "}
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
              <button
                type="submit"
                className="save-address-btn"
                disabled={isSaving}
              >
                               {" "}
                {isSaving ? "Saving..." : "Save Address & Select"}             {" "}
              </button>
                         {" "}
            </form>
          )}
                 {" "}
        </div>
        {/* 🎯 COD CHANGES 6: नया पेमेंट मेथड सेलेक्शन सेक्शन */}
        <div className="payment-method-section">
          <h3>2. Select Payment Method</h3>
          <div className="payment-options-list">
            {/* Option 1: Online Payment (Existing Razorpay) */}
            <div
              className={`payment-option-card ${
                selectedPaymentMethod === "ONLINE" ? "selected" : ""
              }`}
              onClick={() => setSelectedPaymentMethod("ONLINE")}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={selectedPaymentMethod === "ONLINE"}
                readOnly
              />
              <label>Online Payment (Cards, UPI, Net Banking)</label>
            </div>

            {/* Option 2: Cash on Delivery (COD) */}
            <div
              className={`payment-option-card ${
                selectedPaymentMethod === "COD" ? "selected" : ""
              }`}
              onClick={() => setSelectedPaymentMethod("COD")}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={selectedPaymentMethod === "COD"}
                readOnly
              />
              <label>Cash on Delivery (COD)</label>
            </div>
          </div>
        </div>
        {/* End of new payment method section */}       {" "}
        <div className="order-summary-and-payment">
                    <h3>3. Order Summary</h3> {/* Heading index updated */}     
             {" "}
          <div className="cart-summary">
                       {" "}
            <div className="summary-item">
                            <span>Subtotal:</span>{" "}
              <span>Rs. {calculateCartTotal()}</span>           {" "}
            </div>
                       {" "}
            <div className="summary-item">
                            <span>Shipping:</span> <span>Free</span>           {" "}
            </div>
                       {" "}
            <div className="summary-total">
                            <span>Total:</span>{" "}
              <span>Rs. {calculateCartTotal()}</span>           {" "}
            </div>
                       {" "}
            <button
              className="checkout-btn"
              onClick={handleProceedToPayment}
              disabled={
                // Button disabled only if NO address is selected OR cart is empty
                !selectedAddressId || calculateCartTotal() <= 0 || isSaving
              }
            >
                           {" "}
              {selectedPaymentMethod === "COD"
                ? "Place COD Order"
                : `Proceed to Payment (Rs. ${calculateCartTotal()})`}
                         {" "}
            </button>
                     {" "}
          </div>
                   {" "}
          <p className="payment-note">
                        By clicking the button, you agree to our terms.        
             {" "}
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
