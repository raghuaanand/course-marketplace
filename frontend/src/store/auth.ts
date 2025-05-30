import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, UserRole } from '@course-marketplace/shared';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isInstructor: () => boolean;
  isStudent: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,

        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
            },
            false,
            'setUser'
          ),

        updateUser: (updates) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...updates } : null,
            }),
            false,
            'updateUser'
          ),

        setLoading: (isLoading) =>
          set(
            { isLoading },
            false,
            'setLoading'
          ),

        logout: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
            },
            false,
            'logout'
          ),

        hasRole: (role) => {
          const { user } = get();
          return user?.role === role;
        },

        isAdmin: () => {
          const { hasRole } = get();
          return hasRole(UserRole.ADMIN);
        },

        isInstructor: () => {
          const { hasRole } = get();
          return hasRole(UserRole.INSTRUCTOR);
        },

        isStudent: () => {
          const { hasRole } = get();
          return hasRole(UserRole.STUDENT);
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);
