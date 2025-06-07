"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  BookOpen, 
  Users, 
  TrendingUp,
  Grid,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courseService } from "@/services/course";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  type Category = {
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    slug: string;
    _count?: {
      courses?: number;
    };
  };

  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => courseService.getCategories(),
  });

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Categories
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Unable to load categories. Please try again later.
            </p>
            <Button asChild>
              <Link href="/courses">Browse All Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Explore Course Categories
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover thousands of courses across diverse topics and skill levels
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 py-3 text-lg bg-white dark:bg-gray-800 border-0 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              All Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredCategories.length} categories found
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories Grid/List */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search terms or browse all courses
            </p>
            <Button asChild>
              <Link href="/courses">Browse All Courses</Link>
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/courses?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  {viewMode === "grid" ? (
                    // Grid View
                    <>
                      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-white" />
                        </div>
                        <Badge className="absolute top-4 right-4 bg-white text-gray-900">
                          {category._count?.courses || 0} courses
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {category.description || `Explore courses in ${category.name.toLowerCase()}`}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{category._count?.courses || 0} courses</span>
                          </div>
                          <TrendingUp className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    // List View
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {category.description || `Explore courses in ${category.name.toLowerCase()}`}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{category._count?.courses || 0} courses available</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Badge variant="secondary">
                            {category._count?.courses || 0}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning with our expert instructors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/courses">Browse All Courses</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/register">Sign Up for Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
