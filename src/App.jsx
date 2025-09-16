import Home from "./pages/Home";
import UserLayout from "./layouts/UserLayout";
import Register from "./pages/auth-pages/Register";
import Login from "./pages/auth-pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddSaree from "./pages/admin-pages/AddSaree";
import AllSaree from "./pages/saree-pages/AllSaree";
import SareeDetail from "./pages/saree-pages/SareeDetail";
import ProtectedRoute from "../src/components/ProtectedRoute"; // Import the new component

const App = () => {
  return (
    <div className="App">
      
      <BrowserRouter>
        
        <Routes>
          
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />{" "}
            {/* Auth Routes (accessible to everyone) */}
            <Route path="register" element={<Register />} />
             <Route path="login" element={<Login />} />
            {/* Protected Routes (only for logged-in users) */}
            <Route element={<ProtectedRoute />}>
               <Route path="sarees/add" element={<AddSaree />} />
              <Route path="all-saree" element={<AllSaree />} />
              
              <Route path="/sarees/:id" element={<SareeDetail />} />
            </Route>
            
          </Route>
          
        </Routes>
      
      </BrowserRouter>
      
    </div>
  );
};

export default App;
