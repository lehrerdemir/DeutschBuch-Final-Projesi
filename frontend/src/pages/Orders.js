import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { getMyOrders } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getErrorMessage } from "../utils/errors";

function centsToTRY(cents) {
  return `${(Number(cents) / 100).toFixed(2)} TL`;
}

export default function Orders() {
  const { admin } = useAuth() || {};

  // IMPORTANT: React hooks must be called unconditionally (same order on every render).
  // So we define hooks first, then we can render a redirect for admins.
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    // Admins should use the dedicated Admin Orders page.
    // Avoid fetching customer orders for admins.
    if (admin) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getMyOrders();
        if (mounted) setOrders(data);
      } catch (e) {
        if (mounted) setError(getErrorMessage(e, "Failed to load orders"));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [admin]);

  // Admins should not see the customer "Sipariş Geçmişim" page.
  if (admin) {
    return <Navigate to="/admin/orders" replace />;
  }

  if (loading) {
    return (
      <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sipariş Geçmişim
      </Typography>

      {error && <Alert severity="error">{String(error)}</Alert>}

      {(!orders || orders.length === 0) && !error ? (
        <Typography>Henüz sipariş yok.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {orders.map((o) => (
            <Box key={o.id} sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <Typography variant="h6">Order #{o.id}</Typography>
                <Typography variant="subtitle1">{centsToTRY(o.totalAmount)}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Ödeme: {o.paymentStatus} • Sipariş: {o.orderStatus} • Para birimi: {o.currency}
              </Typography>

              <Divider sx={{ my: 1 }} />

              {o.items?.map((it, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography variant="body2">
                    {it.name} × {it.quantity}
                  </Typography>
                  <Typography variant="body2">{centsToTRY(it.lineTotal)}</Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
