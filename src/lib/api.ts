import axios from "axios";
import { TOKEN_KEY } from "./consts.ts";
const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? "/api" : "//localhost:3000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => {
    throw error;
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;
