// Polyfill for broken localStorage in Node.js SSR environment
// This fixes issues where localStorage exists but methods are not functions

if (typeof global !== 'undefined') {
  // Server-side: ensure localStorage doesn't break SSR
  const noopStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };

  // Check if we're in a broken localStorage environment
  if (typeof (global as any).localStorage !== 'undefined') {
    const ls = (global as any).localStorage;
    if (typeof ls.getItem !== 'function') {
      // Replace broken localStorage with noop
      (global as any).localStorage = noopStorage;
    }
  }
}

export {};


