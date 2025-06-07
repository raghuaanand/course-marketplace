"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

interface CourseForm {
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string;
  requirements: string[];
  learningObjectives: string[];
  lessons: Lesson[];
}

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState<CourseForm>({
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
    thumbnail: "",
    requirements: [],
    learningObjectives: [],
    lessons: []
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newObjective, setNewObjective] = useState("");

  const categories = [
    "Programming",
    "Web Development",
    "Data Science",
    "Design",
    "Business",
    "Marketing",
    "Photography",
    "Music",
    "Health & Fitness",
    "Language",
    "Lifestyle"
  ];

  const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

  if (user?.role !== "INSTRUCTOR" && user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600">You need to be an instructor to create courses.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: keyof CourseForm, value: string | number | string[]) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setForm(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setForm(prev => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, newObjective.trim()]
      }));
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setForm(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
      order: form.lessons.length + 1
    };
    
    setForm(prev => ({
      ...prev,
      lessons: [...prev.lessons, newLesson]
    }));
  };

  const updateLesson = (lessonId: string, field: keyof Lesson, value: string | number) => {
    setForm(prev => ({
      ...prev,
      lessons: prev.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
      )
    }));
  };

  const removeLesson = (lessonId: string) => {
    setForm(prev => ({
      ...prev,
      lessons: prev.lessons.filter(lesson => lesson.id !== lessonId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!form.title || !form.description || !form.category || !form.level) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (form.lessons.length === 0) {
        toast.error("Please add at least one lesson");
        return;
      }

      // Find category by name
      const categoryMap: { [key: string]: string } = {
        "Programming": "programming",
        "Web Development": "web-development", 
        "Data Science": "data-science",
        "Design": "design",
        "Business": "business",
        "Marketing": "marketing",
        "Photography": "photography",
        "Music": "music",
        "Health & Fitness": "health-fitness",
        "Language": "language",
        "Lifestyle": "lifestyle"
      };

      // Get the actual category from the database
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      const selectedCategory = categoriesData.data.find((cat: any) => 
        cat.name === form.category || cat.slug === categoryMap[form.category]
      );

      if (!selectedCategory) {
        toast.error("Please select a valid category");
        return;
      }

      // Prepare course data
      const courseData = {
        title: form.title,
        description: form.description,
        shortDescription: form.description.slice(0, 100) + (form.description.length > 100 ? "..." : ""),
        categoryId: selectedCategory.id,
        price: form.price,
        level: form.level,
        language: "English",
        requirements: form.requirements,
        whatYouWillLearn: form.learningObjectives,
      };

      // Create course
      const response = await fetch('/api/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create course');
      }

      toast.success("Course created successfully!");
      router.push("/instructor");
    } catch (error: any) {
      toast.error("Failed to create course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Course</h1>
              <p className="text-gray-600 dark:text-gray-400">Fill in the details to create your course</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter course title"
                    value={form.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="99.99"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this course"
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={form.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level *</Label>
                  <Select value={form.level} onValueChange={(value) => handleInputChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={form.thumbnail}
                  onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Course Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a requirement..."
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {form.requirements.map((requirement, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{requirement}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeRequirement(index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a learning objective..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                />
                <Button type="button" onClick={addObjective}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {form.learningObjectives.map((objective, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{objective}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeObjective(index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Content</CardTitle>
                <Button type="button" onClick={addLesson}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {form.lessons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No lessons added yet. Click &quot;Add Lesson&quot; to get started.</p>
                </div>
              ) : (
                form.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Lesson {index + 1}</h4>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeLesson(lesson.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Lesson Title</Label>
                        <Input
                          placeholder="Enter lesson title"
                          value={lesson.title}
                          onChange={(e) => updateLesson(lesson.id, "title", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          placeholder="15"
                          min="1"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(lesson.id, "duration", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Lesson Description</Label>
                      <Textarea
                        placeholder="Describe what this lesson covers"
                        rows={2}
                        value={lesson.description}
                        onChange={(e) => updateLesson(lesson.id, "description", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Video URL</Label>
                      <Input
                        placeholder="https://example.com/video.mp4"
                        value={lesson.videoUrl}
                        onChange={(e) => updateLesson(lesson.id, "videoUrl", e.target.value)}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
