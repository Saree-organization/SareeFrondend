import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate को जोड़ा गया
import API from "../../api/API";
import "../../css/Cart.css";
import { useCart } from "../../context/CartContext";

function Cart() {
  const navigate = useNavigate(); // useNavigate hook को initialize किया गया
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { fetchCartCount } = useCart();

  useEffect(() => {
    // ... (पुराना fetchCart लॉजिक - कोई बदलाव नहीं)
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

    fetchCart();
  }, [fetchCartCount]); // ... (handleQuantityChange, handleUpdateQuantity, handleRemoveItem, calculateCartTotal लॉजिक - कोई बदलाव नहीं)

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    setCartItems(
      cartItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      await API.patch(`/api/cart/update-quantity/${cartItemId}`, {
        quantity: newQuantity,
      });
      fetchCartCount();
      alert("Quantity updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity.");
    }
  };

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
  }; // *** UPDATED LOGIC ***

  const handleCheckout = () => {
    const orderTotal = calculateCartTotal();
    if (orderTotal <= 0) {
      alert("Your cart is empty or the total is 0.");
      return;
    } // पेमेंट API कॉल को हटा दिया गया। // अब यह सीधे शिपिंग एड्रेस पेज पर navigate करेगा।
    navigate("/checkout/address");
  }; /* // *** END OF UPDATED LOGIC *** // Razorpay script loading logic को भी हटा दिया गया क्योंकि अब Cart page पर पेमेंट नहीं हो रहा है
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  */
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
           <th>Product</th> <th>Color</th>
                 <th>Price</th><th>Quantity</th>
              <th>Total</th> <th>Actions</th>
              
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
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                  -
                    </button>
                
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      min="1"
                    />
                    
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      + 
                    </button>
                    
                  </td>
                  
                  <td>
                  
                    {item.variant?.priceAfterDiscount * item.quantity}
                
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
