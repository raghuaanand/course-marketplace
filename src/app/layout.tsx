import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/components/auth-provider";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Course Marketplace - Learn, Teach, Grow",
  description: "Discover and enroll in courses from expert instructors. Build your skills with our comprehensive learning platform.",
  keywords: "courses, learning, education, online learning, skills, training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <AuthProvider>
          <Providers>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
