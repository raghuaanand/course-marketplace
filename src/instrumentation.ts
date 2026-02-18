export async function register() {
  // Fix broken localStorage in Node.js SSR environment
  // This runs before any other code during server startup
  
  if (typeof global !== 'undefined' && process.env.NODE_ENV !== 'production') {
    const noopStorage = {
      getItem: (_key: string): string | null => null,
      setItem: (_key: string, _value: string): void => {},
      removeItem: (_key: string): void => {},
      clear: (): void => {},
      key: (_index: number): string | null => null,
      length: 0,
    };

    // Check if localStorage exists but is broken
    const ls = (global as any).localStorage;
    if (ls !== undefined && ls !== null) {
      if (typeof ls.getItem !== 'function') {
        // Replace broken localStorage with noop implementation
        (global as any).localStorage = noopStorage;
        console.log('[Instrumentation] Fixed broken localStorage');
      }
    }
  }
}


