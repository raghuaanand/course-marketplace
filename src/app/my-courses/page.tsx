"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { 
  BookOpen, 
  Clock, 
  Play, 
  CheckCircle, 
  Search,
  Filter,
  Star,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import { enrollmentService } from "@/services/enrollment";
import { formatDuration } from "@/utils/helpers";

export default function MyCoursesPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data: enrollmentsData, isLoading } = useQuery({
    queryKey: ["user-enrollments"],
    queryFn: () => enrollmentService.getEnrollments(),
    enabled: !!user,
  });

  const enrollments = enrollmentsData?.enrollments || [];

  // Filter enrollments based on tab and filters
  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = !search || 
      enrollment.course?.title.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.course?.instructor?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.course?.instructor?.lastName?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter;

    const matchesTab = activeTab === "all" || 
      (activeTab === "in-progress" && enrollment.status === "ACTIVE") ||
      (activeTab === "completed" && enrollment.status === "COMPLETED");

    return matchesSearch && matchesStatus && matchesTab;
  });

  // Calculate stats
  const stats = {
    total: enrollments.length,
    active: enrollments.filter(e => e.status === 'ACTIVE').length,
    completed: enrollments.filter(e => e.status === 'COMPLETED').length,
    avgProgress: enrollments.length > 0 
      ? enrollments.reduce((sum, e) => sum + (Number(e.progress) || 0), 0) / enrollments.length 
      : 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sign in to view your courses
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Access your enrolled courses and track your learning progress
          </p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Continue your learning journey
            </p>
          </div>
          <Button asChild>
            <Link href="/courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse More Courses
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.completed}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Play className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.active}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(stats.avgProgress)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search your courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Courses ({stats.total})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({stats.active})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredEnrollments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  {search || statusFilter !== "all" ? "No courses found" : "No courses enrolled"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {search || statusFilter !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Start learning by enrolling in your first course"
                  }
                </p>
                <Button asChild>
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEnrollments.map((enrollment) => (
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
                        className={`absolute top-4 right-4 ${getStatusColor(enrollment.status)}`}
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
                            <span>{Math.round(Number(enrollment.progress) || 0)}%</span>
                          </div>
                          <Progress value={Number(enrollment.progress) || 0} />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                          </div>
                          {enrollment.course?.averageRating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{enrollment.course.averageRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <Button className="w-full" asChild>
                          <Link href={`/learn/${enrollment.course?.id}`}>
                            {enrollment.status === 'COMPLETED' ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Review Course
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Continue Learning
                              </>
                            )}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
