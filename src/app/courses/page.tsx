"use client";

import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, Star, Clock, Users, Play, BookOpen, TrendingUp, Sparkles, ArrowRight, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCourses } from "@/hooks/useCourses";
import { formatCurrency, formatDuration } from "@/utils/helpers";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "All",
  "Development", 
  "Business",
  "Design",
  "Marketing",
  "Photography", 
  "Music",
  "Health & Fitness",
  "Language",
  "Lifestyle",
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

function CoursesPageContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceFilter, setPriceFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filters = useMemo(() => ({
    search: search || undefined,
    category: category !== "All" ? category : undefined,
    sortBy,
    // Convert priceFilter to minPrice/maxPrice
    ...(priceFilter === "0-50" && { minPrice: 0, maxPrice: 50 }),
    ...(priceFilter === "50-100" && { minPrice: 50, maxPrice: 100 }),
    ...(priceFilter === "100+" && { minPrice: 100 }),
  }), [search, category, sortBy, priceFilter]);

  const { data: courses, isLoading, error } = useCourses(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // This would trigger a refetch with the new search params
  };

  const clearAllFilters = () => {
    setSearch("");
    setCategory("All");
    setPriceFilter("all");
    setSortBy("newest");
  };

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-[#3A86FF]/20 backdrop-blur-sm rounded-full border border-[#3A86FF]/30 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-[#FFBE0B] mr-2" />
              <span className="text-sm font-medium text-white/90">Discover Your Next Adventure</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Explore{" "}
              <span className="text-[#3A86FF] relative">
                Courses
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#FFBE0B] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </h1>
            <p className="text-xl text-[#94A3B8] max-w-3xl mx-auto leading-relaxed">
              Transform your skills with expert-led courses designed for real-world success
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modern Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#64748B] h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for courses, topics, or instructors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 py-6 text-lg border-2 border-[#E2E8F0] focus:border-[#3A86FF] transition-colors"
              />
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-2 border-[#E2E8F0] focus:border-[#3A86FF]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-2 border-[#E2E8F0] focus:border-[#3A86FF]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Price Range
              </label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="border-2 border-[#E2E8F0] focus:border-[#3A86FF]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="0-50">$0 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100+">$100+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                View Mode
              </label>
              <div className="flex border-2 border-[#E2E8F0] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 p-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-[#3A86FF] text-white' 
                      : 'bg-white text-[#64748B] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <Grid className="h-4 w-4 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex-1 p-2 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[#3A86FF] text-white' 
                      : 'bg-white text-[#64748B] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <List className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full border-2 border-[#E2E8F0] hover:border-[#3A86FF] hover:text-[#3A86FF] transition-colors"
                onClick={clearAllFilters}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse border-0 shadow-lg">
                  <div className="h-48 bg-[#E2E8F0] rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-[#E2E8F0] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#E2E8F0] rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-[#E2E8F0] rounded w-1/4"></div>
                      <div className="h-4 bg-[#E2E8F0] rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div 
              className="text-center py-12 bg-white rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BookOpen className="h-16 w-16 text-[#E2E8F0] mx-auto mb-4" />
              <p className="text-[#64748B] text-lg">
                Failed to load courses. Please try again later.
              </p>
              <Button 
                className="mt-4 bg-[#3A86FF] hover:bg-[#2563EB] text-white"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </motion.div>
          ) : courses && courses.length > 0 ? (
            <>
              <motion.div 
                className="flex justify-between items-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-[#64748B] font-medium">
                  <span className="text-[#1E293B] font-bold">{courses.length}</span> courses found
                </p>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <TrendingUp className="h-4 w-4" />
                  <span>Updated daily</span>
                </div>
              </motion.div>

              <motion.div 
                className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-white ${viewMode === 'list' ? 'flex' : ''}`}>
                      <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                        <Image
                          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop"}
                          alt={course.title}
                          width={300}
                          height={192}
                          className={`object-cover ${viewMode === 'list' ? 'w-full h-48' : 'w-full h-48'} rounded-t-lg ${viewMode === 'list' ? 'rounded-l-lg rounded-t-none' : ''}`}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-t-lg">
                          <motion.div
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.div>
                        </div>
                        <Badge className="absolute top-4 left-4 bg-[#3A86FF] text-white border-0">
                          {course.category?.name}
                        </Badge>
                        {Number(course.price) === 0 && (
                          <Badge className="absolute top-4 right-4 bg-[#FFBE0B] text-[#1E293B] border-0">
                            Free
                          </Badge>
                        )}
                      </div>

                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-[#3A86FF] transition-colors font-bold text-[#1E293B]">
                            {course.title}
                          </CardTitle>
                          <p className="text-sm text-[#64748B] font-medium">
                            by {course.instructor?.firstName} {course.instructor?.lastName}
                          </p>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-sm text-[#64748B] line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-[#64748B]">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-[#FFBE0B] text-[#FFBE0B] mr-1" />
                              <span className="font-medium text-[#1E293B]">
                                {course.averageRating?.toFixed(1) || "0.0"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{course._count?.enrollments || 0} students</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{formatDuration(course.duration || 0)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {Number(course.price) === 0 ? (
                                <span className="text-2xl font-bold text-[#3A86FF]">Free</span>
                              ) : (
                                <>
                                  <span className="text-2xl font-bold text-[#1E293B]">
                                    {formatCurrency(Number(course.discountPrice || course.price))}
                                  </span>
                                  {course.discountPrice && Number(course.discountPrice) < Number(course.price) && (
                                    <span className="text-sm text-[#64748B] line-through">
                                      {formatCurrency(Number(course.price))}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <Button 
                            className="w-full bg-[#3A86FF] hover:bg-[#2563EB] text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                            asChild
                          >
                            <Link href={`/courses/${course.id}`}>
                              View Course
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="text-center py-12 bg-white rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BookOpen className="h-16 w-16 text-[#E2E8F0] mx-auto mb-4" />
              <p className="text-[#64748B] mb-4 text-lg">
                No courses found matching your criteria.
              </p>
              <Button 
                variant="outline" 
                className="border-2 border-[#3A86FF] text-[#3A86FF] hover:bg-[#3A86FF] hover:text-white transition-colors"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#3A86FF] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-[#64748B] font-medium">Loading courses...</p>
        </div>
      </div>
    }>
      <CoursesPageContent />
    </Suspense>
  );
}
