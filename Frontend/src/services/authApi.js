import api from "./api"; // ✅ default import

// Auth API routes
export const registerApi = (data) => api.post("/auth/register", data);
export const loginUserApi = (data) => api.post("/auth/login-user", data);
export const loginAdminApi = (data) => api.post("/auth/login-admin", data);
export const forgotPasswordApi = (data) => api.post("/auth/forgot-password", data);
