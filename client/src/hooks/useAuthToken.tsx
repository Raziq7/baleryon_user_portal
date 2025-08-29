// src/hooks/useAuthToken.ts
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const useAuthToken = () => {
  const { isAuthenticated, token } = useSelector((s: RootState) => s.auth);

  // initial from localStorage (for page refresh before Redux rehydrates)
  const [isLogin, setIsLogin] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  });

  // React to Redux state changes
  useEffect(() => {
    setIsLogin(isAuthenticated || !!token || !!localStorage.getItem("token"));
  }, [isAuthenticated, token]);

  // React to token changes from other tabs / code paths
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") setIsLogin(!!e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return isLogin;
};

export default useAuthToken;
