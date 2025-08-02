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
        return 'bg-[#FFBE0B]/10 text-[#FFBE0B] border-[#FFBE0B]/20';
      case 'ACTIVE':
        return 'bg-[#3A86FF]/10 text-[#3A86FF] border-[#3A86FF]/20';
      case 'CANCELLED':
        return 'bg-red-100 text-red-600 border-red-200';
      default:
        return 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center pt-20">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg border border-[#3A86FF]/10 max-w-md mx-4">
          <BookOpen className="h-16 w-16 text-[#8338EC]/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
            Sign in to view your courses
          </h2>
          <p className="text-[#64748B] mb-6">
            Access your enrolled courses and track your learning progress
          </p>
          <Button 
            asChild
            className="bg-[#3A86FF] hover:bg-[#2563EB] text-white px-8 py-3"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A86FF] mx-auto"></div>
            <p className="mt-4 text-[#64748B]">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#3A86FF]/20 shadow-lg mb-4">
              <BookOpen className="w-4 h-4 text-[#3A86FF] mr-2" />
              <span className="text-sm font-medium text-[#1E293B]">My Learning Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
              My Courses
            </h1>
            <p className="text-[#64748B]">
              Continue your learning journey
            </p>
          </div>
          <Button 
            asChild
            className="bg-[#8338EC] hover:bg-[#7C3AED] text-white px-6 py-3 hover:scale-105 transition-all duration-300"
          >
            <Link href="/courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse More Courses
            </Link>
          </Button>
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
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#FFBE0B]/10 hover:border-[#FFBE0B]/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-[#FFBE0B]/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-[#FFBE0B]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#64748B]">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-[#1E293B]">
                    {stats.completed}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#8338EC]/10 hover:border-[#8338EC]/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-[#8338EC]/10 rounded-lg">
                  <Play className="h-6 w-6 text-[#8338EC]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#64748B]">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-[#1E293B]">
                    {stats.active}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#3A86FF]/10 hover:border-[#3A86FF]/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-[#3A86FF]/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-[#3A86FF]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#64748B]">
                    Avg Progress
                  </p>
                  <p className="text-2xl font-bold text-[#1E293B]">
                    {Math.round(stats.avgProgress)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm border-2 border-[#3A86FF]/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] h-4 w-4" />
                  <Input
                    placeholder="Search your courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 border-[#3A86FF]/20 focus:ring-[#3A86FF] focus:border-[#3A86FF]"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 border-[#3A86FF]/20 focus:ring-[#3A86FF] focus:border-[#3A86FF]">
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
                        src={enrollment.course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop"}
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
