import React from "react";
import Navbar from "./component/Navbar"; // Make sure the path is correct
import "../src/css/Navbar.css"; // Optional: for global styles

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <main>
        {/* <h1>Hello World!</h1> */}
        {/* Add more conten here */}
      </main>
    </div>
  );
};

export default App;
