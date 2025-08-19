import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Evaluation from "./pages/Evaluation";

const App = () => (
  <ThemeProvider>
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/evaluate" element={<Evaluation />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  </ThemeProvider>
);

export default App;
