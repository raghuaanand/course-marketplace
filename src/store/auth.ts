import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { FrontendUser, UserRole } from '@/types';

interface AuthState {
  user: FrontendUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  
  // Actions
  setUser: (user: FrontendUser | null) => void;
  updateUser: (updates: Partial<FrontendUser>) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isInstructor: () => boolean;
  isStudent: () => boolean;
  setHasHydrated: (state: boolean) => void;
}

// Check if we're in a browser with working localStorage
const canUseLocalStorage = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

const storeCreator = (set: any, get: any) => ({
  user: null as FrontendUser | null,
  isAuthenticated: false,
  isLoading: false,
  _hasHydrated: false,

  setUser: (user: FrontendUser | null) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  updateUser: (updates: Partial<FrontendUser>) =>
    set((state: AuthState) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  setLoading: (isLoading: boolean) =>
    set({ isLoading }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  hasRole: (role: UserRole) => {
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

  setHasHydrated: (state: boolean) => {
    set({ _hasHydrated: state });
  },
});

// Create store without persist for SSR, with persist for browser
const createStore = () => {
  // Always use basic store without persist to avoid SSR issues
  // Persistence is handled manually via StoreHydration component
  return create<AuthState>()(
    devtools(
      storeCreator,
      { name: 'auth-store' }
    )
  );
};

export const useAuthStore = createStore();

// Manual persistence functions for client-side use
export const persistAuthState = () => {
  if (!canUseLocalStorage()) return;
  
  const state = useAuthStore.getState();
  const toPersist = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  };
  
  try {
    window.localStorage.setItem('auth-storage', JSON.stringify({ state: toPersist, version: 0 }));
  } catch {
    // Ignore
  }
};

export const hydrateAuthState = () => {
  if (!canUseLocalStorage()) return;
  
  try {
    const stored = window.localStorage.getItem('auth-storage');
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state) {
        useAuthStore.setState({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          _hasHydrated: true,
        });
      }
    }
  } catch {
    // Ignore
  }
  
  useAuthStore.setState({ _hasHydrated: true });
};

// Subscribe to store changes and persist
if (typeof window !== 'undefined') {
  useAuthStore.subscribe((state, prevState) => {
    if (state.user !== prevState.user || state.isAuthenticated !== prevState.isAuthenticated) {
      persistAuthState();
    }
  });
}
