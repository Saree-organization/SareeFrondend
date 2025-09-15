import Home from "./pages/Home";
import UserLayout from "./layouts/UserLayout";
import Register from "./pages/auth-pages/Register";
import Login from "./pages/auth-pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddSaree from "./pages/admin-pages/AddSaree";
import AllSaree from "./pages/saree-pages/AllSaree";
import SareeDetail from "./pages/saree-pages/SareeDetail";
import AboutUs from "./pages/footer-pages/AboutUs";
import Contact from "./pages/footer-pages/Contact";
import DeliveryPolicy from "./pages/footer-pages/DeliveryPolicy";
import FAQ from "./pages/footer-pages/FAQ";
import PrivacyPolicy from "./pages/footer-pages/PrivacyPolicy";
import ReturnedAndExchangePolicy from "./pages/footer-pages/ReturnedAndExchangePolicy";

import TermsOfService from "./pages/footer-pages/TermsOfService"
const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            {/* BADLAV YAHAN HAI: 'path="home"' ko 'index' se badal diya gaya hai */}
            {/* Yeh badlav zaroori hai */}
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />


            {/* SHAREE PAGES -------------->  */}
            <Route path="sarees/add" element={<AddSaree />} />
            <Route path="all-saree" element={<AllSaree/>} />
            <Route path="/sarees/:id" element={<SareeDetail />} />

            {/* Yeh behtar practice hai (leading "/" hata diya gaya hai) */}
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />

            {/* FOOTER PAGES ROUTES */}

            <Route path="about-us" element={<AboutUs />} />
            <Route path="shop" element={<AllSaree />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ/>} />

            <Route path="delivery-shipping-policy" element={<DeliveryPolicy />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="return-exchange-cancellation-policy" element={<ReturnedAndExchangePolicy />} />
            <Route path="terms-of-service-policy" element={<TermsOfService />} />
            

            

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
