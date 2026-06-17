// src/api/axios.js
import axios from "axios";
import { API_BASE_URL, DEMO_AUTH, ADMIN_EMAILS } from "../config";
import { auth } from "../firebase";
import { getDemoUserFromStorage } from "../context/AuthContext";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  config.headers = config.headers || {};

  if (DEMO_AUTH) {
    const demoUser = getDemoUserFromStorage();
    if (demoUser?.email) {
      config.headers["X-Demo-User-Uid"] = demoUser.uid;
      config.headers["X-Demo-User-Email"] = demoUser.email;
      config.headers["X-Demo-User-Name"] = demoUser.displayName || "Demo Kullanıcı";
      config.headers["X-Demo-Admin"] = ADMIN_EMAILS.includes(String(demoUser.email).toLowerCase()) ? "true" : "false";
    }
    return config;
  }

  const user = auth?.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
