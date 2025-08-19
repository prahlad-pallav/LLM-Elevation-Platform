import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Adjust as needed

// Send prompt to LLM
export const evaluatePrompt = async (prompt, model, maxWords = null) => {
  const payload = { prompt, model };
  if (maxWords) {
    payload.max_words = maxWords;
  }
  return axios.post(`${BASE_URL}/evaluation/run/`, payload);
};
