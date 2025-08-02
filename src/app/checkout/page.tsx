"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatCurrency } from "@/utils/helpers";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getTotalPrice, getTotalSavings, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }
    
    if (items.length === 0) {
      router.push("/courses");
      return;
    }
  }, [isAuthenticated, items.length, router]);

  const totalPrice = getTotalPrice();
  const totalSavings = getTotalSavings();

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // TODO: Implement Stripe checkout
      console.log("Processing checkout...", { items, totalPrice });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success
      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout failed:", error);
      // TODO: Show error message
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#3A86FF]" />
          <p className="text-[#64748B]">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#3A86FF]/20 shadow-lg mb-6">
            <Lock className="w-4 h-4 text-[#3A86FF] mr-2" />
            <span className="text-sm font-medium text-[#1E293B]">Secure Checkout</span>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center text-[#64748B] hover:text-[#1E293B] mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-[#1E293B]">
            Checkout
          </h1>
          <p className="text-[#64748B] mt-2">
            Complete your purchase to start learning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#3A86FF]/10">
              <CardHeader>
                <CardTitle className="text-[#1E293B]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.course.id} className="flex items-start space-x-4">
                      <div className="relative w-20 h-14 rounded-md overflow-hidden">
                        <Image
                          src={item.course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop&q=80"}
                          alt={item.course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {item.course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Course ID: {item.course.id}
                        </p>
                        {item.course.discountPrice && (
                          <Badge variant="secondary" className="mt-1">
                            Sale
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        {item.course.discountPrice ? (
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(Number(item.course.discountPrice))}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatCurrency(Number(item.course.price))}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(Number(item.course.price))}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Subtotal ({items.length} {items.length === 1 ? 'course' : 'courses'})
                    </span>
                    <span className="text-sm font-medium">
                      {formatCurrency(totalPrice + totalSavings)}
                    </span>
                  </div>
                  
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Savings</span>
                      <span className="text-sm font-medium">
                        -{formatCurrency(totalSavings)}
                      </span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p className="flex items-center">
                      <Lock className="h-3 w-3 mr-1" />
                      Secured by Stripe
                    </p>
                    <p className="mt-1">
                      30-day money-back guarantee
                    </p>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Complete Purchase
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    By completing your purchase you agree to our{" "}
                    <Link href="/terms" className="underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
