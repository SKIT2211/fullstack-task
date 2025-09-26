/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    const resp = await api.post("/auth/login", { email, password });
    const { token } = resp.data;
    localStorage.setItem("token", token);
    setUser({ token });
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
