import Home from "./pages/Home";
import UserLayout from "./layouts/UserLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddSaree from "./pages/AddSaree";
const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="sarees/add" element={<AddSaree />} />1
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App;
