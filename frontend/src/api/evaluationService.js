import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Adjust as needed

// Send prompt to LLM
export const evaluatePrompt = async (prompt, model) => {
  return axios.post(`${BASE_URL}/evaluation/run/`, { prompt, model });
};
