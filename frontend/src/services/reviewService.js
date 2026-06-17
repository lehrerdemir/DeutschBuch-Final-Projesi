import api from "../api/axios";

export const getReviewsForProduct = async (productId) => {
  const res = await api.get(`/products/${productId}/reviews`);
  return res.data;
};

export const addReviewForProduct = async (productId, { rating, comment }) => {
  const res = await api.post(`/products/${productId}/reviews`, { rating, comment });
  return res.data;
};

export const getRatingSummary = async (productId) => {
  const res = await api.get(`/products/${productId}/rating`);
  return res.data;
};
