import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Evaluation from "./pages/Evaluation";
import Models from "./pages/Models";
import SimultaneousSearch from "./components/SimultaneousSearch";

const App = () => (
  <ThemeProvider>
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/models" element={<Models />} />
              <Route path="/evaluate" element={<Evaluation />} />
              <Route path="/simultaneous" element={<SimultaneousSearch />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </DataProvider>
  </ThemeProvider>
);

export default App;
