"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { 
  Star, 
  Clock, 
  Users, 
  Play, 
  Heart, 
  Share2, 
  BookOpen,
  Globe,
  CheckCircle,
  ChevronDown,
  Award,
  Monitor,
  Smartphone,
  Download,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { courseService } from "@/services/course";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatCurrency, formatDuration } from "@/utils/helpers";
import { motion } from "framer-motion";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const { addToCart, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourse(courseId),
    enabled: !!courseId,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: () => courseService.getCourseReviews(courseId),
    enabled: !!courseId,
  });

  const isInCart = items.some((item) => item.course.id === courseId);
  const lessons = course?.lessons || [];
  const totalDuration = lessons.reduce((total, lesson) => total + (lesson.videoDuration || 0), 0);
  const totalLessons = lessons.length;
  const reviews = reviewsData?.reviews || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Course not found</h1>
          <p className="text-muted-foreground mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    addToCart(course);
  };

  const handleEnrollNow = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    addToCart(course);
    router.push("/cart");
  };

  const features = [
    { icon: Monitor, text: "Full lifetime access" },
    { icon: Smartphone, text: "Access on mobile and TV" },
    { icon: Download, text: "Downloadable resources" },
    { icon: Award, text: "Certificate of completion" },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src={course.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop"}
            alt=""
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70" />
        </div>

        <div className="relative z-10 section-container py-16 lg:py-24">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    {course.category?.name}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    {course.level}
                  </Badge>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
                  {course.title}
                </h1>

                <p className="text-lg text-white/80 mb-8 max-w-2xl">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{course.averageRating || "0.0"}</span>
                    </div>
                    <span className="text-white/60">({reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Users className="w-5 h-5" />
                    <span>{(course._count?.enrollments || 0).toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="w-5 h-5" />
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <BookOpen className="w-5 h-5" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Globe className="w-5 h-5" />
                    <span>{course.language}</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-4">
                  <Image
                    src={course.instructor?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                    alt={`${course.instructor?.firstName} ${course.instructor?.lastName}`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm text-white/60">Created by</p>
                    <p className="font-medium">{course.instructor?.firstName} {course.instructor?.lastName}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Purchase Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-2xl shadow-apple-xl overflow-hidden sticky top-24">
                <div className="relative aspect-video">
                  <Image
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button variant="secondary" size="lg" className="rounded-full">
                      <Play className="h-6 w-6 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl font-semibold">
                      {formatCurrency(Number(course.discountPrice || course.price))}
                    </span>
                    {course.discountPrice && Number(course.discountPrice) < Number(course.price) && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          {formatCurrency(Number(course.price))}
                        </span>
                        <Badge variant="destructive" className="rounded-full">
                          {Math.round((1 - Number(course.discountPrice) / Number(course.price)) * 100)}% off
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 mb-6">
                    <Button 
                      className="w-full h-12 rounded-xl text-base shadow-apple" 
                      onClick={handleEnrollNow}
                    >
                      Enroll Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl text-base" 
                      onClick={handleAddToCart}
                      disabled={isInCart}
                    >
                      {isInCart ? "Added to Cart" : "Add to Cart"}
                    </Button>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 text-sm">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-muted-foreground">
                        <feature.icon className="h-4 w-4 text-primary" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Share & Wishlist */}
                  <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-container py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="curriculum" className="rounded-lg">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor" className="rounded-lg">Instructor</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-8 space-y-8">
                {/* What You'll Learn */}
                {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <div className="bg-muted/30 rounded-2xl p-6 lg:p-8">
                    <h3 className="text-xl font-semibold mb-6">What you'll learn</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">About this course</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="curriculum" className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Course content</h3>
                  <p className="text-sm text-muted-foreground">
                    {totalLessons} lessons • {formatDuration(totalDuration)}
                  </p>
                </div>

                {lessons.length > 0 ? (
                  <div className="border border-border rounded-2xl overflow-hidden">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            {lesson.isFree && (
                              <Badge variant="secondary" className="text-xs mt-1">Free Preview</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Play className="h-4 w-4" />
                          <span>{formatDuration(lesson.videoDuration || 0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-2xl">
                    <p className="text-muted-foreground">Curriculum coming soon</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="instructor" className="mt-8">
                <div className="flex items-start gap-6">
                  <Image
                    src={course.instructor?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop"}
                    alt={`${course.instructor?.firstName} ${course.instructor?.lastName}`}
                    width={96}
                    height={96}
                    className="rounded-2xl"
                  />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </h3>
                    <p className="text-primary mb-4">{course.instructor?.role}</p>
                    {course.instructor?.bio && (
                      <p className="text-muted-foreground leading-relaxed">
                        {course.instructor.bio}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                    <span className="text-4xl font-semibold">{course.averageRating || "0.0"}</span>
                  </div>
                  <div>
                    <p className="font-medium">Course Rating</p>
                    <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium">
                          {review.userId?.toString().charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">Student</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          {review.comment && (
                            <p className="text-muted-foreground">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Desktop Only (Card is sticky in hero) */}
          <div className="hidden lg:block">
            {/* Additional content or empty space */}
          </div>
        </div>
      </section>
    </div>
  );
}

