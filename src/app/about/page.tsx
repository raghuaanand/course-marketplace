"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Users, 
  BookOpen, 
  Award, 
  Star,
  Target,
  Heart,
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutPage() {
  const stats = [
    { value: "50K+", label: "Active Students", sublabel: "Learning worldwide" },
    { value: "500+", label: "Expert Instructors", sublabel: "Industry leaders" },
    { value: "1000+", label: "Premium Courses", sublabel: "Curated content" },
    { value: "98%", label: "Satisfaction Rate", sublabel: "From our students" },
  ];

  const values = [
    {
      icon: Target,
      title: "Quality First",
      description: "Every course is carefully curated and reviewed to ensure the highest quality learning experience.",
    },
    {
      icon: Heart,
      title: "Student Success",
      description: "Your success is our priority. We provide tools, support, and resources to help you excel.",
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join learners from around the world and build connections that transcend borders.",
    },
    {
      icon: Zap,
      title: "Always Evolving",
      description: "We constantly update our platform and content to stay ahead of industry trends.",
    },
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "CEO & Founder",
      bio: "Former tech executive with 15+ years in EdTech",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    },
    {
      name: "Arjun Patel",
      role: "Chief Technology Officer",
      bio: "Built scalable platforms at leading tech companies",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    },
    {
      name: "Neha Gupta",
      role: "Head of Content",
      bio: "Education specialist ensuring course quality",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    },
    {
      name: "Rahul Kumar",
      role: "Head of Community",
      bio: "Passionate about connecting learners globally",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    },
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
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute inset-0 bg-mesh opacity-40" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[15%] w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center"
        >
          <BookOpen className="w-8 h-8 text-primary/50" />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[15%] w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center"
        >
          <Star className="w-6 h-6 text-amber-500/50" />
        </motion.div>

        <div className="section-container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4 rounded-full">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Transforming Education Since 2020
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
              Empowering learners
              <br />
              <span className="text-gradient">around the world</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              We're on a mission to democratize education and make high-quality learning 
              accessible to everyone, everywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8 rounded-full shadow-apple" asChild>
                <Link href="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full" asChild>
                <Link href="/instructor">Become an Instructor</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <AnimatedSection key={index}>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2">
                    {stat.value}
                  </div>
                  <div className="font-medium mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-spacing">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection>
              <Badge variant="secondary" className="mb-4 rounded-full">Our Story</Badge>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
                Born from a passion for learning
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  CourseHub was founded in 2020 with a simple belief: that everyone deserves 
                  access to quality education, regardless of their location or background.
                </p>
                <p>
                  What started as a small team of educators and technologists has grown 
                  into a global community of learners and instructors, united by the 
                  shared goal of continuous learning and growth.
                </p>
                <p>
                  Today, we're proud to serve students in over 150 countries, offering 
                  courses that span from fundamental skills to cutting-edge technologies.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild className="rounded-full">
                  <Link href="/courses">
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 lg:p-12 text-primary-foreground">
                  <div className="h-full flex flex-col justify-center items-center text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Globe className="w-20 h-20 mb-6 opacity-80" />
                    </motion.div>
                    <div className="text-4xl font-semibold mb-2">150+</div>
                    <div className="text-lg opacity-80">Countries Reached</div>
                  </div>
                </div>
                
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 p-4 bg-card rounded-2xl shadow-apple-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-semibold">50K+</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-spacing bg-muted/30">
        <div className="section-container">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 rounded-full">Our Values</Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              What drives us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape the learning experience we create.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={index}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="h-full p-6 lg:p-8 bg-card rounded-2xl border border-border/50 shadow-apple"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-spacing">
        <div className="section-container">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 rounded-full">Our Team</Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Meet the people behind CourseHub
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A passionate team dedicated to transforming education for everyone.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {team.map((member, index) => (
              <AnimatedSection key={index}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="text-center p-6 bg-card rounded-2xl border border-border/50 shadow-apple"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="rounded-2xl object-cover"
                    />
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.bio}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,white_0%,transparent_50%)]" />
        </div>

        <div className="section-container relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
              Ready to start learning?
            </h2>
            <p className="text-lg opacity-80 mb-10">
              Join over 50,000 learners and unlock your potential with world-class courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="h-12 px-8 rounded-full shadow-lg"
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
                className="h-12 px-8 rounded-full bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
