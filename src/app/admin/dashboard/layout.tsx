'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { AssistenteAdmin } from '@/components/AssistenteAdmin';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) => {
    const base = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
    return isActive(href) 
      ? `${base} bg-green-900 text-white font-medium` 
      : `${base} hover:bg-green-700`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white flex flex-col">
        <div className="p-4 border-b border-green-700">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Image
              src="/agerji-logo.png"
              alt="AGERJI"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div>
              <h1 className="font-bold">AGERJI</h1>
              <p className="text-xs text-green-200">Painel Administrativo</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <Link href="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </li>

            {/* Gabinete AGERJI - Destaque */}
            <li className="pt-2">
              <Link 
                href="/admin/dashboard/gabinete" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/admin/dashboard/gabinete')
                    ? 'bg-amber-600 text-white font-medium shadow-lg'
                    : 'bg-green-700/50 hover:bg-amber-600/80 border border-green-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <span className="block">Gabinete AGERJI</span>
                  <span className="text-xs opacity-75">Providências</span>
                </div>
              </Link>
            </li>
          </ul>

          {/* Separador */}
          <div className="my-4 border-t border-green-700"></div>

          {/* Menu Portal */}
          <p className="px-4 text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
            Portal Público
          </p>
          <ul className="space-y-1">
            <li>
              <Link href="/admin/dashboard/documentos" className={linkClass('/admin/dashboard/documentos')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentos
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/noticias" className={linkClass('/admin/dashboard/noticias')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Notícias
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/eventos" className={linkClass('/admin/dashboard/eventos')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Eventos
              </Link>
            </li>
          </ul>

          {/* Separador */}
          <div className="my-4 border-t border-green-700"></div>

          {/* Menu Administração */}
          <p className="px-4 text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
            Administração
          </p>
          <ul className="space-y-1">
            <li>
              <Link href="/admin/dashboard/usuarios" className={linkClass('/admin/dashboard/usuarios')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Usuários
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/departamentos" className={linkClass('/admin/dashboard/departamentos')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Departamentos
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/relatorios" className={linkClass('/admin/dashboard/relatorios')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Relatórios
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/modelos" className={linkClass('/admin/dashboard/modelos')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Modelos
              </Link>
            </li>
          </ul>

          {/* Separador */}
          <div className="my-4 border-t border-green-700"></div>

          {/* Link discreto para Sobre o Projeto */}
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin/dashboard/sobre"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-300 hover:text-white hover:bg-green-700/50 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sobre o Projeto
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-green-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">
                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name || user.email}</p>
              <p className="text-xs text-green-200">
                {user.role === 'super_admin' ? 'Super Admin' : 
                 user.role === 'admin' ? 'Administrador' : 
                 user.role === 'editor' ? 'Editor' : 'Visualizador'}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {children}
        
        {/* Assistente Administrativo - apenas na área logada */}
        <AssistenteAdmin />
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
