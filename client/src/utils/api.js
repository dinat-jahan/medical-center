import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:2000/auth"
    : `${import.meta.env.VITE_API_BASE_URL}/auth`,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message;
    return Promise.reject(new Error(msg));
  }
);

export default api;
