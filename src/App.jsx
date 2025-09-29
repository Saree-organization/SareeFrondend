import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

// Layouts
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./components/Wishlist";
import Cart from "./pages/cart-page/Cart";
import TrackOrder from "./components/TrackOrder";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/auth-pages/Login";
import Register from "./pages/auth-pages/Register";
import AllSaree from "./pages/saree-pages/AllSaree";
import SareeDetail from "./pages/saree-pages/SareeDetail";
import KatanSilk from "./pages/saree-pages/KatanSilk";
import TissueSilk from "./pages/saree-pages/TissueSilk";
import CelebritySaree from "./pages/saree-pages/CelebritySaree";

// Footer Pages
import AboutUs from "./pages/footer-pages/AboutUs";
import Contact from "./pages/footer-pages/Contact";
import DeliveryPolicy from "./pages/footer-pages/DeliveryPolicy";
import FAQ from "./pages/footer-pages/FAQ";
import PrivacyPolicy from "./pages/footer-pages/PrivacyPolicy";
import ReturnedAndExchangePolicy from "./pages/footer-pages/ReturnedAndExchangePolicy";
import TermsOfService from "./pages/footer-pages/TermsOfService";

// Admin Pages
import AddSaree from "./pages/admin-pages/AddSaree";

import AdminDashboard from "./pages/admin-pages/AdminDashboard";
import AdminUsers from "./pages/admin-pages/AdminUsers";
import AdminOrders from "./pages/admin-pages/AdminOrders";
import AdminSarees from "./pages/admin-pages/AdminSarees";
import AdminUserProfile from "./pages/admin-pages/AdminUserProfile";
import AdminSareesDetails from "./pages/admin-pages/AdminSareesDetails";



const App = () => {

  const role = "admi"


  return (
    <BrowserRouter>
      {/* User Routes */}
      {role !== "admin" && (
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="all-saree" element={<AllSaree />} />
                <Route path="sarees/:id" element={<SareeDetail />} />
                <Route path="sarees/:id/:variantId" element={<SareeDetail />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="cart" element={<Cart />} />

                {/* Footer Pages */}
                <Route path="about-us" element={<AboutUs />} />
                <Route path="shop" element={<AllSaree />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="track-order" element={<TrackOrder />} />
                <Route path="katan-silk" element={<KatanSilk />} />
                <Route path="tissue-silk" element={<TissueSilk />} />
                <Route path="celebrity" element={<CelebritySaree />} />
                <Route path="delivery-shipping-policy" element={<DeliveryPolicy />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="return-exchange-cancellation-policy" element={<ReturnedAndExchangePolicy />}/>
                <Route path="terms-of-service-policy" element={<TermsOfService />} />
              </Route>
            </Routes>
          </CartProvider>
        </WishlistProvider>
      )}

      {/* Admin Routes */}
      {role === "admin" && (
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="sarees" element={<AdminSarees />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="user-profile/:userId" element={<AdminUserProfile/>} />
            <Route path="add-saree" element={<AddSaree />} />
            <Route path="sarees/:id/:variantId" element={<AdminSareesDetails />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
