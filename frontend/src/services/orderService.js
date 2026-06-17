import api from "../api/axios";

export const confirmOrder = async (paymentIntentId, items, shipping) => {
  const res = await api.post("/orders/confirm", {
    paymentIntentId,
    items,
    phone: shipping?.phone,
    address: shipping?.address,
  });
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/me");
  return res.data;
};

// Admin
export const adminGetOrders = async (filters = {}) => {
  const res = await api.get("/admin/orders", { params: filters });
  return res.data;
};

export const adminUpdateOrderStatus = async (orderId, orderStatus) => {
  const res = await api.patch(`/admin/orders/${orderId}/status`, { orderStatus });
  return res.data;
};
