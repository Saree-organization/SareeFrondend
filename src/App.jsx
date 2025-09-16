import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserLayout from "./layouts/UserLayout";
import Register from "./pages/auth-pages/Register";
import Login from "./pages/auth-pages/Login";
import AddSaree from "./pages/admin-pages/AddSaree";
import AllSaree from "./pages/saree-pages/AllSaree";
import SareeDetail from "./pages/saree-pages/SareeDetail";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  const handleLoginSuccess = (token) => {
    setIsLoggedIn(true);
    setAuthToken(token);
    // Persist token in local storage
    localStorage.setItem("authToken", token);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    // Remove token from local storage
    localStorage.removeItem("authToken");
    alert("You have been logged out.");
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              // Pass the state and handler to UserLayout
              <UserLayout isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            }
          >
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="sarees/add" element={<AddSaree />} />
            <Route path="all-saree" element={<AllSaree />} />
            <Route
              path="/sarees/:id"
              element={
                <SareeDetail isLoggedIn={isLoggedIn} authToken={authToken} />
              }
            />
            <Route
              path="register"
              element={<Register handleLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="login"
              element={<Login handleLoginSuccess={handleLoginSuccess} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
