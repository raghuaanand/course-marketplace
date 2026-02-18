"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ShoppingCart, User, BookOpen, LogOut,
    ChevronDown, Bell, GraduationCap, Award, Menu, X,
    Sparkles, Code, Palette, Database, LineChart, Smartphone
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
    const [showSearch, setShowSearch] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const router = useRouter();
    const { logout } = useAuth();
    const { user, isAuthenticated } = useAuthStore();
    const { getTotalItems } = useCartStore();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearch(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const categories = [
        { name: "Development", icon: Code, href: "/courses?category=development", description: "Web, Mobile & Software" },
        { name: "Design", icon: Palette, href: "/courses?category=design", description: "UI/UX & Graphics" },
        { name: "Data Science", icon: Database, href: "/courses?category=data-science", description: "AI & Machine Learning" },
        { name: "Business", icon: LineChart, href: "/courses?category=business", description: "Marketing & Strategy" },
        { name: "Mobile", icon: Smartphone, href: "/courses?category=mobile", description: "iOS & Android" },
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
        <>
            <motion.header
                className={`fixed top-0 z-50 w-full transition-all duration-500 ${
                    isScrolled
                        ? 'glass border-b border-border/40 shadow-apple'
                        : 'bg-transparent'
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
                <div className="section-container">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                            <motion.div
                                className="relative w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-apple overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <BookOpen className="h-5 w-5 text-primary-foreground relative z-10" />
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                            <span className="text-lg font-semibold tracking-tight">
                                CourseHub
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            
                            {/* Categories Dropdown */}
                            <div className="relative">
                                <button
                                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                                    onMouseEnter={() => setShowCategories(true)}
                                    onMouseLeave={() => setShowCategories(false)}
                                >
                                    <span>Categories</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showCategories && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                                            className="absolute top-full left-0 mt-2 w-72 bg-card rounded-2xl shadow-apple-lg border border-border/50 p-2 overflow-hidden"
                                            onMouseEnter={() => setShowCategories(true)}
                                            onMouseLeave={() => setShowCategories(false)}
                                        >
                                            {categories.map((category, index) => (
                                                <motion.div
                                                    key={category.name}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                >
                                                    <Link
                                                        href={category.href}
                                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                            <category.icon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium group-hover:text-primary transition-colors">
                                                                {category.name}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {category.description}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </nav>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative group">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                    <Input
                                        type="search"
                                        placeholder="Search courses..."
                                        className="w-full pl-10 pr-4 h-10 bg-muted/50 border-transparent rounded-full focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            {/* Search Toggle - Mobile */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden h-9 w-9 rounded-full"
                                onClick={() => setShowSearch(!showSearch)}
                            >
                                <Search className="h-4 w-4" />
                            </Button>

                            {/* Cart */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/cart">
                                    <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                                        <ShoppingCart className="h-4 w-4" />
                                        <AnimatePresence>
                                            {getTotalItems() > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary rounded-full flex items-center justify-center"
                                                >
                                                    <span className="text-[10px] font-medium text-primary-foreground">
                                                        {getTotalItems()}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Notifications */}
                            {isAuthenticated && (
                                <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9 rounded-full relative">
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-primary rounded-full" />
                                </Button>
                            )}

                            {/* User Menu */}
                            {isAuthenticated && user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                                            <Avatar className="h-8 w-8 border-2 border-transparent hover:border-primary/20 transition-colors">
                                                <AvatarImage src={user.avatar || undefined} alt={`${user.firstName} ${user.lastName}`} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                                    {getInitials(user.firstName, user.lastName)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64 p-0 rounded-2xl shadow-apple-lg border-border/50" align="end">
                                        <div className="p-4 border-b border-border/50">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={user.avatar || undefined} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                        {getInitials(user.firstName, user.lastName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="mt-3 text-xs">
                                                {user.role === 'INSTRUCTOR' ? 'Instructor' : user.role === 'ADMIN' ? 'Admin' : 'Student'}
                                            </Badge>
                                        </div>
                                        <div className="p-2">
                                            {userMenuItems.map((item) => (
                                                <DropdownMenuItem key={item.href} asChild className="rounded-lg cursor-pointer">
                                                    <Link href={item.href} className="flex items-center gap-3 py-2.5">
                                                        <item.icon className="h-4 w-4 text-muted-foreground" />
                                                        {item.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </div>
                                        <DropdownMenuSeparator className="m-0" />
                                        <div className="p-2">
                                            <DropdownMenuItem 
                                                onClick={handleLogout} 
                                                className="text-destructive focus:text-destructive rounded-lg cursor-pointer"
                                            >
                                                <LogOut className="mr-3 h-4 w-4" />
                                                Sign Out
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Button variant="ghost" asChild className="text-sm h-9 px-4 rounded-full">
                                        <Link href="/auth/login">Sign In</Link>
                                    </Button>
                                    <Button asChild className="text-sm h-9 px-5 rounded-full shadow-apple">
                                        <Link href="/auth/register">Get Started</Link>
                                    </Button>
                                </div>
                            )}

                            {/* Mobile Menu */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 rounded-full">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full sm:w-96 p-0 border-0">
                                    <div className="flex flex-col h-full bg-background">
                                        {/* Mobile Header */}
                                        <div className="flex items-center justify-between p-4 border-b border-border/50">
                                            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                                    <BookOpen className="h-4 w-4 text-primary-foreground" />
                                                </div>
                                                <span className="font-semibold">CourseHub</span>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* User Info */}
                                        {isAuthenticated && user && (
                                            <div className="p-4 border-b border-border/50 bg-muted/30">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={user.avatar || undefined} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                            {getInitials(user.firstName, user.lastName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Mobile Search */}
                                        <div className="p-4 border-b border-border/50">
                                            <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }}>
                                                <div className="relative">
                                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="search"
                                                        placeholder="Search courses..."
                                                        className="pl-10 h-11 bg-muted/50 border-transparent rounded-xl"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                            </form>
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex-1 overflow-auto p-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Menu</p>
                                                {navItems.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <span className="font-medium">{item.label}</span>
                                                    </Link>
                                                ))}
                                                <Link
                                                    href="/cart"
                                                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <span className="font-medium">Cart</span>
                                                    {getTotalItems() > 0 && (
                                                        <Badge variant="secondary">{getTotalItems()}</Badge>
                                                    )}
                                                </Link>
                                            </div>

                                            {isAuthenticated && user && (
                                                <div className="mt-6 space-y-1">
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Account</p>
                                                    {userMenuItems.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <item.icon className="h-5 w-5 text-muted-foreground" />
                                                            <span className="font-medium">{item.label}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-6 space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Categories</p>
                                                {categories.map((category) => (
                                                    <Link
                                                        key={category.name}
                                                        href={category.href}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <category.icon className="h-5 w-5 text-muted-foreground" />
                                                        <span className="font-medium">{category.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Mobile Footer */}
                                        <div className="p-4 border-t border-border/50 bg-muted/20">
                                            {isAuthenticated ? (
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => {
                                                        handleLogout();
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                >
                                                    <LogOut className="mr-3 h-4 w-4" />
                                                    Sign Out
                                                </Button>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Button asChild className="w-full rounded-xl">
                                                        <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                                                            Get Started
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" asChild className="w-full rounded-xl">
                                                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                            Sign In
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-lg md:hidden"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-3 p-4 border-b border-border/50">
                                <form onSubmit={handleSearch} className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search courses..."
                                            className="pl-10 h-11 bg-muted/50 border-transparent rounded-xl"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </form>
                                <Button variant="ghost" size="sm" onClick={() => setShowSearch(false)}>
                                    Cancel
                                </Button>
                            </div>
                            <div className="flex-1 p-4">
                                <p className="text-sm text-muted-foreground">
                                    Search for courses, topics, or instructors...
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
