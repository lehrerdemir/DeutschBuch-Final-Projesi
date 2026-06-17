import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  getIdTokenResult,
} from "firebase/auth";
import { auth, googleProvider, firebaseReady } from "../firebase";
import { ADMIN_EMAILS, DEMO_AUTH } from "../config";

const AuthContext = createContext(null);
const DEMO_USER_KEY = "deutschbuch_demo_user";

function isAdminEmail(email) {
  return Boolean(email) && ADMIN_EMAILS.includes(String(email).toLowerCase());
}

function makeDemoUser(email) {
  const cleanEmail = email || "ogrenci@demo.local";
  return {
    uid: `demo-${cleanEmail.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    email: cleanEmail,
    displayName: isAdminEmail(cleanEmail) ? "Demo Admin" : "Demo Kullanıcı",
  };
}

export function getDemoUserFromStorage() {
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const demoMode = DEMO_AUTH || !firebaseReady || !auth;

  useEffect(() => {
    if (demoMode) {
      const stored = getDemoUserFromStorage();
      setUser(stored);
      setAdmin(isAdminEmail(stored?.email));
      setLoading(false);
      return undefined;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const tokenResult = await getIdTokenResult(u, true);
          const emailAllowed = isAdminEmail(u.email);
          setAdmin(Boolean(tokenResult?.claims?.admin) || String(tokenResult?.claims?.role || "").toLowerCase() === "admin" || emailAllowed);
        } catch {
          setAdmin(false);
        }
      } else {
        setAdmin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [demoMode]);

  const loginDemo = async (email) => {
    const next = makeDemoUser(email);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(next));
    setUser(next);
    setAdmin(isAdminEmail(next.email));
    return { user: next };
  };

  const logoutDemo = async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
    setAdmin(false);
  };

  const api = useMemo(
    () => ({
      user,
      admin,
      loading,
      demoMode,
      loginWithEmail: (email, password) => demoMode ? loginDemo(email) : signInWithEmailAndPassword(auth, email, password),
      registerWithEmail: (email, password) => demoMode ? loginDemo(email) : createUserWithEmailAndPassword(auth, email, password),
      loginWithGoogle: () => demoMode ? loginDemo("lehrerdemir@gmail.com") : signInWithPopup(auth, googleProvider),
      logout: () => demoMode ? logoutDemo() : signOut(auth),
      getToken: async () => (!demoMode && auth?.currentUser ? auth.currentUser.getIdToken() : null),
    }),
    [user, admin, loading, demoMode]
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
