import api from "../api/axios";

const toFormData = (payload) => {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("author", payload.author || "");
  form.append("publisher", payload.publisher || "");
  form.append("level", payload.level || "");
  form.append("category", payload.category || "");
  form.append("description", payload.description || "");
  form.append("price", String(payload.price));
  form.append("featured", String(Boolean(payload.featured)));
  form.append("details", payload.details || "");
  form.append("stockQuantity", String(payload.stockQuantity ?? 0));
  if (payload.imageFile) form.append("image", payload.imageFile);
  return form;
};

export const adminListProducts = async () => {
  const res = await api.get("/admin/products");
  return res.data;
};

export const adminCreateProduct = async (payload) => {
  const res = await api.post("/admin/products", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const adminUpdateProduct = async (id, payload) => {
  const res = await api.put(`/admin/products/${id}`, toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const adminDeleteProduct = async (id) => {
  await api.delete(`/admin/products/${id}`);
};
