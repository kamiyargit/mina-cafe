import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api";
// Get the base URL without /api suffix for static files
const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Resolve an image URL - handles both relative (/uploads/...) and absolute URLs
 * @param url - The image URL from the backend
 * @returns Full URL that can be used in img src
 */
export function resolveImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  // If it's already an absolute URL, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // If it's a relative URL, prepend the backend base URL
  if (url.startsWith("/")) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
}

export default api;


