import React, { useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext";
import { createPaymentIntent } from "../services/paymentService";
import { confirmOrder } from "../services/orderService";
import { useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/errors";
import { DEMO_PAYMENT, formatTRY } from "../config";

const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cartItems = useMemo(
    () => items.map((it) => ({ productId: it.id, quantity: it.quantity || 1 })),
    [items]
  );

  const handlePay = async () => {
    setError("");
    if (!stripe || !elements) return;
    setSubmitting(true);
    try {
      const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
      if (result.error) {
        setError(result.error.message || "Ödeme başarısız");
        return;
      }
      const paymentIntentId = result.paymentIntent?.id;
      if (!paymentIntentId) {
        setError("Payment intent id alınamadı");
        return;
      }
      await confirmOrder(paymentIntentId, cartItems, location.state);
      clear();
      navigate("/orders", { replace: true });
    } catch (e) {
      setError(getErrorMessage(e, "Ödeme başarısız"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      {error && <Alert severity="error">{String(error)}</Alert>}
      <PaymentElement />
      <Button variant="contained" size="large" disabled={!stripe || submitting} onClick={handlePay}>
        {submitting ? "İşleniyor..." : "Öde"}
      </Button>
    </Box>
  );
}

function DemoPaymentForm({ cartItems, shipping }) {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const total = items.reduce((sum, it) => sum + Number(it.price || 0) * (it.quantity || 1), 0);

  const handleDemoPay = async () => {
    setError("");
    setSubmitting(true);
    try {
      await confirmOrder(`demo_${Date.now()}`, cartItems, shipping);
      clear();
      navigate("/orders", { replace: true });
    } catch (e) {
      setError(getErrorMessage(e, "Demo ödeme kaydedilemedi"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Alert severity="info">
        Demo ödeme modu açık. Bu mod Stripe hesabı olmadan sunum provası yapmanı sağlar. Gerçek Stripe için .env dosyasında demo modunu kapatıp publishable/secret key girilir.
      </Alert>
      {error && <Alert severity="error">{String(error)}</Alert>}
      <Box sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6">Kart Bilgileri</Typography>
        <Typography color="text.secondary">Test kartı simülasyonu: 4242 4242 4242 4242</Typography>
        <Typography sx={{ mt: 1, fontWeight: 800 }}>Toplam: {formatTRY(total)}</Typography>
      </Box>
      <Button variant="contained" size="large" disabled={submitting} onClick={handleDemoPay}>
        {submitting ? "Kaydediliyor..." : "Demo Ödemeyi Tamamla"}
      </Button>
    </Box>
  );
}

export default function Payment() {
  const { items } = useCart();
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(!DEMO_PAYMENT);
  const [error, setError] = useState("");

  const cartItems = useMemo(
    () => items.map((it) => ({ productId: it.id, quantity: it.quantity || 1 })),
    [items]
  );

  useEffect(() => {
    if (DEMO_PAYMENT) {
      setLoading(false);
      return undefined;
    }
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await createPaymentIntent(cartItems);
        if (!mounted) return;
        if (!res?.clientSecret) throw new Error("Missing client secret");
        setClientSecret(res.clientSecret);
      } catch (e) {
        if (mounted) setError(getErrorMessage(e, "Ödeme başlatılamadı"));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [cartItems]);

  const shipping = location.state;
  if (!shipping?.phone || !shipping?.address) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Teslimat bilgileri eksik. Lütfen sepete geri dönüp telefon ve adres girin.</Alert>
        <Box sx={{ mt: 2 }}><Button variant="contained" onClick={() => window.history.back()}>Geri</Button></Box>
      </Container>
    );
  }

  if (DEMO_PAYMENT) {
    return (
      <Container sx={{ py: 4, maxWidth: 720 }}>
        <Typography variant="h4" gutterBottom>Ödeme</Typography>
        <DemoPaymentForm cartItems={cartItems} shipping={shipping} />
      </Container>
    );
  }

  if (!stripeKey || !stripePromise) {
    return <Container sx={{ py: 4 }}><Alert severity="error">.env içinde REACT_APP_STRIPE_PUBLISHABLE_KEY eksik.</Alert></Container>;
  }

  if (loading) return <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}><CircularProgress /></Container>;

  if (error || !clientSecret) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>Ödeme</Typography>
        <Alert severity="error">{String(error || "Ödeme başlatılamadı")}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, maxWidth: 720 }}>
      <Typography variant="h4" gutterBottom>Ödeme</Typography>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </Container>
  );
}
