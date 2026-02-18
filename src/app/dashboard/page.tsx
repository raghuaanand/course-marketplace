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
  Star,
  ArrowRight,
  Target,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { enrollmentService } from "@/services/enrollment";
import { formatDate, formatDuration } from "@/utils/helpers";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["user-enrollments"],
    queryFn: () => enrollmentService.getEnrollments(),
    enabled: !!user,
  });

  const enrollments = enrollmentsData?.enrollments || [];

  const stats = {
    totalCourses: enrollments?.length || 0,
    completedCourses: enrollments?.filter(e => e.status === 'COMPLETED')?.length || 0,
    inProgressCourses: enrollments?.filter(e => e.status === 'ACTIVE')?.length || 0,
    totalStudyTime: 0,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Sign in to continue</h1>
          <p className="text-muted-foreground mb-6">
            Access your dashboard to track progress and continue learning
          </p>
          <Button asChild className="rounded-full px-8">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const statCards = [
    { label: "Enrolled Courses", value: stats.totalCourses, icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
    { label: "Completed", value: stats.completedCourses, icon: Award, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "In Progress", value: stats.inProgressCourses, icon: TrendingUp, color: "bg-amber-500/10 text-amber-600" },
    { label: "Study Time", value: formatDuration(stats.totalStudyTime), icon: Clock, color: "bg-purple-500/10 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="section-container py-8 lg:py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Welcome back, {user.firstName || user.email?.split('@')[0]}
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey where you left off
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className="bg-card rounded-2xl border border-border/50 p-6 shadow-apple"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-semibold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1 mb-8">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="courses" className="rounded-lg">My Courses</TabsTrigger>
            <TabsTrigger value="achievements" className="rounded-lg">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Continue Learning */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border/50 shadow-apple overflow-hidden"
            >
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Continue Learning</h2>
                    <p className="text-sm text-muted-foreground">Pick up where you left off</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {enrollmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-muted animate-shimmer shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-muted rounded-lg w-3/4 animate-shimmer" />
                          <div className="h-4 bg-muted rounded-lg w-1/2 animate-shimmer" />
                          <div className="h-2 bg-muted rounded-full w-full animate-shimmer" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : enrollments.filter(e => e.status === 'ACTIVE').length > 0 ? (
                  <div className="space-y-4">
                    {enrollments
                      .filter(enrollment => enrollment.status === 'ACTIVE')
                      .slice(0, 3)
                      .map((enrollment) => (
                        <div key={enrollment.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                          <Image
                            src={enrollment.course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop"}
                            alt={enrollment.course?.title || ""}
                            width={80}
                            height={80}
                            className="rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate mb-1">
                              {enrollment.course?.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                            </p>
                            <div className="flex items-center gap-3">
                              <Progress value={Number(enrollment.progress) || 0} className="flex-1 h-2" />
                              <span className="text-sm font-medium text-muted-foreground">
                                {Math.round(Number(enrollment.progress) || 0)}%
                              </span>
                            </div>
                          </div>
                          <Button size="sm" className="rounded-full shrink-0" asChild>
                            <Link href={`/learn/${enrollment.course?.id}`}>
                              Continue
                              <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">No courses in progress</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start a new course to begin your learning journey
                    </p>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border/50 shadow-apple overflow-hidden"
            >
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Recent Activity</h2>
                    <p className="text-sm text-muted-foreground">Your learning history</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.slice(0, 5).map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Enrolled in </span>
                            <Link href={`/courses/${enrollment.course?.id}`} className="font-medium hover:text-primary transition-colors">
                              {enrollment.course?.title}
                            </Link>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(enrollment.enrolledAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No activity yet
                  </p>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/courses">Browse More</Link>
              </Button>
            </div>

            {enrollmentsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                    <div className="aspect-video bg-muted animate-shimmer" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-muted rounded-lg w-3/4 animate-shimmer" />
                      <div className="h-4 bg-muted rounded-lg w-1/2 animate-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : enrollments.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment, index) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/learn/${enrollment.course?.id}`}>
                      <div className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-apple hover:shadow-apple-lg transition-all">
                        <div className="relative aspect-video">
                          <Image
                            src={enrollment.course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop"}
                            alt={enrollment.course?.title || ""}
                            fill
                            className="object-cover"
                          />
                          <Badge 
                            className="absolute top-3 right-3"
                            variant={enrollment.status === 'COMPLETED' ? 'default' : 'secondary'}
                          >
                            {enrollment.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                          </Badge>
                        </div>
                        <div className="p-5">
                          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors mb-1">
                            {enrollment.course?.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                          </p>
                          <div className="flex items-center gap-3">
                            <Progress value={Number(enrollment.progress) || 0} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{Math.round(Number(enrollment.progress) || 0)}%</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start your learning journey by enrolling in a course
                </p>
                <Button asChild className="rounded-full">
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements">
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Achievements Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Complete courses to unlock achievements, earn certificates, and track your learning milestones.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
