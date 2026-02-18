import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/components/auth-provider";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { Toaster } from "@/components/ui/sonner";
import { StoreHydration } from "@/components/store-hydration";

// Inter - Clean, modern, SF Pro-like font
const inter = Inter({
  variable: "--font-sf-pro",
  subsets: ["latin"],
  display: "swap",
});

// JetBrains Mono for code
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CourseHub — Learn Without Limits",
  description: "Transform your career with world-class courses from industry experts. Master in-demand skills through hands-on projects and personalized learning paths.",
  keywords: "online courses, learning, education, skills development, career growth, expert instructors",
  authors: [{ name: "CourseHub" }],
  creator: "CourseHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "CourseHub — Learn Without Limits",
    description: "Transform your career with world-class courses from industry experts.",
    siteName: "CourseHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "CourseHub — Learn Without Limits",
    description: "Transform your career with world-class courses from industry experts.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <AuthProvider>
          <Providers>
            <StoreHydration />
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                },
              }}
            />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
