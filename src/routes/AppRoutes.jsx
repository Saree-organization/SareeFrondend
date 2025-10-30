import React from "react";
import { Route } from "react-router-dom";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

// Components
import Wishlist from "../components/Wishlist";
import Cart from "../pages/cart-page/Cart";
import TrackOrder from "../components/TrackOrder";
import ShippingAddress from "../pages/user-pages/ShippingAddress";
import DeveloperInfo from "../pages/footer-pages/DeveloperInfo";

// User Pages
import Home from "../pages/Home";
import Login from "../pages/auth-pages/Login";
import Register from "../pages/auth-pages/Register";
import AllSaree from "../pages/saree-pages/AllSaree";
import SareeDetail from "../pages/saree-pages/SareeDetail";
import KatanSilk from "../pages/saree-pages/KatanSilk";
import TissueSilk from "../pages/saree-pages/TissueSilk";
import CelebritySaree from "../pages/saree-pages/CelebritySaree";
import DiscountFilter from "../pages/saree-pages/DiscountFilter";
import ColorFilter from "../pages/saree-pages/ColorFilter";

// Footer Pages
import AboutUs from "../pages/footer-pages/AboutUs";
import Contact from "../pages/footer-pages/Contact";
import DeliveryPolicy from "../pages/footer-pages/DeliveryPolicy";
import FAQ from "../pages/footer-pages/FAQ";
import PrivacyPolicy from "../pages/footer-pages/PrivacyPolicy";
import ReturnedAndExchangePolicy from "../pages/footer-pages/ReturnedAndExchangePolicy";
import TermsOfService from "../pages/footer-pages/TermsOfService";

// Admin Pages
import AddSaree from "../pages/admin-pages/AddSaree";
import AdminDashboard from "../pages/admin-pages/AdminDashboard";
import AdminUsers from "../pages/admin-pages/AdminUsers";
import AdminOrders from "../pages/admin-pages/AdminOrders";
import AdminSarees from "../pages/admin-pages/AdminSarees";
import AdminUserProfile from "../pages/admin-pages/AdminUserProfile";
import AdminSareesDetails from "../pages/admin-pages/AdminSareesDetails";

// ================= Public Routes =================
export const PublicRoutesArray = [
  // Main Pages
  <Route path="home" element={<Home />} key="home" />,
  <Route path="all-saree" element={<AllSaree />} key="all-saree" />,
  <Route path="color/:color" element={<ColorFilter />} key="color" />,
  <Route path="discount/:discount" element={<DiscountFilter />} key="discount" />,
  <Route path="sarees/:id" element={<SareeDetail />} key="saree-detail" />,
  <Route path="sarees/:id/:variantId" element={<SareeDetail />} key="saree-variant" />,
  <Route path="katan-silk/:catogry" element={<KatanSilk />} key="katan" />,
  
  // Footer Pages
  <Route path="about-us" element={<AboutUs />} key="about-us" />,
  <Route path="contact" element={<Contact />} key="contact" />,
  <Route path="faq" element={<FAQ />} key="faq" />,
  <Route path="developer" element={<DeveloperInfo />} key="developer" />,
  <Route path="delivery-shipping-policy" element={<DeliveryPolicy />} key="delivery" />,
  <Route path="privacy-policy" element={<PrivacyPolicy />} key="privacy" />,
  <Route path="return-exchange-cancellation-policy" element={<ReturnedAndExchangePolicy />} key="return" />,
  <Route path="terms-of-service-policy" element={<TermsOfService />} key="tos" />,
];

// ================= User Routes =================
export const UserRoutesArray = [
  <Route path="wishlist" element={<Wishlist />} key="wishlist" />,
  <Route path="cart" element={<Cart />} key="cart" />,
  <Route path="track-order" element={<TrackOrder />} key="track-order" />,
  <Route path="checkout/address" element={<ShippingAddress />} key="checkout" />,
];

// ================= Admin Routes =================
export const AdminRoutesArray = [
  <Route index element={<AdminDashboard />} key="index" />,
  <Route path="dashboard" element={<AdminDashboard />} key="dashboard" />,
  <Route path="sarees" element={<AdminSarees />} key="sarees" />,
  <Route path="users" element={<AdminUsers />} key="users" />,
  <Route path="orders" element={<AdminOrders />} key="orders" />,
  <Route path="user-profile/:userId" element={<AdminUserProfile />} key="user-profile" />,
  <Route path="add-saree" element={<AddSaree />} key="add-saree" />,
  <Route path="sarees/:id/:variantId" element={<AdminSareesDetails />} key="saree-details" />,
];

// ================= Auth Routes =================
export const AuthRoutesArray = [
  <Route path="/" element={<Login />} key="login-home" />,
  <Route path="/login" element={<Login />} key="login" />,
  <Route path="/register" element={<Register />} key="register" />,
];
