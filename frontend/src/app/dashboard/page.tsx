"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Play, 
  Calendar,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { enrollmentService } from "@/services/enrollment";
import { formatDate, formatDuration } from "@/utils/helpers";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["user-enrollments"],
    queryFn: () => enrollmentService.getEnrollments(),
    enabled: !!user,
  });

  const enrollments = enrollmentsData?.enrollments || [];

  const { data: stats } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => ({
      totalCourses: enrollments?.length || 0,
      completedCourses: enrollments?.filter(e => e.status === 'COMPLETED')?.length || 0,
      inProgressCourses: enrollments?.filter(e => e.status === 'ACTIVE')?.length || 0,
      totalStudyTime: 0, // This would need to be calculated from lesson progress data
    }),
    enabled: !!enrollments,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h1>
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Continue your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalCourses || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.completedCourses || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.inProgressCourses || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Study Time
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatDuration(stats?.totalStudyTime || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Continue Learning Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-300 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : enrollments && enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments
                      .filter(enrollment => enrollment.status === 'ACTIVE')
                      .slice(0, 3)
                      .map((enrollment) => (
                        <div key={enrollment.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <Image
                            src={enrollment.course?.thumbnail || "/api/placeholder/64/64"}
                            alt={enrollment.course?.title || "Course thumbnail"}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {enrollment.course?.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                            </p>
                            <div className="flex items-center gap-4">
                              <Progress 
                                value={enrollment.progress || 0} 
                                className="flex-1"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {Math.round(enrollment.progress || 0)}%
                              </span>
                            </div>
                          </div>
                          <Button asChild>
                            <Link href={`/learn/${enrollment.course?.id}`}>
                              Continue
                            </Link>
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No courses yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Start your learning journey by enrolling in a course
                    </p>
                    <Button asChild>
                      <Link href="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrollments?.slice(0, 5).map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">Enrolled in</span>{" "}
                          <Link 
                            href={`/courses/${enrollment.course?.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {enrollment.course?.title}
                          </Link>
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(enrollment.enrolledAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Courses
              </h2>
              <Button asChild>
                <Link href="/courses">Browse More Courses</Link>
              </Button>
            </div>

            {enrollmentsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : enrollments && enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={enrollment.course?.thumbnail || "/api/placeholder/300/200"}
                        alt={enrollment.course?.title || "Course thumbnail"}
                        width={300}
                        height={192}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge 
                        className="absolute top-4 right-4"
                        variant={
                          enrollment.status === 'COMPLETED' ? 'default' :
                          enrollment.status === 'ACTIVE' ? 'secondary' : 'outline'
                        }
                      >
                        {enrollment.status === 'COMPLETED' ? 'Completed' :
                         enrollment.status === 'ACTIVE' ? 'In Progress' : 'Cancelled'}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">
                        {enrollment.course?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{Math.round(enrollment.progress || 0)}%</span>
                          </div>
                          <Progress value={enrollment.progress || 0} />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                          <span>Enrolled: {formatDate(enrollment.enrolledAt)}</span>
                          {enrollment.course?.averageRating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{enrollment.course.averageRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <Button className="w-full" asChild>
                          <Link href={`/learn/${enrollment.course?.id}`}>
                            {enrollment.status === 'COMPLETED' ? 'Review' : 'Continue Learning'}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No courses enrolled
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Start learning by enrolling in your first course
                </p>
                <Button asChild>
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Achievements Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Complete courses to unlock achievements and certificates
              </p>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {enrollments?.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Enrolled in {enrollment.course?.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(enrollment.enrolledAt)}
                        </p>
                        <div className="mt-2">
                          <Progress value={enrollment.progress || 0} className="h-2" />
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
    </div>
  );
}
