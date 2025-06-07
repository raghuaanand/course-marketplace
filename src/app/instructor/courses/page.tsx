"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstructorCoursesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the manage courses page
    router.replace("/instructor/manage-courses");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting to manage courses...</p>
      </div>
    </div>
  );
}
