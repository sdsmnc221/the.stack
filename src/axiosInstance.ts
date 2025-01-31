import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Authorization: import.meta.env.DEV
      ? `Bearer ${import.meta.env.VITE_NOTION_API_KEY}`
      : btoa(`Bearer ${import.meta.env.VITE_NOTION_API_KEY}`),
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  },
});

export default axiosInstance;
