import { useState, useEffect, useCallback } from 'react';
import { Course, CourseWithDetails } from '@/types';
import { courseService, CourseFilters, CoursesResponse } from '@/services/course';

export const useCourses = (filters?: CourseFilters) => {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCourses = useCallback(async (newFilters?: CourseFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: CoursesResponse = await courseService.getCourses({
        ...filters,
        ...newFilters,
      });
      
      setCourses(response.courses);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const refetch = (newFilters?: CourseFilters) => {
    fetchCourses(newFilters);
  };

  return {
    data: courses,
    isLoading: loading,
    error,
    total,
    totalPages,
    currentPage,
    refetch,
  };
};

export const useCourse = (id?: string) => {
  const [course, setCourse] = useState<CourseWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const courseData = await courseService.getCourse(id);
        setCourse(courseData);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const courseData = await courseService.getCourse(id);
      setCourse(courseData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    course,
    loading,
    error,
    refetch,
  };
};
