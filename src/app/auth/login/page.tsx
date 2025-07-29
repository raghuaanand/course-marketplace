"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getProviders } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { TestUserLogin } from "@/components/TestUserLogin";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [providers, setProviders] = useState<any>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    getProviders().then(setProviders);
    if (searchParams.get("error")) {
      setError("Invalid credentials or authentication error.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setIsLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else if (res?.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Test User Login Button - Development Only */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 text-center">
            <div className="bg-white rounded-lg border border-orange-200 p-4 shadow-sm">
              <p className="text-sm text-slate-600 mb-3">
                <strong>Development Mode:</strong> Quick test access
              </p>
              <TestUserLogin />
            </div>
          </div>
        )}
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600">
              Sign in to your account to continue learning
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            {/* Google Sign In */}
            <div className="mt-6">
              {providers && providers.google && (
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                >
                  Continue with Google
                </Button>
              )}
            </div>

            {/* Divider for creating account */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">
                    Don&apos;t have an account?
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-50" 
                  asChild
                >
                  <Link href="/auth/register">
                    Create Account
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
