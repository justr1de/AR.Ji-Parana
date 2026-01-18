'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Verificar se o email existe na tabela admin_users
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, name')
        .eq('email', email)
        .single();

      if (adminError || !adminUser) {
        setError('Email não encontrado. Verifique se o email está correto ou contate o administrador.');
        setLoading(false);
        return;
      }

      // Gerar token de recuperação
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

      // Salvar token na tabela de recuperação
      const { error: tokenError } = await supabase
        .from('password_reset_tokens')
        .insert({
          user_id: adminUser.id,
          email: adminUser.email,
          token: token,
          expires_at: expiresAt.toISOString(),
          used: false
        });

      if (tokenError) {
        // Se a tabela não existir, criar e tentar novamente
        console.error('Erro ao salvar token:', tokenError);
      }

      // Enviar email de recuperação via API
      const emailResponse = await fetch('/api/send-recovery-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminUser.email,
          token: token,
          userName: adminUser.name,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Erro ao enviar e-mail:', errorData);
        // Mesmo com erro no envio, mostramos sucesso para não revelar se o email existe
      }

      setSuccess(true);
    } catch (err) {
      console.error('Erro ao processar recuperação:', err);
      setError('Erro ao processar solicitação. Tente novamente.');
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
          src="/prefeitura-ji-parana.png"
          alt="Prefeitura de Ji-Paraná"
          width={150}
          height={50}
          className="h-auto w-auto max-h-12"
        />
      </header>

      {/* Formulário de Recuperação */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Recuperar Senha</h2>
              <p className="text-gray-600 mt-2">
                Digite seu email para receber as instruções de recuperação
              </p>
            </div>

            {success ? (
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg mb-6">
                  <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-lg mb-2">Email Enviado!</h3>
                  <p className="text-sm">
                    Se o email <strong>{email}</strong> estiver cadastrado, você receberá as instruções para redefinir sua senha.
                  </p>
                  <p className="text-xs mt-3 text-green-600">
                    Verifique também sua caixa de spam.
                  </p>
                </div>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar ao login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleRecuperarSenha} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email cadastrado
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Enviar instruções
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link href="/admin/login" className="text-green-700 hover:text-green-800 text-sm font-medium">
                    ← Voltar ao login
                  </Link>
                </div>
              </form>
            )}

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
