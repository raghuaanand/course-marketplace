"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, ArrowRight, Tag, Star, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/utils/helpers";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = getTotalPrice();
  const total = subtotal - discount;

  const handleRemoveItem = (courseId: string) => {
    removeFromCart(courseId);
    toast.success("Course removed from cart");
  };

  const handleApplyCoupon = async () => {
    setIsApplyingCoupon(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (couponCode.toLowerCase() === "welcome10") {
      setDiscount(subtotal * 0.1);
      setAppliedCoupon("WELCOME10");
      toast.success("10% discount applied!");
    } else if (couponCode.toLowerCase() === "student20") {
      setDiscount(subtotal * 0.2);
      setAppliedCoupon("STUDENT20");
      toast.success("20% discount applied!");
    } else {
      toast.error("Invalid coupon code");
    }
    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="section-container py-8 lg:py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Shopping Cart</h1>
              <p className="text-sm text-muted-foreground">
                {getTotalItems()} {getTotalItems() === 1 ? 'course' : 'courses'}
              </p>
            </div>
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-muted/30 rounded-2xl"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Discover our courses and start your learning journey today!
            </p>
            <Button asChild className="rounded-full px-8">
              <Link href="/courses">
                Browse Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-2xl border border-border/50 p-4 sm:p-6 shadow-apple"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href={`/courses/${item.course.id}`} className="shrink-0">
                        <div className="relative w-full sm:w-40 aspect-video rounded-xl overflow-hidden">
                          <Image
                            src={item.course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=120&fit=crop"}
                            alt={item.course.title}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link href={`/courses/${item.course.id}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                                {item.course.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              {(item.course as any).instructor ? (
                                <>by {(item.course as any).instructor.firstName} {(item.course as any).instructor.lastName}</>
                              ) : (
                                'Expert Instructor'
                              )}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          {(item.course as any).averageRating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium">{(item.course as any).averageRating.toFixed(1)}</span>
                            </div>
                          )}
                          {item.course.level && (
                            <Badge variant="secondary" className="text-xs">
                              {item.course.level}
                            </Badge>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-xl font-semibold">
                            {formatCurrency(Number(item.course.price))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24"
              >
                <div className="bg-card rounded-2xl border border-border/50 shadow-apple-lg overflow-hidden">
                  <div className="p-6 border-b border-border/50">
                    <h2 className="font-semibold">Order Summary</h2>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Coupon */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Tag className="h-4 w-4 text-primary" />
                        <span>Coupon Code</span>
                      </div>
                      
                      {!appliedCoupon ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 h-10 rounded-xl"
                          />
                          <Button 
                            onClick={handleApplyCoupon}
                            disabled={!couponCode.trim() || isApplyingCoupon}
                            variant="outline"
                            className="rounded-xl"
                          >
                            Apply
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-600">{appliedCoupon}</span>
                          </div>
                          <Button
                            onClick={handleRemoveCoupon}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 text-muted-foreground hover:text-foreground"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Try: WELCOME10 or STUDENT20
                      </p>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 pt-4 border-t border-border/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({getTotalItems()} courses)</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                          <span>Discount ({appliedCoupon})</span>
                          <span>-{formatCurrency(discount)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border/50">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button 
                      onClick={handleCheckout}
                      className="w-full h-12 rounded-xl text-base shadow-apple"
                      size="lg"
                    >
                      Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      30-day money-back guarantee
                    </p>
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-4 text-center">
                  <Button variant="ghost" asChild className="text-muted-foreground">
                    <Link href="/courses">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
