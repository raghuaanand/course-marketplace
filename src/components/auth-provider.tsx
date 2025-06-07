"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { AuthSync } from "./auth-sync";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthSync />
      {children}
    </SessionProvider>
  );
}
