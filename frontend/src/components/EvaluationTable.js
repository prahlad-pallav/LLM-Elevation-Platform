import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";

const EvaluationTable = () => {
  const { results } = useContext(DataContext);

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Prompt</th>
          <th>Model</th>
          <th>Response</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr key={index}>
            <td>{result.prompt}</td>
            <td>{result.model}</td>
            <td>{result.response}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EvaluationTable;
