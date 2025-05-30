"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { 
  Play, 
  SkipForward, 
  SkipBack, 
  Book, 
  CheckCircle2, 
  Circle, 
  Download,
  Menu,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { courseService } from "@/services/course";
import { enrollmentService } from "@/services/enrollment";
import { useAuthStore } from "@/store/auth";
import { formatDuration } from "@/utils/helpers";
import { LessonType } from "@course-marketplace/shared";
import type { Lesson } from "@course-marketplace/shared";

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourse(courseId),
    enabled: !!courseId && isAuthenticated,
  });

  // Fetch course modules
  const { data: modules } = useQuery({
    queryKey: ["course-modules", courseId],
    queryFn: () => courseService.getModules(courseId),
    enabled: !!courseId && isAuthenticated,
  });

  // Fetch enrollment data
  const { data: enrollment } = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      if (!user?.id) return null;
      return enrollmentService.getEnrollmentByUserAndCourse(user.id, courseId);
    },
    enabled: !!courseId && !!user?.id,
  });

  // Get all lessons from all modules
  const allLessons: Lesson[] = useMemo(() => 
    modules?.flatMap(module => module.lessons || []) || [], 
    [modules]
  );
  const currentLesson = allLessons.find(lesson => lesson.id === currentLessonId);

  // Calculate progress
  const totalLessons = allLessons.length;
  const completedCount = completedLessons.size;
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if user is enrolled
    if (course && !enrollment) {
      router.push(`/courses/${courseId}`);
      return;
    }

    // Set first lesson as current if none selected
    if (allLessons.length > 0 && !currentLessonId) {
      setCurrentLessonId(allLessons[0].id);
    }
  }, [isAuthenticated, course, enrollment, courseId, router, allLessons, currentLessonId]);

  const handleLessonComplete = async (lessonId: string) => {
    if (!enrollment) return;
    
    try {
      await enrollmentService.markLessonComplete(enrollment.id, lessonId);
      setCompletedLessons(prev => new Set([...prev, lessonId]));
      
      // Update progress
      const newProgress = ((completedLessons.size + 1) / totalLessons) * 100;
      await enrollmentService.updateProgress(enrollment.id, newProgress);
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
    if (currentIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentIndex + 1].id);
    }
  };

  const handlePreviousLesson = () => {
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
    if (currentIndex > 0) {
      setCurrentLessonId(allLessons[currentIndex - 1].id);
    }
  };

  if (!isAuthenticated || courseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Course not found or not enrolled</p>
          <Button asChild className="mt-4">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const Sidebar = () => (
    <div className="h-full flex flex-col">
      {/* Course Info */}
      <div className="p-4 border-b">
        <h1 className="font-semibold text-lg line-clamp-2">{course.title}</h1>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
          <div className="text-xs text-gray-500">
            {completedCount} of {totalLessons} lessons completed
          </div>
        </div>
      </div>

      {/* Course Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {modules?.map((module) => (
            <div key={module.id} className="space-y-2">
              <h3 className="font-medium text-sm">{module.title}</h3>
              <div className="space-y-1">
                {module.lessons?.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setCurrentLessonId(lesson.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-2 rounded-md text-left text-sm transition-colors ${
                      currentLessonId === lesson.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {completedLessons.has(lesson.id) ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {lesson.type === LessonType.VIDEO && <Play className="h-3 w-3" />}
                        {lesson.type === LessonType.TEXT && <Book className="h-3 w-3" />}
                        {lesson.type === LessonType.DOWNLOADABLE && <Download className="h-3 w-3" />}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      {lesson.videoDuration && (
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDuration(lesson.videoDuration)}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white dark:bg-gray-800 border-r">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <div>
                <h2 className="font-semibold">{currentLesson?.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <Badge variant="secondary">{currentLesson?.type}</Badge>
                  {currentLesson?.videoDuration && (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(currentLesson.videoDuration)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousLesson}
                disabled={allLessons.findIndex(l => l.id === currentLessonId) === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextLesson}
                disabled={allLessons.findIndex(l => l.id === currentLessonId) === allLessons.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {currentLesson ? (
              <div className="max-w-4xl mx-auto">
                {currentLesson.type === LessonType.VIDEO && currentLesson.videoUrl && (
                  <div className="mb-6">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        controls
                        className="w-full h-full"
                        src={currentLesson.videoUrl}
                        poster={course.thumbnail}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {currentLesson.title}
                      {!completedLessons.has(currentLesson.id) && (
                        <Button
                          onClick={() => handleLessonComplete(currentLesson.id)}
                          size="sm"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentLesson.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {currentLesson.description}
                      </p>
                    )}
                    
                    {currentLesson.content && (
                      <div className="prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                      </div>
                    )}

                    {currentLesson.type === LessonType.DOWNLOADABLE && (
                      <div className="mt-4">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download Resources
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handlePreviousLesson}
                    disabled={allLessons.findIndex(l => l.id === currentLessonId) === 0}
                  >
                    <SkipBack className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>
                  <Button
                    onClick={handleNextLesson}
                    disabled={allLessons.findIndex(l => l.id === currentLessonId) === allLessons.length - 1}
                  >
                    Next Lesson
                    <SkipForward className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a lesson to start learning
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
