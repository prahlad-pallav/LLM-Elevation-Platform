import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";

const Home = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the input value here
    console.log("Input value:", inputValue);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Welcome to LLM Evaluation Platform</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <InputField
          label="Enter your text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type something..."
          name="userInput"
          required
        />
        
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>

      <Link 
        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 block text-center" 
        to="/evaluate"
      >
        Start Evaluation
      </Link>
    </div>
  );
};

export default Home;
