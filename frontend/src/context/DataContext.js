import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // const [dataset, setDataset] = useState([]);
  const [dataset, setDataset] = useState({ columns: [], rows: [] });
  const [results, setResults] = useState([]);

  return (
    <DataContext.Provider value={{ dataset, setDataset, results, setResults }}>
      {children}
    </DataContext.Provider>
  );
};
