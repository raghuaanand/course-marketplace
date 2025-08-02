"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstructorDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main instructor page
    router.replace("/instructor");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center pt-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A86FF] mx-auto"></div>
        <p className="mt-4 text-[#64748B]">Redirecting to instructor dashboard...</p>
      </div>
    </div>
  );
}
