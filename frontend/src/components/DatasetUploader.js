import React, { useContext, useState } from "react";
import { uploadDataset } from "../api/datasetService";
import { DataContext } from "../context/DataContext";

const DatasetUploader = () => {
  const { setDataset } = useContext(DataContext);
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file.");
  
    try {
      const response = await uploadDataset(file);
      // console.log("hello");
      console.log("API Response:", response.data); // Debugging log
  
      if (response.data && response.data.columns && response.data.rows) {
        setDataset(response.data); // Store dataset in context
      } else {
        alert("Invalid dataset format! Check console for response.");
      }
    } catch (error) {
      alert("Upload failed!");
    }
  };
  

  return (
    <div>
      <h2>Upload Dataset</h2>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default DatasetUploader;
