import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Course } from '@course-marketplace/shared';

export interface CartItem {
  course: Course;
  price: number;
  discountPrice?: number;
}

interface CartState {
  items: CartItem[];
  
  // Actions
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalSavings: () => number;
  isInCart: (courseId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addToCart: (course) => {
          const { items, isInCart } = get();
          
          if (isInCart(course.id)) {
            return; // Already in cart
          }

          const cartItem: CartItem = {
            course,
            price: course.price,
            discountPrice: course.discountPrice,
          };

          set(
            { items: [...items, cartItem] },
            false,
            'addToCart'
          );
        },

        removeFromCart: (courseId) => {
          const { items } = get();
          set(
            { items: items.filter(item => item.course.id !== courseId) },
            false,
            'removeFromCart'
          );
        },

        clearCart: () => {
          set(
            { items: [] },
            false,
            'clearCart'
          );
        },

        getTotalItems: () => {
          const { items } = get();
          return items.length;
        },

        getTotalPrice: () => {
          const { items } = get();
          return items.reduce((total, item) => {
            const price = item.discountPrice || item.price;
            return total + price;
          }, 0);
        },

        getTotalSavings: () => {
          const { items } = get();
          return items.reduce((savings, item) => {
            if (item.discountPrice) {
              return savings + (item.price - item.discountPrice);
            }
            return savings;
          }, 0);
        },

        isInCart: (courseId) => {
          const { items } = get();
          return items.some(item => item.course.id === courseId);
        },
      }),
      {
        name: 'cart-storage',
      }
    ),
    {
      name: 'cart-store',
    }
  )
);
