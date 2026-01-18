'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  created_at: string;
  updated_at: string;
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Administrador',
  admin: 'Administrador',
  editor: 'Editor',
  viewer: 'Visualizador',
};

const roleColors: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  editor: 'bg-green-100 text-green-800',
  viewer: 'bg-gray-100 text-gray-800',
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'viewer' as AdminUser['role'],
    password: '',
  });
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsuarios();
    checkCurrentUserRole();
  }, []);

  const checkCurrentUserRole = async () => {
    const userEmail = localStorage.getItem('adminEmail');
    if (userEmail) {
      const { data } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', userEmail)
        .single();
      if (data) {
        setCurrentUserRole(data.role);
      }
    }
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar usuários:', error);
    } else {
      setUsuarios(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (editingUser) {
      // Atualizar usuário existente
      const { error } = await supabase
        .from('admin_users')
        .update({
          name: formData.name,
          role: formData.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingUser.id);

      if (error) {
        setMessage({ type: 'error', text: 'Erro ao atualizar usuário: ' + error.message });
      } else {
        setMessage({ type: 'success', text: 'Usuário atualizado com sucesso!' });
        setShowModal(false);
        setEditingUser(null);
        resetForm();
        fetchUsuarios();
      }
    } else {
      // Criar novo usuário
      const { error } = await supabase.from('admin_users').insert({
        email: formData.email,
        name: formData.name,
        role: formData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        setMessage({ type: 'error', text: 'Erro ao criar usuário: ' + error.message });
      } else {
        setMessage({ type: 'success', text: 'Usuário criado com sucesso!' });
        setShowModal(false);
        resetForm();
        fetchUsuarios();
      }
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      password: '',
    });
    setShowModal(true);
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.role === 'super_admin') {
      setMessage({ type: 'error', text: 'Não é possível excluir um Super Administrador.' });
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
      const { error } = await supabase.from('admin_users').delete().eq('id', user.id);

      if (error) {
        setMessage({ type: 'error', text: 'Erro ao excluir usuário: ' + error.message });
      } else {
        setMessage({ type: 'success', text: 'Usuário excluído com sucesso!' });
        fetchUsuarios();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      role: 'viewer',
      password: '',
    });
    setEditingUser(null);
  };

  const openNewUserModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (currentUserRole !== 'super_admin') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Acesso Restrito</h2>
          <p className="text-red-600">
            Apenas Super Administradores podem gerenciar usuários.
          </p>
          <Link
            href="/admin/dashboard"
            className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
          <p className="text-gray-600">Gerencie os usuários com acesso ao painel administrativo</p>
        </div>
        <button
          onClick={openNewUserModal}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <span>+</span>
          Novo Usuário
        </button>
      </div>

      {message.text && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-medium">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        roleColors[user.role] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    {user.role !== 'super_admin' && (
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {usuarios.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum usuário cadastrado.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={!!editingUser}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfil de Acesso</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as AdminUser['role'] })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={editingUser?.role === 'super_admin'}
                >
                  <option value="viewer">Visualizador (apenas consulta)</option>
                  <option value="editor">Editor (pode criar/editar conteúdo)</option>
                  <option value="admin">Administrador (acesso total ao conteúdo)</option>
                  <option value="super_admin">Super Administrador (acesso irrestrito)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
