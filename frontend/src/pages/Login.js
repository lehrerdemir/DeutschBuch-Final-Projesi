import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";

export default function Login() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const doLogin = async () => {
    setError("");
    try {
      await loginWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(getErrorMessage(e, "Login failed"));
    }
  };

  const doRegister = async () => {
    setError("");
    try {
      await registerWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(getErrorMessage(e, "Register failed"));
    }
  };

  const doGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (e) {
      setError(getErrorMessage(e, "Google login failed"));
    }
  };

  return (
    <Container sx={{ py: 4, maxWidth: 520 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {String(error)}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="contained" onClick={doLogin}>
            Login
          </Button>
          <Button variant="outlined" onClick={doRegister}>
            Register
          </Button>
        </Box>

        <Divider />

        <Button variant="contained" onClick={doGoogle}>
          Continue with Google
        </Button>
      </Box>
    </Container>
  );
}
