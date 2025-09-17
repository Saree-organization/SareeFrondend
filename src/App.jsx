// File: App.js

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WishlistProvider } from "./components/WishlistContext"; // Import WishlistProvider

// Layouts
import UserLayout from "./layouts/UserLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./components/Wishlist";

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
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        {/* Wrap the entire application with WishlistProvider */}
        <WishlistProvider>
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />

              {/* Public Routes */}
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="/all-saree" element={<AllSaree />} />
              <Route path="/sarees/:id" element={<SareeDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Admin/User-only routes */}
                <Route path="sarees/add" element={<AddSaree />} />
              </Route>

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
            </Route>
          </Routes>
        </WishlistProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
