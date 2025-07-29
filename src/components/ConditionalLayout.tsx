"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    // Auth pages get minimal layout
    return (
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    );
  }

  // Regular pages get full layout with header and footer
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
