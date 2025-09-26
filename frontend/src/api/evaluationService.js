import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

// Send prompt to LLM
export const evaluatePrompt = async (prompt, model, maxWords = null) => {
  const payload = { prompt, model };
  if (maxWords) {
    payload.max_words = maxWords;
  }
  return axios.post(API_ENDPOINTS.EVALUATION, payload);
};
