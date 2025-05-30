"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, BookOpen, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Thank you for your purchase. You now have access to your courses.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Courses Available
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Start learning immediately
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    Receipt Sent
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Check your email for the receipt
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/dashboard">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Go to My Courses
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/courses">
                  Explore More Courses
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4">
              Need help? Contact our{" "}
              <Link href="/support" className="underline">
                support team
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
