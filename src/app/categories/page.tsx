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
import { motion } from "framer-motion";

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

  const filteredCategories = (categories && Array.isArray(categories) ? categories : []).filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A86FF] mx-auto"></div>
            <p className="mt-4 text-[#64748B]">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F1F5F9]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1E293B] mb-4">
              Error Loading Categories
            </h1>
            <p className="text-[#64748B] mb-6">
              Unable to load categories. Please try again later.
            </p>
            <Button 
              asChild
              className="bg-[#3A86FF] hover:bg-[#2563EB] text-white"
            >
              <Link href="/courses">Browse All Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pt-20">
      {/* Modern Hero Section */}
      <section className="bg-[#1E293B] text-white py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-[#3A86FF] rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-16 h-16 bg-[#FFBE0B] rounded-full"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.8, 0.5, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 right-1/4 w-12 h-12 bg-[#8338EC] rounded-full"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-8"
            >
              <Grid className="w-4 h-4 text-[#FFBE0B] mr-2" />
              <span className="text-sm font-medium">Course Categories</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore Course Categories
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/80 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover thousands of courses across diverse topics and skill levels
            </motion.p>
            
            {/* Search */}
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#64748B] h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-4 py-4 w-full bg-white/95 backdrop-blur-sm border-white/20 text-[#1E293B] placeholder:text-[#64748B] rounded-xl shadow-lg focus:ring-2 focus:ring-[#3A86FF] focus:border-transparent transition-all duration-300"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#1E293B] mb-2">
              All Categories
            </h2>
            <p className="text-[#64748B]">
              {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} available
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-[#3A86FF] hover:bg-[#2563EB]" : "border-[#3A86FF] text-[#3A86FF] hover:bg-[#3A86FF] hover:text-white"}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-[#3A86FF] hover:bg-[#2563EB]" : "border-[#3A86FF] text-[#3A86FF] hover:bg-[#3A86FF] hover:text-white"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories Grid/List */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-[#8338EC]/50 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-[#1E293B] mb-2">
              No categories found
            </h3>
            <p className="text-[#64748B] mb-6">
              Try adjusting your search terms or browse all courses
            </p>
            <Button 
              asChild
              className="bg-[#3A86FF] hover:bg-[#2563EB] text-white"
            >
              <Link href="/courses">Browse All Courses</Link>
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[#3A86FF]/10 border-2 hover:border-[#3A86FF]/20 bg-white/80 backdrop-blur-sm ${
                  viewMode === "list" ? "flex flex-row items-center" : ""
                }`}>
                  <Link href={`/courses?category=${category.slug}`}>
                    <CardHeader className={viewMode === "list" ? "flex-1" : ""}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant="secondary" 
                          className="bg-[#3A86FF]/10 text-[#3A86FF] hover:bg-[#3A86FF]/20 transition-colors duration-300"
                        >
                          {category._count?.courses || 0} courses
                        </Badge>
                        <TrendingUp className="h-4 w-4 text-[#FFBE0B] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-[#1E293B] group-hover:text-[#3A86FF] transition-colors duration-300">
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={viewMode === "list" ? "flex-1" : ""}>
                      <p className="text-[#64748B] text-sm mb-4 line-clamp-2">
                        {category.description || `Explore courses in ${category.name}`}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-[#64748B]">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{category._count?.courses || 0} courses</span>
                        </div>
                        <div className="text-[#3A86FF] group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-[#1E293B] mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-[#64748B] mb-8 max-w-2xl mx-auto">
              Browse all our courses or suggest a new category. We're always expanding our offerings based on student feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg"
                className="bg-[#3A86FF] hover:bg-[#2563EB] text-white px-8 py-3 hover:scale-105 transition-all duration-300"
              >
                <Link href="/courses">Browse All Courses</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-[#8338EC] text-[#8338EC] hover:bg-[#8338EC] hover:text-white px-8 py-3 transition-all duration-300"
              >
                Suggest a Category
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
