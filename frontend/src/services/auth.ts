import { User, UserRole } from '@course-marketplace/shared';
import { apiService } from './api';

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
  user: User;
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
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch {
      // Ignore logout errors
    }
    
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiService.patch<User>('/auth/profile', data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiService.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Utility methods
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  hasRole(role: UserRole): boolean {
    const user = this.getStoredUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isInstructor(): boolean {
    return this.hasRole(UserRole.INSTRUCTOR);
  }

  isStudent(): boolean {
    return this.hasRole(UserRole.STUDENT);
  }
}

export const authService = new AuthService();
