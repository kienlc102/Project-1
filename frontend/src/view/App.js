import LandingPage from "../components/LandingPage";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Checkin from "../components/Checkin";
import Checkout from "../components/Checkout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
