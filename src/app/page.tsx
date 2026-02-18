"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, Award, Star, Play, CheckCircle, Sparkles, Quote, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function HomePage() {
    const heroRef = useRef<HTMLElement>(null);
    const [mounted, setMounted] = useState(false);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const featuredCourses = [
        {
            id: "1",
            title: "Complete React Masterclass",
            instructor: "Sarah Chen",
            price: 149,
            originalPrice: 299,
            rating: 4.9,
            students: 18450,
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
            category: "Development",
            duration: "42 hours",
        },
        {
            id: "2",
            title: "UI/UX Design Fundamentals",
            instructor: "Marcus Johnson",
            price: 129,
            originalPrice: 249,
            rating: 4.8,
            students: 12890,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
            category: "Design",
            duration: "36 hours",
        },
        {
            id: "3",
            title: "Python for Data Science",
            instructor: "Emily Rodriguez",
            price: 179,
            originalPrice: 349,
            rating: 4.9,
            students: 25670,
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
            category: "Data Science",
            duration: "56 hours",
        },
    ];

    const stats = [
        { value: "50K+", label: "Active Students", sublabel: "Learning worldwide" },
        { value: "500+", label: "Expert Instructors", sublabel: "Industry leaders" },
        { value: "1000+", label: "Premium Courses", sublabel: "Updated weekly" },
        { value: "4.9", label: "Average Rating", sublabel: "From 100K+ reviews" },
    ];

    const features = [
        {
            title: "Learn at Your Pace",
            description: "Access courses anytime, anywhere. Learn on your schedule with lifetime access to all purchased content.",
        },
        {
            title: "Expert Instructors",
            description: "Learn from industry professionals with real-world experience at top tech companies.",
        },
        {
            title: "Hands-on Projects",
            description: "Build a portfolio with practical projects that showcase your skills to employers.",
        },
        {
            title: "Certificate of Completion",
            description: "Earn recognized certificates to share on LinkedIn and boost your career.",
        },
    ];

    const testimonials = [
        {
            name: "Priya Sharma",
            role: "Software Engineer at Google",
            content: "CourseHub transformed my career. The React course helped me land my dream job at Google within 6 months.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        },
        {
            name: "Arjun Patel",
            role: "Product Designer at Figma",
            content: "The design courses are exceptional. I learned more in 3 months than I did in my entire college education.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        },
        {
            name: "Neha Gupta",
            role: "Data Scientist at Microsoft",
            content: "The Python and ML courses are incredibly well-structured. Now I'm leading data science projects at Microsoft.",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        },
    ];

    const categories = [
        { name: "Development", courses: 485, color: "bg-blue-500/10 text-blue-600" },
        { name: "Design", courses: 278, color: "bg-purple-500/10 text-purple-600" },
        { name: "Data Science", courses: 356, color: "bg-emerald-500/10 text-emerald-600" },
        { name: "Business", courses: 234, color: "bg-amber-500/10 text-amber-600" },
        { name: "Marketing", courses: 189, color: "bg-rose-500/10 text-rose-600" },
        { name: "Photography", courses: 145, color: "bg-cyan-500/10 text-cyan-600" },
    ];

    const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true, margin: "-100px" });
        
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={className}
            >
                {children}
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section 
                ref={heroRef}
                className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle"
            >
                {/* Background Elements */}
                <div className="absolute inset-0 bg-mesh opacity-60" />
                <div className="absolute inset-0 bg-dot-pattern opacity-30" />
                
                {/* Floating Gradient Orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div 
                    style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                    className="relative z-10 section-container pt-32 pb-20"
                >
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary border-0 mb-8">
                                <Sparkles className="w-3.5 h-3.5 mr-2" />
                                Over 50,000 students learning
                            </Badge>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-balance mb-6"
                        >
                            Learn skills that
                            <br />
                            <span className="text-gradient">shape your future</span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance"
                        >
                            Master in-demand skills with expert-led courses. Transform your career with 
                            hands-on projects and industry-recognized certifications.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button 
                                size="lg" 
                                className="h-12 px-8 text-base rounded-full shadow-apple-md hover:shadow-apple-lg transition-all"
                                asChild
                            >
                                <Link href="/courses">
                                    Explore Courses
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="h-12 px-8 text-base rounded-full"
                                asChild
                            >
                                <Link href="/about">
                                    <Play className="mr-2 h-4 w-4" />
                                    Watch Demo
                                </Link>
                            </Button>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background overflow-hidden">
                                            <Image
                                                src={`https://images.unsplash.com/photo-${1500000000000 + i * 100}?w=50&h=50&fit=crop`}
                                                alt=""
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <span>Trusted by 50K+ learners</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="font-medium text-foreground">4.9</span>
                                <span>average rating</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div 
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
                    >
                        <motion.div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-muted/30 border-y border-border/50">
                <div className="section-container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {stats.map((stat, index) => (
                            <AnimatedSection key={index}>
                                <div className="text-center">
                                    <div className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-medium text-foreground mb-1">
                                        {stat.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {stat.sublabel}
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="section-spacing">
                <div className="section-container">
                    <AnimatedSection className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4 rounded-full">
                            Popular Courses
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
                            Start learning today
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Explore our most popular courses, handpicked by our team of experts.
                        </p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {featuredCourses.map((course, index) => (
                            <AnimatedSection key={course.id}>
                                <Link href={`/courses/${course.id}`}>
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        transition={{ duration: 0.2 }}
                                        className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-apple hover:shadow-apple-lg transition-all duration-300"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <Image
                                                src={course.image}
                                                alt={course.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0">
                                                    {course.category}
                                                </Badge>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                by {course.instructor}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <span className="font-medium text-foreground">{course.rating}</span>
                                                </div>
                                                <span>•</span>
                                                <span>{course.students.toLocaleString()} students</span>
                                                <span>•</span>
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-semibold">${course.price}</span>
                                                <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection className="text-center mt-12">
                        <Button variant="outline" size="lg" className="rounded-full" asChild>
                            <Link href="/courses">
                                View All Courses
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </AnimatedSection>
                </div>
            </section>

            {/* Categories */}
            <section className="section-spacing bg-muted/30">
                <div className="section-container">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
                            Explore by category
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Find the perfect course for your goals
                        </p>
                    </AnimatedSection>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category, index) => (
                            <AnimatedSection key={category.name}>
                                <Link href={`/courses?category=${category.name.toLowerCase()}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="p-6 bg-card rounded-2xl border border-border/50 text-center hover:shadow-apple transition-all cursor-pointer group"
                                    >
                                        <div className={`inline-flex w-12 h-12 items-center justify-center rounded-xl ${category.color} mb-4`}>
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {category.courses} courses
                                        </p>
                                    </motion.div>
                                </Link>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section-spacing">
                <div className="section-container">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <AnimatedSection>
                            <Badge variant="secondary" className="mb-4 rounded-full">
                                Why Choose Us
                            </Badge>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
                                Everything you need to succeed
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Our platform is designed to help you achieve your learning goals with 
                                structured courses, expert support, and a thriving community.
                            </p>
                            <div className="space-y-6">
                                {features.map((feature, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className="flex gap-4"
                                    >
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                            <CheckCircle className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">{feature.title}</h3>
                                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatedSection>

                        <AnimatedSection>
                            <div className="relative">
                                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-primary/20 p-8 lg:p-12">
                                    <div className="h-full w-full rounded-2xl bg-card shadow-apple-xl flex items-center justify-center">
                                        <div className="text-center p-8">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                                <Award className="w-8 h-8 text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-semibold mb-2">Certificate Ready</h3>
                                            <p className="text-muted-foreground">
                                                Earn certificates recognized by top employers worldwide
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Elements */}
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 -right-4 p-4 bg-card rounded-2xl shadow-apple-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">50K+</div>
                                            <div className="text-xs text-muted-foreground">Active Learners</div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [10, -10, 10] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-4 -left-4 p-4 bg-card rounded-2xl shadow-apple-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                            <Star className="w-5 h-5 text-amber-600 fill-amber-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">4.9 Rating</div>
                                            <div className="text-xs text-muted-foreground">100K+ Reviews</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-spacing bg-muted/30">
                <div className="section-container">
                    <AnimatedSection className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4 rounded-full">
                            Success Stories
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
                            Loved by learners worldwide
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of students who have transformed their careers with CourseHub.
                        </p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <AnimatedSection key={index}>
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    className="h-full p-6 lg:p-8 bg-card rounded-2xl border border-border/50 shadow-apple"
                                >
                                    <Quote className="w-8 h-8 text-primary/20 mb-4" />
                                    <p className="text-foreground mb-6 leading-relaxed">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <div className="font-medium">{testimonial.name}</div>
                                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-spacing">
                <div className="section-container">
                    <AnimatedSection>
                        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 lg:p-16 text-center">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,white_0%,transparent_50%)]" />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-primary-foreground mb-4">
                                    Start your learning journey today
                                </h2>
                                <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                                    Join over 50,000 learners and unlock your potential with world-class courses.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button 
                                        size="lg" 
                                        variant="secondary"
                                        className="h-12 px-8 text-base rounded-full shadow-lg"
                                        asChild
                                    >
                                        <Link href="/auth/register">
                                            Get Started Free
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button 
                                        size="lg" 
                                        variant="outline"
                                        className="h-12 px-8 text-base rounded-full bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                                        asChild
                                    >
                                        <Link href="/courses">
                                            Browse Courses
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
