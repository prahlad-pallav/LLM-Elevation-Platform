import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Home from "./pages/Home";
import Evaluation from "./pages/Evaluation";

const App = () => (
  <DataProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evaluate" element={<Evaluation />} />
      </Routes>
    </Router>
  </DataProvider>
);

export default App;
