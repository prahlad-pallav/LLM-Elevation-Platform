// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  EVALUATION: `${API_BASE_URL}/evaluation/run/`,
  CHAT_LLAMA3: `${API_BASE_URL}/evaluation/chat/llama3/`,
  CHAT_GPT_OSS: `${API_BASE_URL}/evaluation/chat/gpt-oss/`,
  CHAT_DEEPSEEK: `${API_BASE_URL}/evaluation/chat/deepseek/`,
  JUDGE: `${API_BASE_URL}/evaluation/judge/`,
  HEALTH_GPT_OSS: `${API_BASE_URL}/evaluation/health/gpt-oss/`,
  HEALTH_DEEPSEEK: `${API_BASE_URL}/evaluation/health/deepseek/`,
};

export default API_BASE_URL;
