import { useSession, signIn, signOut } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const user = session?.user || null;
  const isAuthenticated = !!user;
  const isLoading = status === 'loading';

  return {
    user,
    isAuthenticated,
    isLoading,
    login: signIn,
    logout: signOut,
  };
};
