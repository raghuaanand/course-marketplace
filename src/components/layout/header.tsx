"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ShoppingCart, User, Menu, BookOpen, LogOut, 
  Brain, Target, Zap, ChevronDown, Bell, Star, Users,
  GraduationCap, Award, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { getInitials } from "@/utils/helpers";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();
  const { user, isAuthenticated } = useAuthStore();
  const { getTotalItems } = useCartStore();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const categories = [
    { name: "Frontend Development", icon: TrendingUp, color: "#3A86FF", count: 485 },
    { name: "Backend & APIs", icon: Target, color: "#FFBE0B", count: 392 },
    { name: "UI/UX Design", icon: Brain, color: "#8338EC", count: 278 },
    { name: "Data Science", icon: Zap, color: "#FFBE0B", count: 356 },
    { name: "DevOps & Cloud", icon: GraduationCap, color: "#3A86FF", count: 289 },
    { name: "Mobile Development", icon: Award, color: "#8338EC", count: 234 },
  ];

  const navItems = [
    { href: "/courses", label: "Courses" },
    { href: "/about", label: "About" },
    { href: "/instructor", label: "Teach" },
  ];

  const userMenuItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/my-courses", label: "My Learning", icon: BookOpen },
  ];

  if (user?.role === "INSTRUCTOR") {
    userMenuItems.push(
      { href: "/instructor/dashboard", label: "Instructor Hub", icon: GraduationCap },
      { href: "/instructor/manage-courses", label: "My Courses", icon: BookOpen }
    );
  }

  if (user?.role === "ADMIN") {
    userMenuItems.push({
      href: "/admin/dashboard",
      label: "Admin Dashboard",
      icon: Award,
    });
  }

  return (
    <motion.header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-lg shadow-slate-900/5' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Professional Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
            <motion.div 
              className="relative w-8 h-8 md:w-10 md:h-10 bg-[#3A86FF] rounded-xl flex items-center justify-center overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="h-4 w-4 md:h-6 md:w-6 text-white relative z-10" />
              <motion.div
                className="absolute inset-0 bg-[#8338EC] opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-[#1E293B]">
                CourseHub
              </span>
              <span className="hidden sm:block text-xs text-[#64748B] -mt-1">Learn. Grow. Excel.</span>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#3A86FF] transition-colors duration-200 group"
                >
                  {item.label}
                  <motion.div
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-[#3A86FF] group-hover:w-full group-hover:left-0 transition-all duration-300"
                  />
                </Link>
              </motion.div>
            ))}
            
            {/* Categories Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-1 text-sm font-medium text-[#64748B] hover:text-[#3A86FF]"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <AnimatePresence>
                {showCategories && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-100 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 p-6"
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((category, index) => (
                        <motion.div
                          key={category.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={`/courses?category=${encodeURIComponent(category.name.toLowerCase())}`}
                            className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-[#F1F5F9] transition-colors duration-200"
                          >
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: category.color }}
                            >
                              <category.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-[#1E293B] group-hover:text-[#3A86FF] transition-colors">
                                {category.name}
                              </div>
                              <div className="text-xs text-[#64748B]">{category.count} courses</div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748B] group-focus-within:text-[#3A86FF] transition-colors" />
              <Input
                type="search"
                placeholder="Search for anything..."
                className="w-full pl-10 pr-4 py-2 bg-[#F1F5F9] border-[#E2E8F0] rounded-full focus:bg-white focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#3A86FF]/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"
              />
            </div>
          </form>

          {/* Enhanced Actions */}
          <div className="flex items-center space-x-1 md:space-x-3">
            {/* Cart with enhanced animation - hidden on smallest screens, shown on sm+ */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block"
            >
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative p-2">
                  <ShoppingCart className="h-5 w-5" />
                  <AnimatePresence>
                    {getTotalItems() > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 h-5 w-5 bg-[#8338EC] rounded-full flex items-center justify-center"
                      >
                        <span className="text-xs text-white font-bold">{getTotalItems()}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>
            </motion.div>

            {/* Notifications - hidden on mobile */}
            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block"
              >
                <Button variant="ghost" size="sm" className="relative p-2">
                  <Bell className="h-5 w-5" />
                  <motion.div
                    className="absolute -top-1 -right-1 h-2 w-2 bg-[#8338EC] rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Button>
              </motion.div>
            )}

            {/* Enhanced User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-10 w-10 border-2 border-transparent hover:border-[#3A86FF]/30 transition-colors">
                        <AvatarImage src={user.avatar || undefined} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="bg-[#3A86FF] text-white">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Enhanced Role indicator */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 -right-1"
                      >
                        <Badge 
                          variant={user.role === 'INSTRUCTOR' ? 'default' : user.role === 'ADMIN' ? 'destructive' : 'secondary'} 
                          className="h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full"
                        >
                          {user.role === 'INSTRUCTOR' ? 'T' : user.role === 'ADMIN' ? 'A' : 'S'}
                        </Badge>
                      </motion.div>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-4 bg-[#F1F5F9]">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback className="bg-[#3A86FF] text-white">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-[#1E293B]">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-[#64748B] truncate max-w-32">{user.email}</p>
                      <Badge 
                        variant={user.role === 'INSTRUCTOR' ? 'default' : user.role === 'ADMIN' ? 'destructive' : 'secondary'} 
                        className="w-fit text-xs"
                      >
                        {user.role === 'INSTRUCTOR' ? 'Instructor' : user.role === 'ADMIN' ? 'Admin' : 'Student'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center cursor-pointer">
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Button variant="ghost" asChild className="text-[#64748B] hover:text-[#3A86FF]">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-[#3A86FF] hover:bg-[#2563EB] text-white rounded-xl px-6">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Enhanced Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="search"
                        placeholder="Search for anything..."
                        className="pl-10 rounded-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-3">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 text-[#64748B] hover:text-[#3A86FF] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                    
                    {/* Mobile Cart */}
                    <Link
                      href="/cart"
                      className="flex items-center justify-between px-4 py-3 text-[#64748B] hover:text-[#3A86FF] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="font-medium">Shopping Cart</span>
                      </div>
                      {getTotalItems() > 0 && (
                        <Badge className="bg-[#8338EC] text-white">
                          {getTotalItems()}
                        </Badge>
                      )}
                    </Link>

                    {/* Mobile User Menu Items for authenticated users */}
                    {isAuthenticated && user && (
                      <>
                        <div className="border-t pt-3 mt-3">
                          <div className="px-4 py-2 text-sm font-semibold text-slate-900">My Account</div>
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center space-x-3 px-4 py-3 text-[#64748B] hover:text-[#3A86FF] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          ))}
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                          >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </>
                    )}
                  </nav>

                  {/* Mobile Categories */}
                  <div className="space-y-3">
                    <h3 className="px-4 text-sm font-semibold text-slate-900">Popular Categories</h3>
                    <div className="space-y-2">
                      {categories.slice(0, 4).map((category) => (
                        <Link
                          key={category.name}
                          href={`/courses?category=${encodeURIComponent(category.name.toLowerCase())}`}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: category.color }}
                          >
                            <category.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#1E293B]">{category.name}</div>
                            <div className="text-xs text-[#64748B]">{category.count} courses</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="flex flex-col space-y-3 pt-6 border-t">
                      <Button variant="ghost" asChild>
                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button asChild className="bg-[#3A86FF] hover:bg-[#2563EB] text-white">
                        <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
