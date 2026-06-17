import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useCart } from "../context/CartContext";
import { resolveImageUrl, formatTRY } from "../config";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const inStock = (product.stockQuantity ?? 0) > 0;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, overflow: "hidden" }}>
      <CardMedia
        component="img"
        height="220"
        image={resolveImageUrl(product.imageUrl)}
        alt={product.name}
        sx={{ objectFit: "contain", bgcolor: "#f7f8fb", p: 1 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          {product.level && <Chip label={product.level} size="small" color="primary" />}
          {product.category && <Chip label={product.category} size="small" variant="outlined" />}
        </Box>
        <Typography gutterBottom variant="h6" component="div">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {[product.publisher, product.author].filter(Boolean).join(" • ")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{product.description}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 800 }}>{formatTRY(product.price)}</Typography>
        <Chip label={inStock ? `Stok: ${product.stockQuantity} adet` : "Stokta yok"} color={inStock ? "success" : "warning"} size="small" sx={{ mt: 1 }} />
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button size="small" variant="contained" disabled={!inStock} onClick={() => add(product)}>Sepete Ekle</Button>
        <Button size="small" component={Link} to={`/products/${product.id}`}>Detay</Button>
      </CardActions>
    </Card>
  );
}
