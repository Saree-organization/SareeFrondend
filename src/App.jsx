import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

// Layouts
import UserLayout from "./layouts/UserLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./components/Wishlist";
import Cart from "./pages/cart-page/Cart";

// Pages
import Home from "./pages/Home";
import Login from "./pages/auth-pages/Login";
import Register from "./pages/auth-pages/Register";
import AllSaree from "./pages/saree-pages/AllSaree";
import SareeDetail from "./pages/saree-pages/SareeDetail";
import AddSaree from "./pages/admin-pages/AddSaree";
import AboutUs from "./pages/footer-pages/AboutUs";
import Contact from "./pages/footer-pages/Contact";
import DeliveryPolicy from "./pages/footer-pages/DeliveryPolicy";
import FAQ from "./pages/footer-pages/FAQ";
import PrivacyPolicy from "./pages/footer-pages/PrivacyPolicy";
import ReturnedAndExchangePolicy from "./pages/footer-pages/ReturnedAndExchangePolicy";
import TermsOfService from "./pages/footer-pages/TermsOfService";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<UserLayout />}>
                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="/all-saree" element={<AllSaree />} />
                <Route path="/sarees/:id" element={<SareeDetail />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                {/* Footer Page Routes */}
                <Route path="about-us" element={<AboutUs />} />
                <Route path="shop" element={<AllSaree />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route
                  path="delivery-shipping-policy"
                  element={<DeliveryPolicy />}
                />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route
                  path="return-exchange-cancellation-policy"
                  element={<ReturnedAndExchangePolicy />}
                />
                <Route
                  path="terms-of-service-policy"
                  element={<TermsOfService />}
                />
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="sarees/add" element={<AddSaree />} />
                </Route>
              </Route>
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
