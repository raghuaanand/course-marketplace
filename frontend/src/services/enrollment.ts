import { Enrollment, EnrollmentStatus } from '@course-marketplace/shared';
import { apiService } from './api';

export interface EnrollmentProgress {
  courseId: string;
  lessonId: string;
  completed: boolean;
  timeSpent?: number;
}

export interface EnrollmentFilters {
  status?: EnrollmentStatus;
  courseId?: string;
  page?: number;
  limit?: number;
}

class EnrollmentService {
  async getEnrollments(filters?: EnrollmentFilters): Promise<{
    enrollments: Enrollment[];
    total: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    return apiService.get(`/enrollments?${params.toString()}`);
  }

  async getEnrollment(enrollmentId: string): Promise<Enrollment> {
    return apiService.get<Enrollment>(`/enrollments/${enrollmentId}`);
  }

  async getEnrollmentByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    try {
      return await apiService.get<Enrollment>(`/enrollments/user/${userId}/course/${courseId}`);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number } };
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  async enrollInCourse(courseId: string): Promise<Enrollment> {
    return apiService.post<Enrollment>('/enrollments', { courseId });
  }

  async updateProgress(enrollmentId: string, progress: number): Promise<Enrollment> {
    return apiService.patch<Enrollment>(`/enrollments/${enrollmentId}/progress`, {
      progress,
    });
  }

  async markLessonComplete(enrollmentId: string, lessonId: string): Promise<void> {
    return apiService.post(`/enrollments/${enrollmentId}/lessons/${lessonId}/complete`);
  }

  async markLessonIncomplete(enrollmentId: string, lessonId: string): Promise<void> {
    return apiService.post(`/enrollments/${enrollmentId}/lessons/${lessonId}/incomplete`);
  }

  async updateLastAccessed(enrollmentId: string): Promise<void> {
    return apiService.patch(`/enrollments/${enrollmentId}/last-accessed`);
  }

  async completeEnrollment(enrollmentId: string): Promise<Enrollment> {
    return apiService.patch<Enrollment>(`/enrollments/${enrollmentId}/complete`);
  }

  async cancelEnrollment(enrollmentId: string): Promise<Enrollment> {
    return apiService.patch<Enrollment>(`/enrollments/${enrollmentId}/cancel`);
  }

  async generateCertificate(enrollmentId: string): Promise<{ certificateUrl: string }> {
    return apiService.post(`/enrollments/${enrollmentId}/certificate`);
  }

  async downloadCertificate(enrollmentId: string): Promise<Blob> {
    const response = await apiService.get(`/enrollments/${enrollmentId}/certificate/download`, {
      responseType: 'blob',
    });
    return response as unknown as Blob;
  }

  // Check if user is enrolled in a course
  async isEnrolled(courseId: string): Promise<boolean> {
    try {
      const response = await apiService.get(`/enrollments/check/${courseId}`) as { enrolled: boolean };
      return response.enrolled;
    } catch {
      return false;
    }
  }

  // Get enrollment progress for a specific course
  async getCourseProgress(courseId: string): Promise<{
    enrollment: Enrollment;
    completedLessons: string[];
    totalLessons: number;
    progressPercentage: number;
  }> {
    return apiService.get(`/enrollments/course/${courseId}/progress`);
  }

  // Get all enrollments for the current user
  async getMyEnrollments(status?: EnrollmentStatus): Promise<Enrollment[]> {
    const params = status ? `?status=${status}` : '';
    return apiService.get<Enrollment[]>(`/enrollments/my${params}`);
  }

  // Get enrollment statistics
  async getEnrollmentStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  }> {
    return apiService.get('/enrollments/stats');
  }
}

export const enrollmentService = new EnrollmentService();
