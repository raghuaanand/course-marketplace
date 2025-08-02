"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, BookOpen, Users, Award, Star, Play, Brain, Target, 
  Rocket, Shield, ChevronRight, Quote, Zap, Globe, Code, Database,
  Palette, TrendingUp, MousePointer, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestUserLogin } from "@/components/TestUserLogin";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';
import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamically import Three.js components to avoid SSR issues
const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), { ssr: false });
const InstructorSphere = dynamic(() => import("@/components/InstructorSphere"), { ssr: false });

export default function HomePage() {
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Enhanced course data with modern meta information
  const featuredCourses = [
    {
      id: "1",
      title: "Advanced React Architecture",
      instructor: "Elena Rodriguez",
      price: 149.99,
      originalPrice: 299.99,
      rating: 4.9,
      students: 18450,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&crop=center",
      category: "Frontend",
      duration: "42h 15m",
      level: "Advanced",
      description: "Master enterprise-scale React patterns, performance optimization, and modern architecture",
      tags: ["React 18", "TypeScript", "Performance"],
      gradient: "#3A86FF"
    },
    {
      id: "2", 
      title: "AI-Powered Product Design",
      instructor: "Marcus Chen",
      price: 199.99,
      originalPrice: 399.99,
      rating: 4.8,
      students: 12890,
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=250&fit=crop&crop=center",
      category: "Design",
      duration: "38h 30m",
      level: "Intermediate",
      description: "Design intelligent interfaces using AI tools and human-centered methodologies",
      tags: ["Figma", "AI Tools", "UX Research"],
      gradient: "#8338EC"
    },
    {
      id: "3",
      title: "Full-Stack TypeScript Mastery",
      instructor: "Sarah Kim",
      price: 179.99,
      originalPrice: 359.99,
      rating: 4.9,
      students: 25670,
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop&crop=center",
      category: "Backend",
      duration: "56h 45m", 
      level: "Expert",
      description: "Build scalable applications with TypeScript, Node.js, and modern deployment strategies",
      tags: ["TypeScript", "Node.js", "Docker"],
      gradient: "#FFBE0B"
    },
    {
      id: "4",
      title: "Data Science with Python",
      instructor: "David Park",
      price: 129.99,
      originalPrice: 259.99,
      rating: 4.7,
      students: 31250,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center",
      category: "Data Science",
      duration: "48h 20m",
      level: "Beginner",
      description: "Transform raw data into actionable insights using Python and machine learning",
      tags: ["Python", "Pandas", "ML"],
      gradient: "#FFBE0B"
    },
    {
      id: "5",
      title: "DevOps & Cloud Automation",
      instructor: "Alex Johnson",
      price: 189.99,
      originalPrice: 379.99,
      rating: 4.8,
      students: 14380,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop&crop=center",
      category: "DevOps",
      duration: "44h 10m",
      level: "Advanced",
      description: "Automate deployments and manage cloud infrastructure at enterprise scale",
      tags: ["AWS", "Kubernetes", "Terraform"],
      gradient: "#3A86FF"
    },
    {
      id: "6",
      title: "Mobile-First UI Design",
      instructor: "Luna Martinez",
      price: 159.99,
      originalPrice: 319.99,
      rating: 4.9,
      students: 22190,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&crop=center",
      category: "Mobile",
      duration: "35h 55m",
      level: "Intermediate",
      description: "Create stunning mobile experiences with responsive design and native feel",
      tags: ["React Native", "Flutter", "Animation"],
      gradient: "#8338EC"
    }
  ];

  const stats = [
    { 
      icon: BookOpen, 
      label: "Expert Courses", 
      value: "2,500+", 
      color: "#3A86FF",
      description: "Cutting-edge curriculum"
    },
    { 
      icon: Users, 
      label: "Active Learners", 
      value: "850K+", 
      color: "#8338EC",
      description: "Global community"
    },
    { 
      icon: Award, 
      label: "Industry Experts", 
      value: "1,200+", 
      color: "#FFBE0B",
      description: "World-class instructors"
    },
    { 
      icon: Star, 
      label: "Average Rating", 
      value: "4.9/5", 
      color: "#3A86FF",
      description: "Exceptional quality"
    },
  ];

  const categories = [
    { 
      name: "Frontend Development", 
      count: 485, 
      color: "#3A86FF",
      icon: Code,
      description: "React, Vue, Angular & Modern JS"
    },
    { 
      name: "Backend & APIs", 
      count: 392, 
      color: "#FFBE0B",
      icon: Database,
      description: "Node.js, Python, Go & Microservices"
    },
    { 
      name: "UI/UX Design", 
      count: 278, 
      color: "#8338EC",
      icon: Palette,
      description: "Figma, Design Systems & User Research"
    },
    { 
      name: "Data Science", 
      count: 356, 
      color: "#FFBE0B",
      icon: TrendingUp,
      description: "Python, R, ML & Analytics"
    },
    { 
      name: "DevOps & Cloud", 
      count: 289, 
      color: "#3A86FF",
      icon: Globe,
      description: "AWS, Docker, Kubernetes & CI/CD"
    },
    { 
      name: "Mobile Development", 
      count: 234, 
      color: "#8338EC",
      icon: MousePointer,
      description: "React Native, Flutter & Swift"
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Enhanced Learning",
      description: "Personalized learning paths that adapt to your progress and learning style with cutting-edge AI technology",
      color: "#3A86FF",
      benefits: ["Smart recommendations", "Adaptive pacing", "Skill gap analysis"]
    },
    {
      icon: Target,
      title: "Project-Based Mastery",
      description: "Build real-world projects that showcase your skills and create an impressive portfolio for employers",
      color: "#FFBE0B",
      benefits: ["Portfolio projects", "Code reviews", "Industry standards"]
    },
    {
      icon: Rocket,
      title: "Career Acceleration",
      description: "Fast-track your professional growth with mentorship, job placement assistance, and industry connections",
      color: "#8338EC",
      benefits: ["1-on-1 mentoring", "Job placement", "Network access"]
    },
    {
      icon: Shield,
      title: "Lifetime Access",
      description: "Enjoy unlimited access to course materials, updates, and community support throughout your career journey",
      color: "#3A86FF",
      benefits: ["Forever access", "Free updates", "Community support"]
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Himanshu Verma",
      role: "Senior Software Engineer at Meta",
      content: "CourseHub's AI-powered learning paths helped me transition from junior to senior engineer in just 8 months. The personalized approach made all the difference.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      company: "Meta",
      achievement: "Promoted to Senior Engineer"
    },
    {
      id: 2,
      name: "Yash Raj",
      role: "Lead Product Designer at Spotify",
      content: "The project-based approach and mentorship program were game-changers. I built a portfolio that landed me my dream job at Spotify.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      company: "Spotify", 
      achievement: "Career transition success"
    },
    {
      id: 3,
      name: "Khushi Verma",
      role: "Data Scientist at Netflix",
      content: "From zero coding experience to data scientist in 10 months. The structured learning path and hands-on projects made complex concepts accessible.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      company: "Netflix",
      achievement: "Complete career pivot"
    }
  ];

  const instructorHighlights = [
    {
      name: "Dr. Sarah Kim",
      role: "Former Google ML Engineer",
      specialty: "Machine Learning & AI",
      students: 45000,
      courses: 12,
      rating: 4.9
    },
    {
      name: "Alex Chen",
      role: "Ex-Netflix Senior Engineer", 
      specialty: "Full-Stack Development",
      students: 62000,
      courses: 18,
      rating: 4.8
    },
    {
      name: "Maria Rodriguez",
      role: "Former Airbnb Design Lead",
      specialty: "Product Design & UX",
      students: 38000,
      courses: 9,
      rating: 4.9
    }
  ];

  // Scroll handlers and effects
  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || 0;
      setShowStickyBar(window.scrollY > heroHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Intersection Observer hook for animations
  const useIntersectionObserver = (threshold = 0.1) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting),
        { threshold }
      );

      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, [threshold]);

    return [ref, isVisible] as const;
  };

  return (
    <>
      <div className="flex flex-col overflow-hidden">
        {/* Modern Professional Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-[#F1F5F9] overflow-hidden">
          {/* Subtle WebGL Background */}
          <div className="absolute inset-0 opacity-30">
            <HeroCanvas />
          </div>
          
          {/* Clean Educational Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating educational icons with clean colors */}
            <motion.div
              className="absolute top-20 left-16 w-16 h-16 bg-[#3A86FF] rounded-lg opacity-15 flex items-center justify-center shadow-lg"
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div
              className="absolute top-32 right-20 w-12 h-12 bg-[#8338EC] rounded-full opacity-20 flex items-center justify-center shadow-md"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>

            <motion.div
              className="absolute bottom-32 left-12 w-14 h-14 bg-[#FFBE0B] rotate-45 opacity-25 flex items-center justify-center shadow-lg rounded-lg"
              animate={{
                y: [0, -15, 0],
                rotate: [45, 225, 405],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Target className="w-7 h-7 text-white -rotate-45" />
            </motion.div>

            <motion.div
              className="absolute bottom-20 right-16 w-10 h-10 bg-[#3A86FF] rounded-lg opacity-20 flex items-center justify-center shadow-md"
              animate={{
                x: [-5, 5, -5],
                y: [-5, 5, -5],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              {/* Professional Hero Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-sm rounded-full text-[#1E293B] text-xs md:text-sm font-medium mb-6 md:mb-8 shadow-lg border border-white/20 max-w-[90%] md:max-w-none">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2 text-[#3A86FF] flex-shrink-0" />
                  <span className="text-center leading-tight">Unlock Your Potential with Expert-Led Learning</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#1E293B] leading-tight mb-6 md:mb-8">
                  Master Skills That
                  <br />
                  <TypeAnimation
                    sequence={[
                      'Transform Careers',
                      2500,
                      'Build The Future',
                      2500,
                      'Create Impact',
                      2500,
                      'Drive Innovation',
                      2500,
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                    className="text-[#3A86FF]"
                  />
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#64748B] max-w-4xl mx-auto leading-relaxed mb-6 md:mb-8 px-4 sm:px-0">
                  Join <strong className="text-[#3A86FF]">850,000+</strong> learners mastering cutting-edge skills through 
                  <strong className="text-[#8338EC]"> expert-led courses</strong>, hands-on projects, and 
                  <strong className="text-[#FFBE0B]"> industry mentorship</strong> from professionals at top tech companies.
                </p>
              </motion.div>

              {/* Clean Professional CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 px-4 sm:px-0"
              >
                <Button 
                  size="lg" 
                  className="bg-[#3A86FF] hover:bg-[#2563EB] text-white px-8 md:px-12 py-3 md:py-4 text-lg md:text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                  asChild
                >
                  <Link href="/auth/register" className="flex items-center justify-center">
                    Start Learning Free
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-[#1E293B] text-[#1E293B] hover:bg-[#1E293B] hover:text-white px-8 md:px-12 py-3 md:py-4 text-lg md:text-xl rounded-xl transition-all duration-300 group"
                  asChild
                >
                  <Link href="/courses" className="flex items-center justify-center">
                    <Play className="mr-2 w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Link>
                </Button>
              </motion.div>

              {/* Test User Login - Development Helper */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex justify-center mb-8"
              >
                <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="text-xs text-[#64748B] font-medium">Quick Access:</div>
                    <TestUserLogin />
                  </div>
                </div>
              </motion.div>

              {/* Clean Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              >
                <div className="space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-[#3A86FF]">2.5K+</div>
                  <div className="text-sm text-[#64748B]">Expert Courses</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-[#8338EC]">850K+</div>
                  <div className="text-sm text-[#64748B]">Active Learners</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-[#FFBE0B]">1.2K+</div>
                  <div className="text-sm text-[#64748B]">Industry Experts</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-[#3A86FF]">4.9★</div>
                  <div className="text-sm text-[#64748B]">Average Rating</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-3"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-[#64748B] text-sm font-medium">Discover More</div>
            <div className="w-6 h-10 border-2 border-[#64748B] rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-[#3A86FF] rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Animated Stats Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div 
                    className="inline-flex p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: stat.color }}
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-[#1E293B] mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-6">
                Featured Courses
              </h2>
              <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
                Handpicked courses designed to accelerate your learning journey
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    rotateX: 5,
                    rotateY: 5,
                    scale: 1.03,
                  }}
                  className="group perspective-1000"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
                    <div className="relative overflow-hidden">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={400}
                        height={240}
                        className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge 
                          className="text-white border-0"
                          style={{ backgroundColor: categories.find(c => c.name.includes(course.category.split(' ')[0]))?.color || '#3A86FF' }}
                        >
                          {course.category}
                        </Badge>
                      </div>
                      <motion.div
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                        whileHover={{ opacity: 1 }}
                      >
                        <div className="text-center text-white p-6">
                          <div className="text-sm mb-2">Duration: {course.duration}</div>
                          <div className="text-sm mb-2">Level: {course.level}</div>
                          <div className="text-sm">{course.description}</div>
                          <Button size="sm" className="mt-4 bg-white text-black hover:bg-gray-100">
                            <Play className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-slate-600 mb-4">by {course.instructor}</p>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 font-medium">{course.rating}</span>
                          </div>
                          <span className="text-sm text-slate-500">
                            ({course.students.toLocaleString()})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-slate-900">${course.price}</span>
                          <span className="text-sm text-slate-500 line-through">
                            ${course.originalPrice}
                          </span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-[#3A86FF] hover:bg-[#2563EB] text-white rounded-lg" asChild>
                        <Link href={`/courses/${course.id}`}>Enroll Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-[#1E293B] text-white overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Explore Categories
              </h2>
              <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
                Dive deep into your passion with our curated learning paths
              </p>
            </motion.div>

            <div className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="flex-none w-80"
                >
                  <Link href={`/courses?category=${encodeURIComponent(category.name.toLowerCase())}`}>
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 h-64 relative overflow-hidden">
                      {/* Clean Background */}
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      
                      <CardContent className="p-8 relative z-10 h-full flex flex-col justify-between">
                        <div>
                          <div className="text-4xl mb-4">
                            <category.icon className="h-8 w-8" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-white">{category.name}</h3>
                          <p className="text-slate-300 mb-4">{category.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">{category.count} courses</span>
                          <ChevronRight className="h-5 w-5 text-white" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="py-20 bg-[#F1F5F9]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-6">
                Why Choose CourseHub?
              </h2>
              <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
                Experience next-generation learning with cutting-edge technology
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Card className="text-center p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                    <motion.div
                      className="inline-flex p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: feature.color }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructors Section */}
        <section className="py-20 bg-[#1E293B] text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                World-Class Instructors
              </h2>
              <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
                Learn from industry experts who've shaped the digital landscape
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <InstructorSphere />
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-6">
                Success Stories
              </h2>
              <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
                Join thousands who've transformed their careers through learning
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Card className="p-12 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <div className="flex justify-center mb-6">
                    <Quote className="h-12 w-12 text-slate-400" />
                  </div>
                  <blockquote className="text-2xl text-slate-700 mb-8 leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <Image
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{testimonials[currentTestimonial].name}</div>
                      <div className="text-slate-600">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Testimonial indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                        : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-[#3A86FF] text-white relative overflow-hidden">
          {/* Clean background elements */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Ready to Transform Your Future?
              </h2>
              <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
                Join millions of learners who've accelerated their careers with CourseHub. 
                Your journey to mastery starts with a single click.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-[#3A86FF] hover:bg-gray-100 px-12 py-4 text-xl rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link href="/register">Start Learning Today</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white text-[#3A86FF] hover:bg-gray-100 px-12 py-4 text-xl rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: showStickyBar ? 0 : 100, 
          opacity: showStickyBar ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-[#3A86FF] text-white p-4 shadow-2xl z-50"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <div className="font-bold text-lg">Ready to Start Learning?</div>
            <div className="text-sm opacity-90">Join 500,000+ students today</div>
          </div>
          <Button 
            className="bg-white text-[#3A86FF] hover:bg-gray-100 px-8 py-2 rounded-xl font-semibold"
            asChild
          >
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>
      </motion.div>
    </>
  );
}
