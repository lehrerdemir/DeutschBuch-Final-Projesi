import api from "../api/axios";

export const createPaymentIntent = async (items, currency = "try") => {
  const res = await api.post("/payments/create-intent", { items, currency });
  return res.data;
};
