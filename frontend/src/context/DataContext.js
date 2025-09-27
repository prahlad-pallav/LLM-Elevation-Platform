import React, { createContext, useState, useContext } from "react";

export const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

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
