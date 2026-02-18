"use client";

import { useState, Suspense, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Star, Clock, Users, Play, BookOpen, ArrowRight, Grid3X3, List, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCourses } from "@/hooks/useCourses";
import { formatCurrency, formatDuration } from "@/utils/helpers";
import { motion, AnimatePresence, useInView } from "framer-motion";

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

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free" },
  { value: "0-50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100+", label: "$100+" },
];

function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      {children}
    </motion.div>
  );
}

function CoursesPageContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceFilter, setPriceFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filters = useMemo(() => ({
    search: search || undefined,
    category: category !== "All" ? category : undefined,
    sortBy,
    ...(priceFilter === "0-50" && { minPrice: 0, maxPrice: 50 }),
    ...(priceFilter === "50-100" && { minPrice: 50, maxPrice: 100 }),
    ...(priceFilter === "100+" && { minPrice: 100 }),
  }), [search, category, sortBy, priceFilter]);

  const { data: courses, isLoading, error } = useCourses(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setPriceFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters = search || category !== "All" || priceFilter !== "all" || sortBy !== "newest";

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute inset-0 bg-mesh opacity-40" />
        
        <div className="section-container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4 rounded-full">
              1000+ Courses Available
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
              Explore Courses
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover world-class courses taught by industry experts
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for courses, topics, or instructors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-14 pl-12 pr-4 text-base rounded-2xl bg-card border-border/50 shadow-apple focus:shadow-apple-md transition-shadow"
                />
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 py-4">
        <div className="section-container">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Category Pills (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {categories.slice(0, 6).map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "secondary"}
                  size="sm"
                  className={`rounded-full whitespace-nowrap ${
                    category === cat ? "" : "bg-muted/50 hover:bg-muted"
                  }`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-24 h-8 rounded-full bg-muted/50 border-0 text-sm">
                  <span>More</span>
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(6).map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile: Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden rounded-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </Button>

            {/* Right: Sort & View */}
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-9 rounded-full bg-muted/50 border-0">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-32 h-9 rounded-full bg-muted/50 border-0 hidden sm:flex">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="hidden sm:flex items-center border border-border/50 rounded-full p-0.5">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={category === cat ? "default" : "secondary"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => setCategory(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger className="flex-1 rounded-xl">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results */}
      <section className="section-container py-8 lg:py-12">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50">
                  <div className="aspect-[16/10] bg-muted animate-shimmer" />
                  <div className="p-6 space-y-4">
                    <div className="h-5 bg-muted rounded-lg w-3/4 animate-shimmer" />
                    <div className="h-4 bg-muted rounded-lg w-1/2 animate-shimmer" />
                    <div className="flex gap-4">
                      <div className="h-4 bg-muted rounded-lg w-1/4 animate-shimmer" />
                      <div className="h-4 bg-muted rounded-lg w-1/4 animate-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Failed to load courses</h3>
              <p className="text-muted-foreground mb-6">
                Something went wrong. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </motion.div>
          ) : courses && courses.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{courses.length}</span> courses found
                </p>
              </div>

              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {courses.map((course, index) => (
                  <AnimatedCard key={course.id} index={index}>
                    <Link href={`/courses/${course.id}`}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className={`group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-apple hover:shadow-apple-lg transition-all duration-300 ${
                          viewMode === 'list' ? 'flex' : ''
                        }`}
                      >
                        <div className={`relative ${viewMode === 'list' ? 'w-64 shrink-0' : ''}`}>
                          <div className={`${viewMode === 'list' ? 'aspect-square' : 'aspect-[16/10]'} overflow-hidden`}>
                            <Image
                              src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"}
                              alt={course.title}
                              width={600}
                              height={400}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0 text-xs">
                              {course.category?.name}
                            </Badge>
                            {Number(course.price) === 0 && (
                              <Badge className="bg-emerald-500 text-white border-0 text-xs">
                                Free
                              </Badge>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="h-5 w-5 text-foreground ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <div className="p-5 flex-1">
                          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            by {course.instructor?.firstName} {course.instructor?.lastName}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="font-medium text-foreground">
                                {course.averageRating?.toFixed(1) || "0.0"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{course._count?.enrollments || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDuration(course.duration || 0)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              {Number(course.price) === 0 ? (
                                <span className="text-xl font-semibold text-primary">Free</span>
                              ) : (
                                <>
                                  <span className="text-xl font-semibold">
                                    {formatCurrency(Number(course.discountPrice || course.price))}
                                  </span>
                                  {course.discountPrice && Number(course.discountPrice) < Number(course.price) && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {formatCurrency(Number(course.price))}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            <Button size="sm" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              View
                              <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </AnimatedCard>
                ))}
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    }>
      <CoursesPageContent />
    </Suspense>
  );
}
