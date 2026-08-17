import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, apiError } from "../lib/api";

export interface UserType {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "owner";
  createdAt?: string;
  updatedAt?: string;
}

interface AppContextType {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string, role?: string) => Promise<boolean>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token); setUser(data.user); localStorage.setItem("token", data.token);
      toast.success("Welcome back to QuickDine.");
      return true;
    } catch (error) { toast.error(apiError(error, "Login failed")); return false; }
  };

  const register = async (name: string, email: string, password: string, phone?: string, role = "user") => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password, phone, role });
      setToken(data.token); setUser(data.user); localStorage.setItem("token", data.token);
      toast.success("Your QuickDine account has been created.");
      return true;
    } catch (error) { toast.error(apiError(error, "Registration failed")); return false; }
  };

  const logout = () => { localStorage.removeItem("token"); setToken(null); setUser(null); window.location.href = "/"; };

  useEffect(() => {
    const loadUser = async () => {
      if (!token) { setLoading(false); return; }
      try { const { data } = await api.get("/auth/me"); setUser(data.user); }
      catch { localStorage.removeItem("token"); setToken(null); setUser(null); }
      finally { setLoading(false); }
    };
    loadUser();
  }, [token]);

  return <AppContext.Provider value={{ user, token, loading, isAuthenticated: !!user, isAuthModalOpen, setAuthModalOpen, login, register, logout }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
};
