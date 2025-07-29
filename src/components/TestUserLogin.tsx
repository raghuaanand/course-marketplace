"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, ShieldCheck, TestTube, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function TestUserLogin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  // Only show in development environment
//   if (process.env.NODE_ENV === "production") {
//     return null;
//   }

  const testUsers = [
    {
      role: "STUDENT",
      email: "student1@coursemarket.com",
      password: "password123",
      name: "Test Student",
      description: "Access student features: browse courses, enroll, view progress",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      role: "INSTRUCTOR",
      email: "john.instructor@coursemarket.com",
      password: "password123",
      name: "Test Instructor",
      description: "Access instructor features: create courses, manage students, analytics",
      icon: GraduationCap,
      color: "bg-green-500",
    },
    {
      role: "ADMIN",
      email: "admin@coursemarket.com",
      password: "password123",
      name: "Test Admin",
      description: "Access admin features: manage users, courses, system settings",
      icon: ShieldCheck,
      color: "bg-purple-500",
    },
  ];

  const handleTestLogin = async (email: string, password: string, roleName: string) => {
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Failed to sign in as test user");
      } else {
        toast.success(`Successfully signed in as Test ${roleName}`);
        setIsOpen(false);
        // Redirect based on role
        if (roleName === "Admin") {
          window.location.href = "/admin";
        } else if (roleName === "Instructor") {
          window.location.href = "/instructor/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      console.error("Test login error:", error);
      toast.error("Something went wrong during test login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-dashed border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500 animate-pulse hover:animate-none transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <TestTube className="h-4 w-4 mr-2 animate-bounce" />
          {session ? "Switch Test User" : "Test User Login"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <TestTube className="h-5 w-5 mr-2 text-orange-500" />
            Test User Login
          </DialogTitle>
          <DialogDescription>
            {session 
              ? `Currently logged in as ${session.user?.name}. Choose a different test user role to switch accounts.`
              : "Choose a role to test the platform with pre-configured credentials. Perfect for exploring features without registration."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {testUsers.map((user) => (
            <Card
              key={user.role}
              className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${
                isLoading ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => handleTestLogin(user.email, user.password, user.name.replace("Test ", ""))}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${user.color}`}>
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    ) : (
                      <user.icon className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{user.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.description}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span className="font-mono bg-muted px-1 py-0.5 rounded">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> This feature is for testing purposes only. 
            All test accounts use the password: <code className="bg-background px-1 py-0.5 rounded">password123</code>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
