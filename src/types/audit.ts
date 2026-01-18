/**
 * Tipos para o sistema de auditoria da AGERJI
 * 
 * NOTA: Esta estrutura está preparada para implementação futura.
 * Os relatórios de auditoria serão implementados quando as funcionalidades
 * estiverem devidamente regulamentadas.
 */

// Tipos de ações que podem ser auditadas
export type AuditAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'download'
  | 'login'
  | 'logout'
  | 'export'
  | 'import';

// Tipos de entidades que podem ser auditadas
export type AuditEntity = 
  | 'document'
  | 'news'
  | 'event'
  | 'user'
  | 'report'
  | 'system';

// Interface para log de auditoria
export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  action: AuditAction;
  entity: AuditEntity;
  entity_id: string | null;
  entity_title: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// Interface para relatório de auditoria
export interface AuditReport {
  id: string;
  title: string;
  description: string | null;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  period_start: string;
  period_end: string;
  generated_by: string;
  generated_at: string;
  data: AuditReportData;
  status: 'pending' | 'generating' | 'completed' | 'failed';
}

// Dados do relatório de auditoria
export interface AuditReportData {
  summary: {
    total_actions: number;
    total_users_active: number;
    total_documents_created: number;
    total_documents_updated: number;
    total_documents_deleted: number;
    total_news_created: number;
    total_events_created: number;
    total_logins: number;
  };
  actions_by_user: Array<{
    user_id: string;
    user_name: string;
    user_email: string;
    action_count: number;
    actions: Record<AuditAction, number>;
  }>;
  actions_by_entity: Array<{
    entity: AuditEntity;
    action_count: number;
    actions: Record<AuditAction, number>;
  }>;
  actions_by_day: Array<{
    date: string;
    action_count: number;
  }>;
  recent_activities: AuditLog[];
}

// Filtros para consulta de auditoria
export interface AuditFilters {
  user_id?: string;
  action?: AuditAction;
  entity?: AuditEntity;
  entity_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

// Configurações de auditoria
export interface AuditConfig {
  enabled: boolean;
  retention_days: number;
  log_views: boolean;
  log_downloads: boolean;
  auto_reports: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  notify_on_critical: boolean;
  critical_actions: AuditAction[];
}

// Funções de auditoria planejadas (stubs para implementação futura)
export const AUDIT_FEATURES_PLANNED = [
  {
    feature: 'Logs de Acesso',
    description: 'Registro detalhado de todos os acessos ao sistema',
    status: 'planned',
    priority: 'high',
  },
  {
    feature: 'Histórico de Alterações',
    description: 'Rastreamento de todas as alterações em documentos e registros',
    status: 'planned',
    priority: 'high',
  },
  {
    feature: 'Relatório por Usuário',
    description: 'Relatório detalhado de atividades por usuário',
    status: 'planned',
    priority: 'medium',
  },
  {
    feature: 'Exportação PDF/Excel',
    description: 'Exportação de relatórios em múltiplos formatos',
    status: 'planned',
    priority: 'medium',
  },
  {
    feature: 'Agendamento Automático',
    description: 'Geração automática de relatórios periódicos',
    status: 'planned',
    priority: 'low',
  },
  {
    feature: 'Alertas de Segurança',
    description: 'Notificações para ações críticas ou suspeitas',
    status: 'planned',
    priority: 'high',
  },
  {
    feature: 'Dashboard de Auditoria',
    description: 'Painel visual com métricas e gráficos de auditoria',
    status: 'planned',
    priority: 'medium',
  },
];

// SQL para criação da tabela de auditoria (para referência futura)
export const AUDIT_TABLE_SQL = `
-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id),
  user_email TEXT NOT NULL,
  user_name TEXT,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view', 'download', 'login', 'logout', 'export', 'import')),
  entity TEXT NOT NULL CHECK (entity IN ('document', 'news', 'event', 'user', 'report', 'system')),
  entity_id UUID,
  entity_title TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Tabela de relatórios de auditoria
CREATE TABLE IF NOT EXISTS audit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'custom')),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  generated_by UUID REFERENCES admin_users(id),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed'))
);

-- Política de RLS (Row Level Security)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_reports ENABLE ROW LEVEL SECURITY;

-- Apenas super_admin pode ver logs de auditoria
CREATE POLICY audit_logs_policy ON audit_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );
`;
