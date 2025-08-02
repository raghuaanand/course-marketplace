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
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center py-16">
      <div className="max-w-md w-full mx-4">
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#10B981]/20 shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-[#1E293B] mb-2">Payment Successful!</CardTitle>
            <p className="text-[#64748B] leading-relaxed">
              Thank you for your purchase. You now have access to your courses.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 border border-[#10B981]/20 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-[#10B981]/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-[#10B981]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E293B] mb-1">
                    Courses Available
                  </p>
                  <p className="text-sm text-[#64748B]">
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
