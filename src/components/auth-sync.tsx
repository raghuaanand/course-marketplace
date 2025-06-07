"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth";
import { UserRole, FrontendUser } from "@/types";

export function AuthSync() {
  const { data: session, status } = useSession();
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (session?.user) {
      // Convert NextAuth user to our FrontendUser type
      const user: FrontendUser = {
        id: session.user.id,
        email: session.user.email!,
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        avatar: session.user.image || null,
        role: session.user.role as UserRole,
        isEmailVerified: session.user.isEmailVerified || false,
        isActive: true,
        bio: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(user);
    } else {
      setUser(null);
    }
  }, [session, status, setUser, setLoading]);

  // Listen for authentication events
  useEffect(() => {
    // If NextAuth session expires, clear our store
    if (status === 'unauthenticated' && !session) {
      logout();
    }
  }, [status, session, logout]);

  return null;
}
