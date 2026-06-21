import { createContext, useContext } from "react";
import useAuth from "../hooks/useAuth";

export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(
  null,
);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
