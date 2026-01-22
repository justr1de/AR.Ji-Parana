// =====================================================
// TIPOS PARA O GABINETE AGERJI - SISTEMA DE PROVIDÊNCIAS
// =====================================================

// Tipo para Gabinete
export interface Gabinete {
  id: string
  nome: string
  slug?: string
  
  // Informações da agência
  tipo: 'agencia_reguladora' | 'gabinete' | 'secretaria' | 'autarquia'
  
  // Localização
  uf?: string
  municipio?: string
  endereco?: string
  
  // Contatos
  telefone?: string
  email?: string
  
  // Configurações
  logo_url?: string
  settings?: Record<string, unknown>
  
  // Status
  ativo: boolean
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  gabinete_id: string
  nome: string
  email: string
  telefone?: string
  cargo?: string
  role: 'super_admin' | 'admin' | 'gestor' | 'assessor' | 'operador' | 'visualizador'
  avatar_url?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Cidadao {
  id: string
  gabinete_id: string
  nome: string
  cpf?: string
  rg?: string
  data_nascimento?: string
  genero?: string
  email?: string
  telefone?: string
  celular?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  uf?: string
  observacoes?: string
  created_at: string
  updated_at: string
}

export interface Orgao {
  id: string
  gabinete_id: string
  nome: string
  tipo: 'secretaria_municipal' | 'secretaria_estadual' | 'autarquia_municipal' | 'autarquia_estadual' | 'autarquia_federal' | 'mp_estadual' | 'mp_federal' | 'tribunal_justica' | 'tribunal_contas_estadual' | 'tribunal_contas_federal' | 'policia_federal' | 'defensoria' | 'camara_municipal' | 'prefeitura' | 'outros'
  esfera: 'municipal' | 'estadual' | 'federal'
  sigla?: string
  email?: string
  telefone?: string
  endereco?: string
  responsavel?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Categoria {
  id: string
  gabinete_id: string
  nome: string
  descricao?: string
  cor: string
  icone?: string
  ativo: boolean
  created_at: string
}

export interface Providencia {
  id: string
  gabinete_id: string
  numero_protocolo: string
  cidadao_id?: string
  categoria_id?: string
  orgao_destino_id?: string
  usuario_responsavel_id?: string
  titulo: string
  descricao: string
  localizacao_tipo?: 'bairro' | 'rua' | 'regiao' | 'especifico'
  localizacao_descricao?: string
  latitude?: number
  longitude?: number
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  status: 'pendente' | 'em_analise' | 'encaminhado' | 'em_andamento' | 'concluido' | 'arquivado'
  prazo_estimado?: string
  data_encaminhamento?: string
  data_conclusao?: string
  observacoes_internas?: string
  created_at: string
  updated_at: string
  // Relations
  cidadao?: Cidadao
  categoria?: Categoria
  orgao_destino?: Orgao
  usuario_responsavel?: User
}

export interface Andamento {
  id: string
  providencia_id: string
  usuario_id?: string
  tipo: 'criacao' | 'atualizacao' | 'encaminhamento' | 'resposta' | 'conclusao' | 'comentario'
  descricao: string
  dados_anteriores?: Record<string, unknown>
  dados_novos?: Record<string, unknown>
  created_at: string
  usuario?: User
}

export interface Anexo {
  id: string
  providencia_id: string
  nome: string
  tipo: 'imagem' | 'video' | 'documento' | 'audio'
  mime_type?: string
  tamanho_bytes?: number
  url: string
  descricao?: string
  created_at: string
}

export interface Notificacao {
  id: string
  gabinete_id: string
  usuario_id?: string
  providencia_id?: string
  tipo: 'nova_providencia' | 'atualizacao' | 'prazo_proximo' | 'prazo_vencido' | 'resposta' | 'info' | 'alerta' | 'prazo' | 'sucesso'
  titulo: string
  mensagem?: string
  lida: boolean
  enviado_email: boolean
  enviado_push: boolean
  created_at: string
}

export interface DashboardStats {
  gabinete_id: string
  total_providencias: number
  pendentes: number
  em_analise: number
  encaminhadas: number
  em_andamento: number
  concluidas: number
  arquivadas: number
  urgentes: number
  atrasadas: number
  este_mes: number
}

// =====================================================
// TIPOS PARA LABELS E CORES
// =====================================================

export const tipoOrgaoLabels: Record<string, string> = {
  secretaria_municipal: 'Secretaria Municipal',
  secretaria_estadual: 'Secretaria Estadual',
  autarquia_municipal: 'Autarquia Municipal',
  autarquia_estadual: 'Autarquia Estadual',
  autarquia_federal: 'Autarquia Federal',
  mp_estadual: 'Ministério Público Estadual',
  mp_federal: 'Ministério Público Federal',
  tribunal_justica: 'Tribunal de Justiça',
  tribunal_contas_estadual: 'Tribunal de Contas Estadual',
  tribunal_contas_federal: 'Tribunal de Contas da União',
  policia_federal: 'Polícia Federal',
  defensoria: 'Defensoria Pública',
  camara_municipal: 'Câmara Municipal',
  prefeitura: 'Prefeitura Municipal',
  outros: 'Outros',
}

export const esferaLabels: Record<string, string> = {
  municipal: 'Municipal',
  estadual: 'Estadual',
  federal: 'Federal',
}

export const esferaColors: Record<string, { bg: string; text: string }> = {
  municipal: { bg: '#dcfce7', text: '#166534' },
  estadual: { bg: '#dbeafe', text: '#1e40af' },
  federal: { bg: '#fef3c7', text: '#92400e' },
}

export const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  em_analise: 'Em Análise',
  encaminhado: 'Encaminhado',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  arquivado: 'Arquivado',
}

export const statusColors: Record<string, { bg: string; text: string }> = {
  pendente: { bg: '#fef3c7', text: '#92400e' },
  em_analise: { bg: '#dbeafe', text: '#1e40af' },
  encaminhado: { bg: '#e0e7ff', text: '#3730a3' },
  em_andamento: { bg: '#cffafe', text: '#0e7490' },
  concluido: { bg: '#dcfce7', text: '#166534' },
  arquivado: { bg: '#f3f4f6', text: '#374151' },
}

export const prioridadeLabels: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
}

export const prioridadeColors: Record<string, { bg: string; text: string }> = {
  baixa: { bg: '#dcfce7', text: '#166534' },
  media: { bg: '#fef3c7', text: '#92400e' },
  alta: { bg: '#fed7aa', text: '#9a3412' },
  urgente: { bg: '#fecaca', text: '#991b1b' },
}
