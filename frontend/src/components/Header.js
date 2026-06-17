import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { items } = useCart();
  const { user, admin, logout } = useAuth() || {};

  const totalCount = items.reduce((sum, it) => sum + (it.quantity || 1), 0);

  return (
    <AppBar position="sticky" elevation={3} sx={{ bgcolor: "#122033" }}>
      <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit", fontWeight: 800 }}
        >
          DeutschBuch
        </Typography>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, mr: 2 }}>
          <Button color="inherit" component={Link} to="/">Anasayfa</Button>
          <Button color="inherit" component={Link} to="/orders">Sipariş Geçmişi</Button>
          {admin && <Button color="inherit" component={Link} to="/admin">Admin Paneli</Button>}
          {admin && <Button color="inherit" component={Link} to="/admin/orders">Admin Siparişler</Button>}
        </Box>

        <IconButton color="inherit" aria-label="cart" component={Link} to="/checkout">
          <Badge badgeContent={totalCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        <Box sx={{ ml: 1 }}>
          {user ? (
            <Button color="inherit" onClick={logout}>Çıkış</Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">Giriş</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
