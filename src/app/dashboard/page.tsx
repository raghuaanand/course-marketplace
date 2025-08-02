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
  const { user, isAuthenticated, isLoading } = useAuth();
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
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center pt-20">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg border border-[#3A86FF]/10 max-w-md mx-4">
          <BookOpen className="h-16 w-16 text-[#8338EC]/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1E293B] mb-4">Please log in to view your dashboard</h1>
          <Button 
            asChild
            className="bg-[#3A86FF] hover:bg-[#2563EB] text-white px-8 py-3"
          >
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#3A86FF]/20 shadow-lg mb-6">
            <TrendingUp className="w-4 h-4 text-[#3A86FF] mr-2" />
            <span className="text-sm font-medium text-[#1E293B]">Learning Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
            Welcome back, {user.name || user.email}!
          </h1>
          <p className="text-[#64748B]">
            Continue your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#3A86FF]/10 hover:border-[#3A86FF]/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-[#3A86FF]/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-[#3A86FF]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#64748B]">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold text-[#1E293B]">
                    {stats?.totalCourses || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#FFBE0B]/10 hover:border-[#FFBE0B]/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-[#FFBE0B]/10 rounded-lg">
                  <Award className="h-6 w-6 text-[#FFBE0B]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#64748B]">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-[#1E293B]">
                    {stats?.completedCourses || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#8338EC]/10 hover:border-[#8338EC]/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-[#8338EC]/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-[#8338EC]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#64748B]">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-[#1E293B]">
                    {stats?.inProgressCourses || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#64748B]/10 hover:border-[#64748B]/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-[#64748B]/10 rounded-lg">
                  <Clock className="h-6 w-6 text-[#64748B]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#64748B]">
                    Study Time
                  </p>
                  <p className="text-2xl font-bold text-[#1E293B]">
                    {formatDuration(stats?.totalStudyTime || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-2 border-[#3A86FF]/10">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-[#3A86FF] data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="courses"
              className="data-[state=active]:bg-[#3A86FF] data-[state=active]:text-white"
            >
              My Courses
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className="data-[state=active]:bg-[#3A86FF] data-[state=active]:text-white"
            >
              Achievements
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:bg-[#3A86FF] data-[state=active]:text-white"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Continue Learning Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#3A86FF]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1E293B]">
                  <div className="p-2 bg-[#3A86FF]/10 rounded-lg">
                    <Play className="h-5 w-5 text-[#3A86FF]" />
                  </div>
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
                        <div key={enrollment.id} className="flex items-center space-x-4 p-4 border-2 border-[#3A86FF]/10 hover:border-[#3A86FF]/20 rounded-lg bg-white/50 backdrop-blur-sm transition-all duration-300">
                          <Image
                            src={enrollment.course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=64&h=64&fit=crop"}
                            alt={enrollment.course?.title || "Course thumbnail"}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg shadow-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#1E293B]">
                              {enrollment.course?.title}
                            </h3>
                            <p className="text-sm text-[#64748B] mb-2">
                              {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                            </p>
                            <div className="flex items-center gap-4">
                              <Progress 
                                value={Number(enrollment.progress) || 0} 
                                className="flex-1 h-2 bg-[#F1F5F9]"
                              />
                              <span className="text-sm text-[#64748B] font-medium">
                                {Math.round(Number(enrollment.progress) || 0)}%
                              </span>
                            </div>
                          </div>
                          <Button 
                            asChild
                            className="bg-[#3A86FF] hover:bg-[#2563EB] text-white"
                          >
                            <Link href={`/learn/${enrollment.course?.id}`}>
                              Continue
                            </Link>
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/50 rounded-lg border-2 border-[#8338EC]/10">
                    <BookOpen className="h-12 w-12 text-[#8338EC]/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#1E293B] mb-2">
                      No courses yet
                    </h3>
                    <p className="text-[#64748B] mb-6">
                      Start your learning journey by enrolling in a course
                    </p>
                    <Button 
                      asChild
                      className="bg-[#3A86FF] hover:bg-[#2563EB] text-white"
                    >
                      <Link href="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#8338EC]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1E293B]">
                  <div className="p-2 bg-[#8338EC]/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-[#8338EC]" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrollments?.slice(0, 5).map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-[#3A86FF] rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium text-[#1E293B]">Enrolled in</span>{" "}
                          <Link 
                            href={`/courses/${enrollment.course?.id}`}
                            className="text-[#3A86FF] hover:text-[#2563EB] font-medium transition-colors"
                          >
                            {enrollment.course?.title}
                          </Link>
                        </p>
                        <p className="text-xs text-[#64748B]">
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
              <h2 className="text-2xl font-bold text-[#1E293B]">
                My Courses
              </h2>
              <Button 
                asChild
                className="bg-[#3A86FF] hover:bg-[#2563EB] text-white"
              >
                <Link href="/courses">Browse More Courses</Link>
              </Button>
            </div>

            {enrollmentsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse bg-white/80 backdrop-blur-sm">
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
                  <Card key={enrollment.id} className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 border-[#3A86FF]/10 hover:border-[#3A86FF]/20">
                    <div className="relative">
                      <Image
                        src={enrollment.course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop"}
                        alt={enrollment.course?.title || "Course thumbnail"}
                        width={300}
                        height={192}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge 
                        className="absolute top-4 right-4 shadow-lg"
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
                      <CardTitle className="text-lg line-clamp-2 text-[#1E293B]">
                        {enrollment.course?.title}
                      </CardTitle>
                      <p className="text-sm text-[#64748B]">
                        {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#64748B]">Progress</span>
                            <span className="font-medium text-[#1E293B]">{Math.round(Number(enrollment.progress) || 0)}%</span>
                          </div>
                          <Progress value={Number(enrollment.progress) || 0} className="h-2 bg-[#F1F5F9]" />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-[#64748B]">
                          <span>Enrolled: {formatDate(enrollment.enrolledAt)}</span>
                          {enrollment.course?.averageRating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-[#FFBE0B] text-[#FFBE0B]" />
                              <span className="font-medium text-[#1E293B]">{enrollment.course.averageRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <Button className="w-full bg-[#3A86FF] hover:bg-[#2563EB] text-white" asChild>
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
              <div className="text-center py-12 bg-white/50 rounded-xl border-2 border-[#8338EC]/10">
                <BookOpen className="h-16 w-16 text-[#8338EC]/50 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-[#1E293B] mb-2">
                  No courses enrolled
                </h3>
                <p className="text-[#64748B] mb-6">
                  Start learning by enrolling in your first course
                </p>
                <Button 
                  asChild
                  className="bg-[#3A86FF] hover:bg-[#2563EB] text-white"
                >
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center py-12 bg-white/50 rounded-xl border-2 border-[#FFBE0B]/10">
              <Award className="h-16 w-16 text-[#FFBE0B]/50 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-[#1E293B] mb-2">
                Achievements Coming Soon
              </h3>
              <p className="text-[#64748B]">
                Complete courses to unlock achievements and certificates
              </p>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#3A86FF]/10">
              <CardHeader>
                <CardTitle className="text-[#1E293B]">Learning Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {enrollments?.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#3A86FF]/10 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#3A86FF]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#1E293B]">
                          Enrolled in {enrollment.course?.title}
                        </p>
                        <p className="text-sm text-[#64748B]">
                          {formatDate(enrollment.enrolledAt)}
                        </p>
                        <div className="mt-2">
                          <Progress value={Number(enrollment.progress) || 0} className="h-2 bg-[#F1F5F9]" />
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
