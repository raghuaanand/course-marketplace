"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/utils/helpers";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const total = subtotal - discount;

  const handleRemoveItem = (courseId: string) => {
    removeFromCart(courseId);
    toast.success("Course removed from cart");
  };

  const handleApplyCoupon = () => {
    // Simple coupon logic - in real app this would be validated server-side
    if (couponCode.toLowerCase() === "welcome10") {
      setDiscount(subtotal * 0.1);
      setAppliedCoupon("WELCOME10");
      toast.success("Coupon applied! 10% discount");
    } else if (couponCode.toLowerCase() === "student20") {
      setDiscount(subtotal * 0.2);
      setAppliedCoupon("STUDENT20");
      toast.success("Coupon applied! 20% discount");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#3A86FF]/20 shadow-lg mb-6">
            <ShoppingCart className="w-4 h-4 text-[#3A86FF] mr-2" />
            <span className="text-sm font-medium text-[#1E293B]">Shopping Cart</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Your Cart</h1>
          <p className="text-[#64748B]">
            {getTotalItems()} {getTotalItems() === 1 ? 'course' : 'courses'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-[#3A86FF]/10 max-w-md mx-auto">
              <ShoppingCart className="h-16 w-16 text-[#8338EC]/50 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">Your cart is empty</h2>
              <p className="text-[#64748B] mb-8">
                Discover our courses and start your learning journey today!
              </p>
              <Button 
                asChild 
                className="bg-[#3A86FF] hover:bg-[#2563EB] text-white px-8 py-3"
              >
                <Link href="/courses">
                  Browse Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#3A86FF]/10 hover:border-[#3A86FF]/20 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                          <Image
                            src={item.course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=100&fit=crop"}
                            alt={item.course.title}
                            width={150}
                            height={100}
                            className="w-full sm:w-40 h-24 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg text-[#1E293B] line-clamp-2">
                              {item.course.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.course.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <p className="text-[#64748B] text-sm mb-3">
                            {/* Display instructor info if available, otherwise show generic text */}
                            {(item.course as any).instructor ? (
                              <>by {(item.course as any).instructor.firstName} {(item.course as any).instructor.lastName}</>
                            ) : (
                              <>Course by instructor</>
                            )}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Show rating if available */}
                              {(item.course as any).averageRating && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[#FFBE0B]">★</span>
                                  <span className="text-sm font-medium text-[#1E293B]">
                                    {(item.course as any).averageRating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {/* Show level if available */}
                              {item.course.level && (
                                <span className="px-2 py-1 bg-[#8338EC]/10 text-[#8338EC] text-xs rounded-full">
                                  {item.course.level}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[#1E293B]">
                                {formatCurrency(Number(item.course.price))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24"
              >
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#3A86FF]/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-[#1E293B]">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Coupon Section */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-[#1E293B] flex items-center gap-2">
                        <Tag className="h-4 w-4 text-[#8338EC]" />
                        Coupon Code
                      </h4>
                      {!appliedCoupon ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 border-[#3A86FF]/20 focus:border-[#3A86FF] focus:ring-[#3A86FF]"
                          />
                          <Button 
                            onClick={handleApplyCoupon}
                            variant="outline"
                            disabled={!couponCode.trim()}
                            className="border-[#3A86FF]/20 text-[#3A86FF] hover:bg-[#3A86FF] hover:text-white"
                          >
                            Apply
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg">
                          <span className="text-sm font-medium text-[#10B981]">
                            {appliedCoupon} Applied
                          </span>
                          <Button
                            onClick={handleRemoveCoupon}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-[#64748B]">
                        Try: WELCOME10 (10% off) or STUDENT20 (20% off)
                      </p>
                    </div>

                    <Separator className="bg-[#3A86FF]/20" />

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-[#64748B]">
                        <span>Subtotal ({getTotalItems()} courses)</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-[#10B981]">
                          <span>Discount ({appliedCoupon})</span>
                          <span>-{formatCurrency(discount)}</span>
                        </div>
                      )}
                      
                      <Separator className="bg-[#3A86FF]/20" />
                      
                      <div className="flex justify-between text-lg font-bold text-[#1E293B]">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-[#3A86FF] hover:bg-[#2563EB] text-white text-lg py-3"
                      size="lg"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <p className="text-xs text-[#64748B] text-center">
                      30-day money-back guarantee
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
