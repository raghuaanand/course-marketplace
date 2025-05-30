"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, Star, Clock, Users, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCourses } from "@/hooks/useCourses";
import { formatCurrency, formatDuration } from "@/utils/helpers";

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

  const { data: courses, isLoading, error } = useCourses({
    search: search || undefined,
    category: category !== "All" ? category : undefined,
    sortBy,
    // Convert priceFilter to minPrice/maxPrice
    ...(priceFilter === "0-50" && { minPrice: 0, maxPrice: 50 }),
    ...(priceFilter === "50-100" && { minPrice: 50, maxPrice: 100 }),
    ...(priceFilter === "100+" && { minPrice: 100 }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // This would trigger a refetch with the new search params
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover your next learning adventure
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price
              </label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
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

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Failed to load courses. Please try again later.
            </p>
          </div>
        ) : courses && courses.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                {courses.length} courses found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <Image
                      src={course.thumbnail || "/api/placeholder/300/200"}
                      alt={course.title}
                      width={300}
                      height={192}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-t-lg">
                      <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <Badge className="absolute top-4 left-4">
                      {course.category?.name}
                    </Badge>
                    {course.price === 0 && (
                      <Badge variant="secondary" className="absolute top-4 right-4">
                        Free
                      </Badge>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">
                          {course.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course._count?.enrollments || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDuration(course.duration || 0)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {course.price === 0 ? (
                          <span className="text-2xl font-bold text-green-600">Free</span>
                        ) : (
                          <>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(course.discountPrice || course.price)}
                            </span>
                            {course.discountPrice && course.discountPrice < course.price && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(course.price)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href={`/courses/${course.id}`}>
                        View Course
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No courses found matching your criteria.
            </p>
            <Button variant="outline" onClick={() => {
              setSearch("");
              setCategory("All");
              setPriceFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading courses...</div>}>
      <CoursesPageContent />
    </Suspense>
  );
}
