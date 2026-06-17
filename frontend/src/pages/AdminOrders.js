import React, { useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";

import { adminGetOrders, adminUpdateOrderStatus } from "../services/orderService";
import { getErrorMessage } from "../utils/errors";
import { formatCentsTRY } from "../config";

const ORDER_STATUS_OPTIONS = ["NEW_ORDER", "SENT_OUT", "RETURNED", "COMPLETED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  const filters = useMemo(
    () => ({
      email: email || undefined,
      phone: phone || undefined,
      paymentStatus: paymentStatus || undefined,
      orderStatus: orderStatus || undefined,
    }),
    [email, phone, paymentStatus, orderStatus]
  );

  const load = async (f = filters) => {
    setLoading(true);
    setError("");
    try {
      const data = await adminGetOrders(f);
      setOrders(data || []);
    } catch (e) {
      setError(getErrorMessage(e, "Siparişler yüklenemedi"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Admin • Siparişler</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}

      <Box sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>Filtreler</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField label="Kullanıcı e-posta" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Telefon" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Ödeme</InputLabel>
              <Select label="Ödeme" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                <MenuItem value="">Tümü</MenuItem>
                <MenuItem value="PAID">PAID</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="FAILED">FAILED</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sipariş Durumu</InputLabel>
              <Select label="Sipariş Durumu" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                <MenuItem value="">Tümü</MenuItem>
                {ORDER_STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button variant="contained" onClick={() => load(filters)} disabled={loading}>Uygula</Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setEmail("");
                  setPhone("");
                  setPaymentStatus("");
                  setOrderStatus("");
                  load({});
                }}
                disabled={loading}
              >
                Temizle
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sipariş #</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Adres</TableCell>
                <TableCell>Ödeme</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell align="right">Toplam</TableCell>
                <TableCell>Güncelle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => (
                <OrderRow key={o.id} order={o} onChanged={() => load(filters)} onError={(msg) => setError(msg)} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

function OrderRow({ order, onChanged, onError }) {
  const [status, setStatus] = useState(order.orderStatus || "NEW_ORDER");
  const [saving, setSaving] = useState(false);
  const created = order.createdAt ? new Date(order.createdAt).toLocaleString() : "";

  return (
    <TableRow hover>
      <TableCell>{order.id}</TableCell>
      <TableCell>{created}</TableCell>
      <TableCell>{order.userEmail || ""}</TableCell>
      <TableCell>{order.phone || ""}</TableCell>
      <TableCell sx={{ minWidth: 320 }}>{order.address || ""}</TableCell>
      <TableCell><Chip size="small" label={order.paymentStatus || ""} /></TableCell>
      <TableCell><Chip size="small" label={status} /></TableCell>
      <TableCell align="right">{formatCentsTRY(order.totalAmount)}</TableCell>
      <TableCell>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {ORDER_STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <Button
            size="small"
            variant="outlined"
            disabled={saving}
            onClick={async () => {
              try {
                setSaving(true);
                await adminUpdateOrderStatus(order.id, status);
                onChanged?.();
              } catch (e) {
                onError?.(getErrorMessage(e, "Sipariş durumu güncellenemedi"));
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "..." : "Kaydet"}
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
}
