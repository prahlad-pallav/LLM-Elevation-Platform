import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);

  return (
    <DataContext.Provider value={{ 
      userInput, 
      setUserInput, 
      results, 
      setResults 
    }}>
      {children}
    </DataContext.Provider>
  );
};
