import React, { useContext, useState } from "react";
import { uploadDataset } from "../api/datasetService";
import { DataContext } from "../context/DataContext";

const DatasetManager = () => {
  const { dataset, setDataset } = useContext(DataContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]); // Store first 5 rows for preview

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file.");
    
    try {
      const response = await uploadDataset(file);
      if (response.data && response.data.columns && response.data.rows) {
        setDataset(response.data);
        setPreview(response.data.rows.slice(0, 5)); // Show first 5 rows
      } else {
        alert("Invalid dataset format!");
      }
    } catch (error) {
      alert("Upload failed!");
    }
  };

  return (
    <div>
      <h2>Dataset Manager</h2>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      {preview.length > 0 && (
        <div>
          <h3>Dataset Preview</h3>
          <table border="1">
            <thead>
              <tr>
                {dataset.columns.map((col, index) => <th key={index}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, i) => <td key={i}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DatasetManager;
