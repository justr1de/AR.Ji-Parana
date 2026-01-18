'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const checkAuth = () => {
      const adminEmail = localStorage.getItem('adminEmail');
      const adminName = localStorage.getItem('adminName');
      const adminRole = localStorage.getItem('adminRole');
      const adminId = localStorage.getItem('adminId');

      if (adminEmail && adminName && adminRole && adminId) {
        setUser({
          id: adminId,
          email: adminEmail,
          name: adminName,
          role: adminRole as AdminUser['role'],
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();

    // Escutar mudanças no localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signOut = () => {
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminId');
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
