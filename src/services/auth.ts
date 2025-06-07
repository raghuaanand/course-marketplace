// Authentication is now handled entirely by NextAuth.js
// This service is only kept for API calls that still reference it

import { FrontendUser, UserRole } from '@/types';
import { apiService } from './api';
import { useAuthStore } from '@/store/auth';

// Keeping these interfaces for backward compatibility
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  user: FrontendUser;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

class AuthService {
  // Deprecated methods - should use NextAuth instead
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    throw new Error('Please use NextAuth login via signIn() function');
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    throw new Error('Please use NextAuth registration');
  }

  async logout(): Promise<void> {
    // NextAuth handles logout, just clear any remaining local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return apiService.post('/auth/forgot-password', data);
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return apiService.post('/auth/reset-password', data);
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiService.post('/auth/verify-email', { token });
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    return apiService.post('/auth/resend-verification', { email });
  }

  async getCurrentUser(): Promise<FrontendUser> {
    const response = await apiService.get<{ success: boolean; data: FrontendUser }>('/auth/me');
    return response.data;
  }

  async updateProfile(data: Partial<FrontendUser>): Promise<FrontendUser> {
    return apiService.patch<FrontendUser>('/users/profile', data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiService.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Utility methods - now delegate to Zustand store
  getStoredUser(): FrontendUser | null {
    return useAuthStore.getState().user;
  }

  getAccessToken(): string | null {
    // No longer using JWT tokens
    return null;
  }

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  }

  hasRole(role: UserRole): boolean {
    return useAuthStore.getState().hasRole(role);
  }

  isAdmin(): boolean {
    return useAuthStore.getState().isAdmin();
  }

  isInstructor(): boolean {
    return useAuthStore.getState().isInstructor();
  }

  isStudent(): boolean {
    return useAuthStore.getState().isStudent();
  }
}

export const authService = new AuthService();
