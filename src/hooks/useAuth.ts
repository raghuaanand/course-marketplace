import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { authService } from '@/services/auth';
import { UserRole } from '@/types';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated() && !user) {
        setLoading(true);
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch {
          // Token might be invalid, logout
          authService.logout();
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, [user, setUser, setLoading, logout]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      logout();
    } catch {
      // Even if logout fails on server, clear local state
      logout();
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: handleLogout,
    hasRole: useAuthStore(state => state.hasRole),
    isAdmin: useAuthStore(state => state.isAdmin),
    isInstructor: useAuthStore(state => state.isInstructor),
    isStudent: useAuthStore(state => state.isStudent),
  };
};
