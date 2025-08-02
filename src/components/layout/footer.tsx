"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Mail, 
  MapPin, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Github,
  BookOpen,
  Users,
  Award,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const faqData = [
  {
    question: "How do I get started with CourseHub?",
    answer: "Simply create a free account, browse our course catalog, and enroll in any course that interests you. Most courses offer free previews so you can try before you buy."
  },
  {
    question: "Are the certificates recognized by employers?",
    answer: "Yes! Our certificates are recognized by top employers worldwide. Many of our instructors are industry professionals from companies like Google, Netflix, and Meta."
  },
  {
    question: "Can I learn at my own pace?",
    answer: "Absolutely! All courses include lifetime access, so you can learn at your own pace and revisit materials anytime. Our AI-powered learning paths adapt to your schedule."
  },
  {
    question: "What if I'm not satisfied with a course?",
    answer: "We offer a 30-day money-back guarantee on all paid courses. If you're not completely satisfied, we'll refund your purchase, no questions asked."
  },
  {
    question: "Do you offer team or corporate plans?",
    answer: "Yes! We offer special pricing for teams and enterprises. Contact our sales team for custom pricing and features tailored to your organization's needs."
  },
  {
    question: "How often is course content updated?",
    answer: "Our instructors regularly update course content to keep pace with industry changes. You'll receive notifications when new content is added to courses you've enrolled in."
  }
];

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Press", href: "/press" },
  { name: "Blog", href: "/blog" },
  { name: "Help Center", href: "/help" },
  { name: "Contact", href: "/contact" }
];

const learningPaths = [
  { name: "Web Development", href: "/courses?category=web-development" },
  { name: "Data Science", href: "/courses?category=data-science" },
  { name: "UI/UX Design", href: "/courses?category=design" },
  { name: "Digital Marketing", href: "/courses?category=marketing" },
  { name: "Business Skills", href: "/courses?category=business" },
  { name: "Personal Development", href: "/courses?category=personal" }
];

const resources = [
  { name: "Course Catalog", href: "/courses" },
  { name: "Free Courses", href: "/courses?price=free" },
  { name: "Mobile App", href: "/mobile" },
  { name: "Student Stories", href: "/stories" },
  { name: "Instructor Hub", href: "/instructor" },
  { name: "Affiliate Program", href: "/affiliates" }
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqData.map((faq, index) => (
        <motion.div
          key={index}
          className="border border-[#E2E8F0] rounded-lg overflow-hidden"
          initial={false}
        >
          <button
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3A86FF] focus:ring-offset-2"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
            id={`faq-question-${index}`}
          >
            <span className="font-medium text-[#1E293B]">{faq.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
            >
              <ChevronDown className="h-5 w-5 text-[#64748B]" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                id={`faq-answer-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <div className="px-6 pb-4 text-[#64748B] leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="bg-[#3A86FF] rounded-xl p-8 text-white">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
        <p className="text-white/80">
          Get the latest course updates, industry insights, and exclusive offers delivered to your inbox.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/40"
          required
          aria-label="Email address for newsletter"
        />
        <Button 
          type="submit" 
          className="bg-white text-[#3A86FF] hover:bg-white/90 px-8 py-2 font-semibold focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3A86FF]"
          disabled={isSubmitted}
          aria-describedby="newsletter-status"
        >
          {isSubmitted ? "Subscribed!" : "Subscribe"}
        </Button>
      </form>
      
      <div id="newsletter-status" className="mt-4 text-sm text-white/70 text-center">
        Join 50,000+ learners already subscribed. No spam, unsubscribe anytime.
      </div>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#E2E8F0]">
      {/* FAQ Section */}
      <section className="py-20 bg-[#F1F5F9]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#1E293B] mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
              Got questions? We've got answers. Find everything you need to know about CourseHub.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-[#3A86FF] rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1E293B]">CourseHub</span>
            </Link>
            <p className="text-[#64748B] mb-6 leading-relaxed">
              Empowering millions to learn, grow, and succeed with world-class online education. 
              Transform your future with our expert-led courses.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-[#64748B]">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Mysuru, India 570020</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@coursehub.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#1E293B] mb-6">Company</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-[#64748B] hover:text-[#3A86FF] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Paths */}
          <div>
            <h3 className="font-semibold text-[#1E293B] mb-6">Learning Paths</h3>
            <ul className="space-y-3">
              {learningPaths.map((path) => (
                <li key={path.name}>
                  <Link 
                    href={path.href}
                    className="text-[#64748B] hover:text-[#3A86FF] transition-colors duration-200"
                  >
                    {path.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-[#1E293B] mb-6">Resources</h3>
            <ul className="space-y-3 mb-6">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link 
                    href={resource.href}
                    className="text-[#64748B] hover:text-[#3A86FF] transition-colors duration-200"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust Badges */}
            <div className="space-y-2">
              <Badge variant="outline" className="bg-[#FFBE0B]/10 text-[#FFBE0B] border-[#FFBE0B]/30">
                <Award className="h-3 w-3 mr-1" />
                Industry Certified
              </Badge>
              <Badge variant="outline" className="bg-[#3A86FF]/10 text-[#3A86FF] border-[#3A86FF]/30">
                <Star className="h-3 w-3 mr-1" />
                4.9/5 Rating
              </Badge>
              <Badge variant="outline" className="bg-[#8338EC]/10 text-[#8338EC] border-[#8338EC]/30">
                <Users className="h-3 w-3 mr-1" />
                500K+ Students
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E2E8F0] bg-[#F1F5F9]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-[#64748B]">
              © {currentYear} CourseHub. All rights reserved. 
              <Link href="/privacy" className="ml-2 hover:text-[#3A86FF]">Privacy Policy</Link>
              <span className="mx-2">•</span>
              <Link href="/terms" className="hover:text-[#3A86FF]">Terms of Service</Link>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "https://facebook.com/coursehub", label: "Facebook" },
                { icon: Twitter, href: "https://twitter.com/coursehub", label: "Twitter" },
                { icon: Instagram, href: "https://instagram.com/coursehub", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com/company/coursehub", label: "LinkedIn" },
                { icon: Github, href: "https://github.com/coursehub", label: "GitHub" }
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E2E8F0] hover:bg-[#3A86FF] hover:text-white transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
                 