import LandingPage from "../components/LandingPage";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Checkin from "../components/Checkin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/checkin" element={<Checkin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
