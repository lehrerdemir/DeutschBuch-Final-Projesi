import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route
            path="/payment"
            element={
              <RequireAuth>
                <Payment />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RequireAdmin>
                <AdminOrders />
              </RequireAdmin>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
