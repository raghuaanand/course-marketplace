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
    // Mock coupon validation
    if (couponCode.toLowerCase() === "welcome10") {
      setDiscount(subtotal * 0.1);
      setAppliedCoupon(couponCode);
      toast.success("Coupon applied successfully!");
    } else if (couponCode.toLowerCase() === "student20") {
      setDiscount(subtotal * 0.2);
      setAppliedCoupon(couponCode);
      toast.success("Student discount applied!");
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {getTotalItems()} {getTotalItems() === 1 ? "course" : "courses"} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any courses to your cart yet. 
              Start exploring our courses and add them to your cart.
            </p>
            <Button size="lg" asChild>
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.course.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Image
                        src={item.course.thumbnail || "/api/placeholder/120/80"}
                        alt={item.course.title}
                        width={128}
                        height={80}
                        className="w-full sm:w-32 h-20 object-cover rounded"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {item.course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          Course
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {item.course.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(item.discountPrice || item.price)}
                          </div>
                          {item.discountPrice && item.discountPrice < item.price && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatCurrency(item.price)}
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.course.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? "item" : "items"})</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({appliedCoupon})</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Separator />

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">Apply Coupon</span>
                    </div>
                    
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          {appliedCoupon} applied
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                          className="text-green-600 hover:text-green-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim()}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      <p>Available coupons:</p>
                      <p>• WELCOME10 - 10% off</p>
                      <p>• STUDENT20 - 20% off</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Keep Shopping */}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/courses">
                      Continue Shopping
                    </Link>
                  </Button>

                  {/* Clear Cart */}
                  {items.length > 0 && (
                    <Button
                      variant="ghost"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => {
                        clearCart();
                        toast.success("Cart cleared");
                      }}
                    >
                      Clear Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
