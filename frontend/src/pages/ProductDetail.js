import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { resolveImageUrl, formatTRY } from "../config";
import { getErrorMessage } from "../utils/errors";
import { getReviewsForProduct, addReviewForProduct } from "../services/reviewService";
import { getQuestionsForProduct, addQuestionForProduct } from "../services/questionService";
import { useAuth } from "../context/AuthContext";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [ratingValue, setRatingValue] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionError, setQuestionError] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, r, q] = await Promise.all([getProductById(id), getReviewsForProduct(id), getQuestionsForProduct(id)]);
      setProduct(p);
      setReviews(r || []);
      setQuestions(q || []);
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e, "Ürün yüklenemedi"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, [id]);

  if (loading) return <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}><CircularProgress /></Container>;
  if (error || !product) return <Container sx={{ py: 4 }}><Typography color="error">Ürün yüklenemedi: {String(error || "Bulunamadı")}</Typography><Button component={Link} to="/">Ana sayfa</Button></Container>;

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <CardMedia component="img" image={resolveImageUrl(product.imageUrl)} alt={product.name} sx={{ width: "100%", maxHeight: 400, objectFit: "contain", borderRadius: 2, boxShadow: 1 }} />
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="h4" gutterBottom>{product.name}</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
            {product.level && <Chip label={product.level} color="primary" />}
            {product.category && <Chip label={product.category} variant="outlined" />}
          </Box>
          {(product.publisher || product.author) && <Typography color="text.secondary" gutterBottom>{[product.publisher, product.author].filter(Boolean).join(" • ")}</Typography>}
          <Typography variant="h6" color="primary" gutterBottom>{formatTRY(product.price)}</Typography>
          <Chip label={`Stok: ${product.stockQuantity ?? 0} adet`} color={(product.stockQuantity ?? 0) > 0 ? "success" : "warning"} sx={{ mb: 2 }} />
          {product.description && <Typography paragraph>{product.description}</Typography>}
          {product.details && <Typography variant="body2" color="text.secondary" paragraph>{product.details}</Typography>}

          <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="contained" size="large" disabled={(product.stockQuantity ?? 0) <= 0} onClick={() => add(product)}>Sepete Ekle</Button>
            <Button variant="outlined" size="large" component={Link} to="/">Ana Sayfa</Button>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>Yıldızlı Yorumlar</Typography>
          {reviewError && <Alert severity="error" sx={{ mb: 2 }}>{String(reviewError)}</Alert>}
          {user ? (
            <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1 }}>
              <Rating value={ratingValue} onChange={(e, v) => setRatingValue(v || 1)} />
              <TextField label="Yorum" multiline minRows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
              <Button variant="contained" onClick={async () => { try { await addReviewForProduct(id, { rating: ratingValue, comment }); setComment(""); setReviews(await getReviewsForProduct(id)); } catch(e) { setReviewError(getErrorMessage(e, "Yorum gönderilemedi")); } }}>Yorum Gönder</Button>
            </Box>
          ) : <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Yorum yazmak için giriş yapın.</Typography>}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {reviews.length === 0 ? <Typography variant="body2" color="text.secondary">Henüz yorum yok.</Typography> : reviews.map((r) => (
              <Box key={r.id} sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}><Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography>{r.userName || r.userEmail || "Kullanıcı"}</Typography><Rating value={r.rating} readOnly size="small" /></Box><Typography variant="body2" color="text.secondary">{r.comment}</Typography></Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>Ürün Hakkında Sorular</Typography>
          {questionError && <Alert severity="error" sx={{ mb: 2 }}>{String(questionError)}</Alert>}
          {user ? (
            <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
              <TextField fullWidth label="Ürün hakkında sorunuzu yazın" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
              <Button variant="contained" onClick={async () => { try { await addQuestionForProduct(id, { questionText }); setQuestionText(""); setQuestions(await getQuestionsForProduct(id)); } catch(e) { setQuestionError(getErrorMessage(e, "Soru gönderilemedi")); } }}>Sor</Button>
            </Box>
          ) : <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Soru sormak için giriş yapın.</Typography>}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {questions.length === 0 ? <Typography variant="body2" color="text.secondary">Henüz soru yok.</Typography> : questions.map((q) => (
              <Box key={q.id} sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}><Typography><strong>Soru:</strong> {q.questionText}</Typography>{q.answerText ? <Alert severity="success" sx={{ mt: 1 }}><strong>Admin cevabı:</strong> {q.answerText}</Alert> : <Typography variant="body2" color="text.secondary">Admin cevabı bekleniyor.</Typography>}</Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
