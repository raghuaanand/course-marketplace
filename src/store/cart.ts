import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Course, CourseWithDetails } from '@/types';

export interface CartItem {
  course: Course & {
    instructor?: {
      firstName: string;
      lastName: string;
    };
    averageRating?: number;
  };
  price: number;
  discountPrice?: number;
}

interface CartState {
  items: CartItem[];
  _hasHydrated: boolean;
  
  // Actions
  addToCart: (course: Course | CourseWithDetails) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalSavings: () => number;
  isInCart: (courseId: string) => boolean;
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
  items: [] as CartItem[],
  _hasHydrated: false,

  addToCart: (course: Course | CourseWithDetails) => {
    const { items, isInCart } = get();
    
    if (isInCart(course.id)) {
      return; // Already in cart
    }

    const cartItem: CartItem = {
      course,
      price: Number(course.price),
      discountPrice: course.discountPrice ? Number(course.discountPrice) : undefined,
    };

    set({ items: [...items, cartItem] });
  },

  removeFromCart: (courseId: string) => {
    const { items } = get();
    set({ items: items.filter((item: CartItem) => item.course.id !== courseId) });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalItems: () => {
    const { items } = get();
    return items.length;
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total: number, item: CartItem) => {
      const price = item.discountPrice || item.price;
      return total + price;
    }, 0);
  },

  getTotalSavings: () => {
    const { items } = get();
    return items.reduce((savings: number, item: CartItem) => {
      if (item.discountPrice) {
        return savings + (item.price - item.discountPrice);
      }
      return savings;
    }, 0);
  },

  isInCart: (courseId: string) => {
    const { items } = get();
    return items.some((item: CartItem) => item.course.id === courseId);
  },

  setHasHydrated: (state: boolean) => {
    set({ _hasHydrated: state });
  },
});

// Create store without persist for SSR, with manual persistence for browser
export const useCartStore = create<CartState>()(
  devtools(
    storeCreator,
    { name: 'cart-store' }
  )
);

// Manual persistence functions for client-side use
export const persistCartState = () => {
  if (!canUseLocalStorage()) return;
  
  const state = useCartStore.getState();
  const toPersist = {
    items: state.items,
  };
  
  try {
    window.localStorage.setItem('cart-storage', JSON.stringify({ state: toPersist, version: 0 }));
  } catch {
    // Ignore
  }
};

export const hydrateCartState = () => {
  if (!canUseLocalStorage()) return;
  
  try {
    const stored = window.localStorage.getItem('cart-storage');
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state && state.items) {
        useCartStore.setState({
          items: state.items,
          _hasHydrated: true,
        });
      }
    }
  } catch {
    // Ignore
  }
  
  useCartStore.setState({ _hasHydrated: true });
};

// Subscribe to store changes and persist
if (typeof window !== 'undefined') {
  useCartStore.subscribe((state, prevState) => {
    if (state.items !== prevState.items) {
      persistCartState();
    }
  });
}
