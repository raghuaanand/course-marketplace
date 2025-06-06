"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/auth/login" });
  }, []);
  return <p>Logging out...</p>;
}
