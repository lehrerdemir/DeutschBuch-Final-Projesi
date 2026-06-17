import api from "../api/axios";

export const getQuestionsForProduct = async (productId) => {
  const res = await api.get(`/products/${productId}/questions`);
  return res.data;
};

export const addQuestionForProduct = async (productId, payload) => {
  const res = await api.post(`/products/${productId}/questions`, payload);
  return res.data;
};

export const adminListQuestions = async () => {
  const res = await api.get("/admin/questions");
  return res.data;
};

export const adminAnswerQuestion = async (questionId, answerText) => {
  const res = await api.put(`/admin/questions/${questionId}/answer`, { answerText });
  return res.data;
};
