import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Adjust as needed

// Upload CSV
export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${BASE_URL}/datasets/upload/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
