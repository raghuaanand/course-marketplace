'use client';

import { useEffect } from 'react';
import { hydrateAuthState } from '@/store/auth';
import { hydrateCartState } from '@/store/cart';

export function StoreHydration() {
  useEffect(() => {
    // Hydrate stores from localStorage on client-side mount
    hydrateAuthState();
    hydrateCartState();
  }, []);

  return null;
}
