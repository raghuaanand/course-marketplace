"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseService } from "@/services/course";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatCurrency, formatDuration } from "@/utils/helpers";


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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course not found
          </h1>
          <Button onClick={() => router.push("/courses")}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  // Use lessons directly from course data
  const lessons = course.lessons || [];
  const totalDuration = lessons.reduce((total, lesson) => total + (lesson.videoDuration || 0), 0);
  const totalLessons = lessons.length;

  const reviews = reviewsData?.reviews || [];

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {course.category?.name}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6 text-gray-100">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="font-semibold">{course.averageRating || 0}</span>
                  <span className="text-gray-200 ml-2">({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{course._count?.enrollments || 0} students</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-1" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-1" />
                  <span>{course.language}</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={course.instructor?.avatar || "/placeholder-avatar.jpg"}
                    alt={`${course.instructor?.firstName} ${course.instructor?.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">{course.instructor?.firstName} {course.instructor?.lastName}</p>
                  <p className="text-gray-200 text-sm">Instructor</p>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 shadow-xl">
                <div className="relative">
                  <Image
                    src={course.thumbnail || "/api/placeholder/400/225"}
                    alt={course.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute inset-0 bg-black/30 hover:bg-black/40 text-white"
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(Number(course.discountPrice || course.price))}
                      </span>
                      {course.discountPrice && Number(course.discountPrice) < Number(course.price) && (
                        <span className="text-lg text-gray-500 line-through ml-2">
                          {formatCurrency(Number(course.price))}
                        </span>
                      )}
                    </div>
                    {course.discountPrice && Number(course.discountPrice) < Number(course.price) && (
                      <Badge variant="destructive" className="text-sm">
                        {Math.round((1 - Number(course.discountPrice) / Number(course.price)) * 100)}% off
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleEnrollNow}
                    >
                      Enroll Now
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleAddToCart}
                      disabled={isInCart}
                    >
                      {isInCart ? "In Cart" : "Add to Cart"}
                    </Button>
                  </div>

                  <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Full lifetime access
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Access on mobile and TV
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Certificate of completion
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      Wishlist
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About this course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{course.description}</p>
                    </div>

                    {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">What you&apos;ll learn</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {course.whatYouWillLearn.map((item, index) => (
                            <div key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {course.requirements && course.requirements.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Requirements</h3>
                        <ul className="list-disc list-inside space-y-2">
                          {course.requirements.map((requirement, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              {requirement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course curriculum</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {totalLessons} lectures • {formatDuration(totalDuration)} total length
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {lessons.length > 0 ? (
                        <div className="border rounded-lg">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Course Content</h4>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {totalLessons} lectures • {formatDuration(totalDuration)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="divide-y">
                            {lessons.map((lesson, index) => (
                              <div key={lesson.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Play className="h-4 w-4 text-gray-400 mr-3" />
                                  <span className="text-sm">{index + 1}. {lesson.title}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {formatDuration(lesson.videoDuration || 0)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                          No curriculum content available yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={course.instructor?.avatar || "/api/placeholder/80/80"}
                        alt={`${course.instructor?.firstName} ${course.instructor?.lastName}`}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{course.instructor?.firstName} {course.instructor?.lastName}</h3>
                        <p className="text-blue-600 dark:text-blue-400 mb-4">Instructor</p>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{course.instructor?.bio}</p>
                        
                        <div className="grid grid-cols-1 gap-4 text-sm">
                          <div>
                            <span className="font-semibold">Role:</span>
                            <p className="text-gray-600 dark:text-gray-400">{course.instructor?.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="text-2xl font-bold">{course.averageRating || 0}</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {reviews.length} reviews
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews?.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <Image
                              src="/api/placeholder/40/40"
                              alt="User avatar"
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">Anonymous User</h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                              {review.comment && (
                                <p className="text-gray-800 dark:text-gray-200">{review.comment}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Course Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Skill level</span>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Language</span>
                    <span className="text-sm font-medium">{course.language}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                    <span className="text-sm font-medium">{(course._count?.enrollments || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Certificate</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
