import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const isMutatingRequest = ["post", "put", "patch", "delete"].includes(
    config.method?.toLowerCase() || ""
  );

  if (isMutatingRequest && typeof window !== "undefined") {
    const hasCsrfToken = document.cookie.includes("XSRF-TOKEN");
    if (!hasCsrfToken) {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });
    }
  }
  
  return config;
});

export default axiosInstance;
