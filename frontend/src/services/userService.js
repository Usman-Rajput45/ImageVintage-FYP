import api from "../utils/axios";

export const getUserProfile = async () => {
  const response = await api.get("/api/users/profile");
  return response.data?.data ?? response.data;
};

export const updateUserProfile = async (payload) => {
  const response = await api.put("/api/users/profile", payload);
  return response.data?.data ?? response.data;
};

export const requestPasswordReset = async (email) => {
  return api.post("/api/auth/forgot-password", { email });
};

export const resetPassword = async ({ token, email, password }) => {
  return api.post("/api/auth/reset-password", { token, email, password });
};
