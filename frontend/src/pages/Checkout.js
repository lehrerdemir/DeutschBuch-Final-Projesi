import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getMyProfile, updateMyProfile } from "../services/profileService";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { resolveImageUrl, formatTRY } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/errors";

export default function Checkout() {
  const { items, add, decrement, remove, clear } = useCart();
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    if (!user) return undefined;

    (async () => {
      try {
        const profile = await getMyProfile();
        if (!mounted) return;
        setPhone(profile?.phone || "");
        setAddress(profile?.address || "");
      } catch {
        // profile optional; ignore initial load error
      }
    })();

    return () => { mounted = false; };
  }, [user]);

  const totalPrice = items.reduce((sum, it) => sum + Number(it.price || 0) * (it.quantity || 1), 0);

  if (items.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Sepetiniz boş</Typography>
        <Button variant="contained" component={Link} to="/">Alışverişe dön</Button>
      </Container>
    );
  }

  const saveProfile = async () => {
    setError("");
    if (!phone.trim() || !address.trim()) {
      setError("Lütfen telefon ve adres girin.");
      return false;
    }
    try {
      setSaving(true);
      await updateMyProfile(phone.trim(), address.trim());
      return true;
    } catch (e) {
      setError(getErrorMessage(e, "Teslimat bilgileri kaydedilemedi"));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Sepet ve Teslimat</Typography>

      {!user && <Alert severity="info" sx={{ mb: 2 }}>Teslimat bilgisi girip ödeme yapmak için giriş yapın.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}

      <Box sx={{ mb: 2 }}>
        <Button color="secondary" onClick={clear}>Sepeti temizle</Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>Teslimat Bilgileri</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Telefon" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!user} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Adres" fullWidth multiline minRows={3} value={address} onChange={(e) => setAddress(e.target.value)} disabled={!user} />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="outlined" disabled={!user || saving} onClick={saveProfile}>
            {saving ? "Kaydediliyor..." : "Bilgileri Kaydet"}
          </Button>
          {!user && <Button variant="contained" component={Link} to="/login">Giriş Yap</Button>}
        </Box>
      </Box>

      {items.map((item) => (
        <Box key={item.id} sx={{ mb: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={2}>
              <CardMedia component="img" image={resolveImageUrl(item.imageUrl)} alt={item.name} sx={{ height: 80, width: "auto", borderRadius: 1 }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">{formatTRY(item.price)} / adet</Typography>
            </Grid>
            <Grid item xs={12} sm={3} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={() => decrement(item.id)}><RemoveIcon /></IconButton>
              <Typography>{item.quantity || 1}</Typography>
              <IconButton onClick={() => add(item)}><AddIcon /></IconButton>
            </Grid>
            <Grid item xs={8} sm={2}>
              <Typography variant="subtitle1">{formatTRY(item.price * (item.quantity || 1))}</Typography>
            </Grid>
            <Grid item xs={4} sm={1}>
              <IconButton onClick={() => remove(item.id)}><DeleteIcon /></IconButton>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5">Toplam: {formatTRY(totalPrice)}</Typography>
        <Button
          variant="contained"
          size="large"
          disabled={!user || saving}
          onClick={async () => {
            if (!user) {
              setError("Lütfen önce giriş yapın.");
              return;
            }
            const ok = await saveProfile();
            if (ok) navigate("/payment", { state: { phone: phone.trim(), address: address.trim() } });
          }}
        >
          Ödemeye Geç
        </Button>
      </Box>
    </Container>
  );
}
