import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div>
    <h1 className="text-3xl font-bold underline flex items-center">Welcome to LLM Evaluation Platform</h1>
    <Link  className="text-xl" to="/evaluate">Start Evaluation</Link>
  </div>
);

export default Home;
