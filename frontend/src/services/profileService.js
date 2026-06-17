import api from "../api/axios";

export const getMyProfile = async () => {
  const res = await api.get("/profile/me");
  return res.data;
};

export const updateMyProfile = async (phone, address) => {
  const res = await api.put("/profile/me", { phone, address });
  return res.data;
};
