import React, { createContext, useEffect, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginReqRes } from "../services/authApi";

export const AuthContext = createContext({
  token: null,
  loading: true,
  signIn: async (_email, _password) => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("@token");
      if (saved) setToken(saved);
      setLoading(false);
    })();
  }, []);

  const signIn = async (email, password) => {
    const tk = await loginReqRes({ email, password });
    setToken(tk);
    await AsyncStorage.setItem("@token", tk);
  };

  const signOut = async () => {
    setToken(null);
    await AsyncStorage.removeItem("@token");
  };

  const value = useMemo(() => ({ token, loading, signIn, signOut }), [token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
