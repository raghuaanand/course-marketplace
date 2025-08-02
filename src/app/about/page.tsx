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
  Play,
  GraduationCap,
  TrendingUp,
  Sparkles,
  Rocket,
  Shield,
  Brain,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutPage() {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const storyInView = useInView(storyRef, { once: true });
  const valuesInView = useInView(valuesRef, { once: true });
  const teamInView = useInView(teamRef, { once: true });

  const stats = [
    { 
      label: "Active Students", 
      value: "50,000+", 
      icon: Users,
      color: "#3A86FF",
      description: "Learning worldwide"
    },
    { 
      label: "Expert Instructors", 
      value: "500+", 
      icon: GraduationCap,
      color: "#FFBE0B", 
      description: "Industry professionals"
    },
    { 
      label: "Course Categories", 
      value: "25+", 
      icon: BookOpen,
      color: "#8338EC",
      description: "Diverse subjects"
    },
    { 
      label: "Student Satisfaction", 
      value: "98%", 
      icon: Star,
      color: "#3A86FF",
      description: "Excellence rating"
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Quality Education",
      description: "We're committed to providing high-quality, practical education that helps students achieve their career goals.",
      color: "#3A86FF"
    },
    {
      icon: Heart,
      title: "Student Success",
      description: "Your success is our priority. We provide comprehensive support and resources to help you excel.",
      color: "#FFBE0B"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join a worldwide community of learners and connect with peers from diverse backgrounds.",
      color: "#8338EC"
    },
    {
      icon: TrendingUp,
      title: "Continuous Growth",
      description: "We constantly evolve our platform and content to stay ahead of industry trends and demands.",
      color: "#3A86FF"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former tech executive with 15+ years of experience in education technology.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      bio: "Software architect passionate about creating scalable learning platforms.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Content",
      bio: "Education specialist ensuring quality and relevance of our course content.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "David Kim",
      role: "Lead Instructor",
      bio: "Industry expert with experience teaching programming and data science.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const achievements = [
    "Featured in TechCrunch's Top EdTech Platforms 2024",
    "Winner of Best Online Learning Platform Award",
    "Partnerships with Fortune 500 companies",
    "99% course completion rate among active students",
    "Available in 12+ languages worldwide"
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] overflow-hidden pt-20">
      {/* Modern Professional Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-[#F1F5F9] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Clean Educational Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating educational icons */}
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
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#3A86FF]/20 shadow-lg mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#3A86FF] mr-2" />
              <span className="text-sm font-medium text-[#1E293B]">Transforming Education Since 2020</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1E293B] mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              About Our{" "}
              <span className="text-[#3A86FF] relative">
                Mission
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#FFBE0B] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={heroInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-[#64748B] mb-10 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              We're democratizing education by making high-quality learning accessible to everyone, everywhere. 
              Join our global community of learners and transform your future.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-[#3A86FF] hover:bg-[#2563EB] text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Our Story
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-[#3A86FF] text-[#3A86FF] hover:bg-[#3A86FF] hover:text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
              >
                Join Our Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Modern Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="flex justify-center mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon 
                      className="h-8 w-8 transition-all duration-300" 
                      style={{ color: stat.color }}
                    />
                  </div>
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">
                  {stat.value}
                </div>
                <div className="text-[#64748B] font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-[#94A3B8]">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Story Section */}
      <motion.section 
        ref={storyRef}
        className="py-20 bg-[#F1F5F9]"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-6">
                  Our Story
                </h2>
                <div className="space-y-6 text-lg text-[#64748B] leading-relaxed">
                  <p>
                    Founded in 2020, our platform was born from a simple belief: that everyone deserves access to quality education, regardless of their location, background, or circumstances.
                  </p>
                  <p>
                    What started as a small team of educators and technologists has grown into a global community of learners and instructors, united by the shared goal of continuous learning and growth.
                  </p>
                  <p>
                    Today, we're proud to serve students in over 150 countries, offering courses that span from fundamental skills to cutting-edge technologies.
                  </p>
                </div>
                <div className="mt-8">
                  <Button 
                    asChild
                    className="bg-[#3A86FF] hover:bg-[#2563EB] text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/courses">
                      Explore Our Courses
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <div 
                    className="aspect-square rounded-3xl p-8 text-white shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, #3A86FF 0%, #8338EC 100%)`
                    }}
                  >
                    <div className="h-full flex flex-col justify-center text-center">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Globe className="h-24 w-24 mx-auto mb-6 opacity-90" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-4">150+ Countries</h3>
                      <p className="text-blue-100">
                        Students from around the world trust our platform for their learning journey
                      </p>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFBE0B] rounded-full opacity-80"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#FFBE0B] rounded-full opacity-60"
                    animate={{ scale: [1.2, 1, 1.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Modern Values Section */}
      <motion.section 
        ref={valuesRef}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-[#64748B] max-w-3xl mx-auto leading-relaxed">
              These principles guide everything we do and shape the learning experience we create
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white">
                  <CardContent className="p-8">
                    <motion.div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                      style={{ backgroundColor: `${value.color}15` }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <value.icon 
                        className="h-8 w-8" 
                        style={{ color: value.color }}
                      />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-[#1E293B] mb-4">
                      {value.title}
                    </h3>
                    <p className="text-[#64748B] leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Modern Team Section */}
      <motion.section 
        ref={teamRef}
        className="py-20 bg-[#F1F5F9]"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-[#64748B] max-w-3xl mx-auto leading-relaxed">
              The passionate individuals behind our mission to transform education
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white">
                  <CardContent className="p-6">
                    <motion.div 
                      className="relative w-32 h-32 mx-auto mb-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover shadow-lg"
                      />
                      <div className="absolute inset-0 rounded-full ring-4 ring-[#3A86FF]/20"></div>
                    </motion.div>
                    <h3 className="text-xl font-semibold text-[#1E293B] mb-1">
                      {member.name}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className="mb-3 bg-[#3A86FF]/10 text-[#3A86FF] border-0"
                    >
                      {member.role}
                    </Badge>
                    <p className="text-sm text-[#64748B] leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Modern Achievements Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
                Our Achievements
              </h2>
              <p className="text-xl text-[#64748B] leading-relaxed">
                Recognition and milestones that reflect our commitment to excellence
              </p>
            </motion.div>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E2E8F0]"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle className="h-6 w-6 text-[#3A86FF] flex-shrink-0" />
                  </motion.div>
                  <span className="text-lg text-[#1E293B] font-medium">
                    {achievement}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20 bg-[#1E293B] text-white relative overflow-hidden">
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
            className="absolute top-1/2 left-1/4 w-12 h-12 bg-[#8338EC] rounded-full"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-[#94A3B8] mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students who have transformed their careers with our courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#3A86FF] hover:bg-[#2563EB] text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/courses">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Courses
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-[#3A86FF] text-[#3A86FF] hover:bg-[#3A86FF] hover:text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105 bg-white"
                asChild
              >
                <Link href="/auth/register">
                  <Rocket className="mr-2 h-5 w-5" />
                  Sign Up Free
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
