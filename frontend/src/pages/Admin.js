import React, { useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import { adminCreateProduct, adminDeleteProduct, adminListProducts, adminUpdateProduct } from "../services/adminProductService";
import { adminAnswerQuestion, adminListQuestions } from "../services/questionService";
import { resolveImageUrl, formatTRY } from "../config";
import { getErrorMessage } from "../utils/errors";

const emptyForm = { name: "", author: "", publisher: "", level: "", category: "", description: "", price: 0, featured: false, details: "", stockQuantity: 0, imageFile: null };

export default function Admin() {
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [answers, setAnswers] = useState({});

  const title = useMemo(() => (editingId ? "Ürün Düzenle" : "Ürün Ekle"), [editingId]);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const [productData, questionData] = await Promise.all([adminListProducts(), adminListQuestions()]);
      setProducts(productData || []);
      setQuestions(questionData || []);
    } catch (e) {
      setError(getErrorMessage(e, "Admin verileri yüklenemedi"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setOpen(true); };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      author: p.author || "",
      publisher: p.publisher || "",
      level: p.level || "",
      category: p.category || "",
      description: p.description || "",
      price: p.price ?? 0,
      featured: Boolean(p.featured),
      details: p.details || "",
      stockQuantity: p.stockQuantity ?? 0,
      imageFile: null,
    });
    setOpen(true);
  };

  const save = async () => {
    setError("");
    try {
      if (editingId) await adminUpdateProduct(editingId, form);
      else await adminCreateProduct(form);
      setOpen(false);
      await load();
    } catch (e) {
      setError(getErrorMessage(e, "Kayıt başarısız"));
    }
  };

  const del = async (id) => {
    if (!window.confirm("Bu ürünü silmek istiyor musunuz?")) return;
    setError("");
    try { await adminDeleteProduct(id); await load(); }
    catch (e) { setError(getErrorMessage(e, "Silme başarısız")); }
  };

  const answerQuestion = async (q) => {
    const text = answers[q.id] || "";
    if (!text.trim()) return;
    setError("");
    try {
      await adminAnswerQuestion(q.id, text);
      setAnswers({ ...answers, [q.id]: "" });
      await load();
    } catch (e) {
      setError(getErrorMessage(e, "Cevap gönderilemedi"));
    }
  };

  if (loading) return <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}><CircularProgress /></Container>;

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4">Admin Paneli</Typography>
        {tab === 0 && <Button variant="contained" onClick={openAdd}>Ürün Ekle</Button>}
      </Box>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mt: 2 }}>
        <Tab label="Ürün Ekleme" />
        <Tab label="Stok Adedi Değiştirme" />
        <Tab label="Kullanıcı Mesajları" />
      </Tabs>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{String(error)}</Alert>}

      {(tab === 0 || tab === 1) && (
        <Table sx={{ mt: 2 }}>
          <TableHead><TableRow><TableCell>Görsel</TableCell><TableCell>Ürün</TableCell><TableCell>Seviye/Kategori</TableCell><TableCell>Fiyat</TableCell><TableCell>Stok</TableCell><TableCell>Öne Çıkan</TableCell><TableCell align="right">İşlem</TableCell></TableRow></TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.imageUrl ? <img src={resolveImageUrl(p.imageUrl)} alt={p.name} style={{ height: 48, borderRadius: 6 }} /> : "-"}</TableCell>
                <TableCell>{p.name}<Typography variant="body2" color="text.secondary">{p.publisher || "-"}</Typography></TableCell>
                <TableCell>{[p.level, p.category].filter(Boolean).join(" / ") || "-"}</TableCell>
                <TableCell>{formatTRY(p.price)}</TableCell>
                <TableCell><Chip label={`${p.stockQuantity ?? 0} adet`} color={(p.stockQuantity ?? 0) > 0 ? "success" : "warning"} size="small" /></TableCell>
                <TableCell>{p.featured ? "Evet" : "Hayır"}</TableCell>
                <TableCell align="right"><Button size="small" onClick={() => openEdit(p)}>{tab === 1 ? "Stok Güncelle" : "Düzenle"}</Button><Button size="small" color="error" onClick={() => del(p.id)}>Sil</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {tab === 2 && (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {questions.length === 0 ? <Typography color="text.secondary">Henüz kullanıcı sorusu yok.</Typography> : questions.map((q) => (
            <Box key={q.id} sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
              <Typography variant="subtitle2" color="primary">{q.productName}</Typography>
              <Typography sx={{ mt: 1 }}><strong>Soru:</strong> {q.questionText}</Typography>
              <Typography variant="body2" color="text.secondary">{q.userName || q.userEmail || "Kullanıcı"}</Typography>
              {q.answerText ? (
                <Alert severity="success" sx={{ mt: 1 }}><strong>Cevap:</strong> {q.answerText}</Alert>
              ) : (
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <TextField fullWidth size="small" label="Admin cevabı" value={answers[q.id] || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} />
                  <Button variant="contained" onClick={() => answerQuestion(q)}>Cevapla</Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Ürün Adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Yazar" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <TextField label="Yayınevi" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
          <TextField label="Seviye" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
          <TextField label="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <TextField label="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="Detay" multiline minRows={3} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
          <TextField label="Fiyat" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <TextField label="Stok Adedi" type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })} />
          <FormControlLabel control={<Checkbox checked={Boolean(form.featured)} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />} label="Öne çıkar" />
          <Button variant="outlined" component="label">{form.imageFile ? "Görsel seçildi" : "Görsel seç"}<input type="file" hidden accept="image/*" onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })} /></Button>
        </DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>Vazgeç</Button><Button variant="contained" onClick={save}>Kaydet</Button></DialogActions>
      </Dialog>
    </Container>
  );
}
