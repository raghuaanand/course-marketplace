import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, Award, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const featuredCourses = [
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      price: 89.99,
      originalPrice: 199.99,
      rating: 4.8,
      students: 12543,
      image: "/api/placeholder/300/200",
      category: "Development",
      duration: "52h 30m",
    },
    {
      id: "2",
      title: "Advanced React & Next.js Course",
      instructor: "Sarah Johnson",
      price: 79.99,
      originalPrice: 159.99,
      rating: 4.9,
      students: 8721,
      image: "/api/placeholder/300/200",
      category: "Development",
      duration: "38h 15m",
    },
    {
      id: "3",
      title: "Digital Marketing Masterclass",
      instructor: "Mike Wilson",
      price: 69.99,
      originalPrice: 149.99,
      rating: 4.7,
      students: 15632,
      image: "/api/placeholder/300/200",
      category: "Marketing",
      duration: "24h 45m",
    },
  ];

  const stats = [
    { icon: BookOpen, label: "Courses", value: "10,000+" },
    { icon: Users, label: "Students", value: "500,000+" },
    { icon: Award, label: "Instructors", value: "1,000+" },
    { icon: Star, label: "Reviews", value: "4.8/5" },
  ];

  const categories = [
    { name: "Web Development", count: 234, color: "bg-blue-500" },
    { name: "Data Science", count: 156, color: "bg-green-500" },
    { name: "Design", count: 189, color: "bg-purple-500" },
    { name: "Business", count: 298, color: "bg-orange-500" },
    { name: "Photography", count: 134, color: "bg-pink-500" },
    { name: "Music", count: 167, color: "bg-indigo-500" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover thousands of courses from expert instructors and advance your career with in-demand skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/courses" className="flex items-center">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/become-instructor" className="flex items-center">
                  Become an Instructor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
              <p className="text-muted-foreground text-lg">Handpicked courses to boost your skills</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/70 text-white">{course.category}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{course.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({course.students.toLocaleString()} students)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">${course.price}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${course.originalPrice}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{course.duration}</span>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link href={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Categories</h2>
            <p className="text-muted-foreground text-lg">Explore courses by your interests</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/courses?category=${encodeURIComponent(category.name.toLowerCase())}`}
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-all group-hover:scale-105">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} courses</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of learners and start your journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link href="/register">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
