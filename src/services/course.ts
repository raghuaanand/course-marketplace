import { Course, CourseStatus, Category, Module, Lesson, Review, ReviewWithUser, CourseWithDetails } from '@/types';
import { apiService } from './api';

export interface CourseFilters {
  category?: string;
  instructor?: string;
  level?: string;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  status?: CourseStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CoursesResponse {
  courses: CourseWithDetails[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateCourseData {
  title: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  level?: string;
  language: string;
  requirements: string[];
  whatYouWillLearn: string[];
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  status?: CourseStatus;
}

export interface CreateModuleData {
  title: string;
  description?: string;
  order: number;
}

export interface CreateLessonData {
  title: string;
  description?: string;
  type: string;
  content?: string;
  videoUrl?: string;
  order: number;
  isFree?: boolean;
}

class CourseService {
  // Course management
  async getCourses(filters?: CourseFilters): Promise<CoursesResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    return apiService.get<CoursesResponse>(`/courses?${params.toString()}`);
  }

  async getCourse(id: string): Promise<CourseWithDetails> {
    return apiService.get<CourseWithDetails>(`/courses/${id}`);
  }

  async getCourseBySlug(slug: string): Promise<CourseWithDetails> {
    return apiService.get<CourseWithDetails>(`/courses/slug/${slug}`);
  }

  async createCourse(data: CreateCourseData): Promise<Course> {
    return apiService.post<Course>('/courses', data);
  }

  async updateCourse(id: string, data: UpdateCourseData): Promise<Course> {
    return apiService.patch<Course>(`/courses/${id}`, data);
  }

  async deleteCourse(id: string): Promise<void> {
    return apiService.delete(`/courses/${id}`);
  }

  async publishCourse(id: string): Promise<Course> {
    return apiService.patch<Course>(`/courses/${id}/publish`);
  }

  async unpublishCourse(id: string): Promise<Course> {
    return apiService.patch<Course>(`/courses/${id}/unpublish`);
  }

  // Instructor courses
  async getInstructorCourses(filters?: Partial<CourseFilters>): Promise<CoursesResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    return apiService.get<CoursesResponse>(`/courses/instructor?${params.toString()}`);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return apiService.get<Category[]>('/categories');
  }

  async getCategory(id: string): Promise<Category> {
    return apiService.get<Category>(`/categories/${id}`);
  }

  // Modules
  async getModules(courseId: string): Promise<Module[]> {
    return apiService.get<Module[]>(`/courses/${courseId}/modules`);
  }

  async createModule(courseId: string, data: CreateModuleData): Promise<Module> {
    return apiService.post<Module>(`/courses/${courseId}/modules`, data);
  }

  async updateModule(courseId: string, moduleId: string, data: Partial<CreateModuleData>): Promise<Module> {
    return apiService.patch<Module>(`/courses/${courseId}/modules/${moduleId}`, data);
  }

  async deleteModule(courseId: string, moduleId: string): Promise<void> {
    return apiService.delete(`/courses/${courseId}/modules/${moduleId}`);
  }

  // Lessons
  async getLessons(moduleId: string): Promise<Lesson[]> {
    return apiService.get<Lesson[]>(`/modules/${moduleId}/lessons`);
  }

  async getLesson(moduleId: string, lessonId: string): Promise<Lesson> {
    return apiService.get<Lesson>(`/modules/${moduleId}/lessons/${lessonId}`);
  }

  async createLesson(moduleId: string, data: CreateLessonData): Promise<Lesson> {
    return apiService.post<Lesson>(`/modules/${moduleId}/lessons`, data);
  }

  async updateLesson(moduleId: string, lessonId: string, data: Partial<CreateLessonData>): Promise<Lesson> {
    return apiService.patch<Lesson>(`/modules/${moduleId}/lessons/${lessonId}`, data);
  }

  async deleteLesson(moduleId: string, lessonId: string): Promise<void> {
    return apiService.delete(`/modules/${moduleId}/lessons/${lessonId}`);
  }

  // Reviews
  async getCourseReviews(courseId: string, page = 1, limit = 10): Promise<{ reviews: ReviewWithUser[]; total: number }> {
    return apiService.get<{ reviews: ReviewWithUser[]; total: number }>(`/courses/${courseId}/reviews?page=${page}&limit=${limit}`);
  }

  async createReview(courseId: string, rating: number, comment?: string): Promise<Review> {
    return apiService.post<Review>('/reviews', {
      courseId,
      rating,
      comment,
    });
  }

  async updateReview(reviewId: string, rating: number, comment?: string): Promise<Review> {
    return apiService.patch<Review>(`/reviews/${reviewId}`, {
      rating,
      comment,
    });
  }

  async deleteReview(reviewId: string): Promise<void> {
    return apiService.delete(`/reviews/${reviewId}`);
  }

  // File uploads
  async uploadThumbnail(courseId: string, file: File): Promise<{ url: string }> {
    return apiService.uploadFile(`/uploads/course/${courseId}/thumbnail`, file);
  }

  async uploadVideo(file: File): Promise<{ url: string; duration?: number }> {
    return apiService.uploadFile('/uploads/video', file);
  }

  async uploadDocument(file: File): Promise<{ url: string }> {
    return apiService.uploadFile('/uploads/document', file);
  }
}

export const courseService = new CourseService();
