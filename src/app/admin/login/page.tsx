'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verificar se o usuário existe na tabela admin_users
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (adminError || !adminUser) {
        setError('Email não autorizado. Contate o administrador.');
        setLoading(false);
        return;
      }

      // Verificar a senha (para simplicidade, usando uma senha fixa por usuário)
      // Em produção, deve-se usar Supabase Auth com hash de senha
      const validPasswords: Record<string, string> = {
        'contato@dataro-it.com.br': '@D4taR1x',
      };

      // Se o email tem senha cadastrada, verificar
      if (validPasswords[email]) {
        if (password !== validPasswords[email]) {
          setError('Senha incorreta. Tente novamente.');
          setLoading(false);
          return;
        }
      } else {
        // Para outros usuários, aceitar qualquer senha (temporário)
        // Em produção, implementar Supabase Auth
        if (password.length < 6) {
          setError('Senha deve ter pelo menos 6 caracteres.');
          setLoading(false);
          return;
        }
      }

      // Login bem-sucedido - salvar no localStorage
      localStorage.setItem('adminEmail', adminUser.email);
      localStorage.setItem('adminName', adminUser.name);
      localStorage.setItem('adminRole', adminUser.role);
      localStorage.setItem('adminId', adminUser.id);

      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-900 flex flex-col">
      {/* Header com logos */}
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/agerji-logo.png"
            alt="AGERJI"
            width={60}
            height={60}
            className="h-12 w-auto"
          />
          <div className="text-white">
            <h1 className="text-lg font-bold">AGERJI</h1>
            <p className="text-xs text-white/80">Agência Reguladora de Ji-Paraná</p>
          </div>
        </Link>
        <Image
          src="/prefeitura-logo.png"
          alt="Prefeitura de Ji-Paraná"
          width={50}
          height={50}
          className="h-10 w-auto"
        />
      </header>

      {/* Formulário de Login */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4">
                <Image
                  src="/agerji-logo.png"
                  alt="AGERJI"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Área Administrativa</h2>
              <p className="text-gray-600 mt-2">Acesso restrito aos gestores da AGERJI</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="seu.email@agerji.gov.br"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end">
                <Link
                  href="/admin/recuperar-senha"
                  className="text-sm text-green-700 hover:text-green-800 hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-green-700 hover:text-green-800 text-sm font-medium">
                ← Voltar ao site principal
              </Link>
            </div>

            {/* Mensagem LGPD */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                🔒 Todos os dados coletados respeitam às normas da LGPD (Lei Geral de Proteção de Dados).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-white/70 text-sm">
        <p>© {new Date().getFullYear()} AGERJI - Agência Reguladora de Ji-Paraná</p>
        <p className="mt-1">Todos os Direitos Reservados</p>
        <p className="mt-2 text-xs text-white/50">
          Desenvolvido por DATA-RO INTELIGÊNCIA TERRITORIAL
        </p>
      </footer>
    </div>
  );
}
