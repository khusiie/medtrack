import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginSignUp from "./pages/LoginSignUp";
import Report from "./components/Report";
import Records from "./components/Records";
import Description from "./components/Description";
import Details from "./components/Details";
import Home from "./components/Home";
import AiConsole from "./components/AiConsole";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<LoginSignUp />} />
          <Route path="/report" element={<Report />} />
          <Route path="/description" element={<Description />} />
          <Route path="/details" element={<Details />} />
          <Route path="aiconsole" element={<AiConsole />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
