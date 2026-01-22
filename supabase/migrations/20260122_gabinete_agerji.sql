-- =============================================================================
-- GABINETE AGERJI - Agência Reguladora de Ji-Paraná
-- Script de criação das tabelas para o sistema de providências
-- =============================================================================

-- Tabela de Órgãos
CREATE TABLE IF NOT EXISTS agerji_orgaos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  sigla VARCHAR(50),
  tipo VARCHAR(100) NOT NULL,
  esfera VARCHAR(20) NOT NULL CHECK (esfera IN ('municipal', 'estadual', 'federal')),
  email VARCHAR(255),
  telefone VARCHAR(50),
  endereco TEXT,
  responsavel VARCHAR(255),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cidadãos
CREATE TABLE IF NOT EXISTS agerji_cidadaos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14),
  rg VARCHAR(50),
  data_nascimento DATE,
  genero VARCHAR(20),
  email VARCHAR(255),
  telefone VARCHAR(50),
  celular VARCHAR(50),
  cep VARCHAR(10),
  endereco VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100) DEFAULT 'Ji-Paraná',
  uf VARCHAR(2) DEFAULT 'RO',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS agerji_categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#22c55e',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Providências
CREATE TABLE IF NOT EXISTS agerji_providencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_protocolo VARCHAR(50) NOT NULL UNIQUE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'encaminhado', 'em_andamento', 'concluido', 'arquivado')),
  prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  cidadao_id UUID REFERENCES agerji_cidadaos(id) ON DELETE SET NULL,
  orgao_destino_id UUID REFERENCES agerji_orgaos(id) ON DELETE SET NULL,
  categoria_id UUID REFERENCES agerji_categorias(id) ON DELETE SET NULL,
  localizacao_descricao TEXT,
  localizacao_lat DECIMAL(10, 8),
  localizacao_lng DECIMAL(11, 8),
  data_limite DATE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  observacoes_internas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Histórico de Providências
CREATE TABLE IF NOT EXISTS agerji_providencias_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  providencia_id UUID NOT NULL REFERENCES agerji_providencias(id) ON DELETE CASCADE,
  status_anterior VARCHAR(50),
  status_novo VARCHAR(50),
  descricao TEXT,
  usuario_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Anexos de Providências
CREATE TABLE IF NOT EXISTS agerji_providencias_anexos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  providencia_id UUID NOT NULL REFERENCES agerji_providencias(id) ON DELETE CASCADE,
  nome_arquivo VARCHAR(255) NOT NULL,
  tipo_arquivo VARCHAR(100),
  tamanho_bytes BIGINT,
  url_arquivo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ÍNDICES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_agerji_orgaos_esfera ON agerji_orgaos(esfera);
CREATE INDEX IF NOT EXISTS idx_agerji_orgaos_ativo ON agerji_orgaos(ativo);
CREATE INDEX IF NOT EXISTS idx_agerji_cidadaos_nome ON agerji_cidadaos(nome);
CREATE INDEX IF NOT EXISTS idx_agerji_cidadaos_cpf ON agerji_cidadaos(cpf);
CREATE INDEX IF NOT EXISTS idx_agerji_providencias_status ON agerji_providencias(status);
CREATE INDEX IF NOT EXISTS idx_agerji_providencias_prioridade ON agerji_providencias(prioridade);
CREATE INDEX IF NOT EXISTS idx_agerji_providencias_protocolo ON agerji_providencias(numero_protocolo);
CREATE INDEX IF NOT EXISTS idx_agerji_providencias_created ON agerji_providencias(created_at);
CREATE INDEX IF NOT EXISTS idx_agerji_providencias_cidadao ON agerji_providencias(cidadao_id);
CREATE INDEX IF NOT EXISTS idx_agerji_providencias_orgao ON agerji_providencias(orgao_destino_id);

-- =============================================================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_agerji_orgaos_updated_at ON agerji_orgaos;
CREATE TRIGGER update_agerji_orgaos_updated_at
    BEFORE UPDATE ON agerji_orgaos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agerji_cidadaos_updated_at ON agerji_cidadaos;
CREATE TRIGGER update_agerji_cidadaos_updated_at
    BEFORE UPDATE ON agerji_cidadaos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agerji_categorias_updated_at ON agerji_categorias;
CREATE TRIGGER update_agerji_categorias_updated_at
    BEFORE UPDATE ON agerji_categorias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agerji_providencias_updated_at ON agerji_providencias;
CREATE TRIGGER update_agerji_providencias_updated_at
    BEFORE UPDATE ON agerji_providencias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- DADOS INICIAIS - ÓRGÃOS
-- =============================================================================

-- Órgãos Municipais de Ji-Paraná
INSERT INTO agerji_orgaos (nome, sigla, tipo, esfera, email, telefone) VALUES
('Prefeitura Municipal de Ji-Paraná', 'PMJP', 'prefeitura', 'municipal', 'gabinete@ji-parana.ro.gov.br', '(69) 3416-4000'),
('Câmara Municipal de Ji-Paraná', 'CMJP', 'camara_municipal', 'municipal', 'contato@camarajiparana.ro.gov.br', '(69) 3421-1818'),
('Secretaria Municipal de Saúde', 'SEMUSA', 'secretaria_municipal', 'municipal', 'saude@ji-parana.ro.gov.br', '(69) 3416-4100'),
('Secretaria Municipal de Educação', 'SEMED', 'secretaria_municipal', 'municipal', 'educacao@ji-parana.ro.gov.br', '(69) 3416-4200'),
('Secretaria Municipal de Obras', 'SEMOSP', 'secretaria_municipal', 'municipal', 'obras@ji-parana.ro.gov.br', '(69) 3416-4300'),
('Secretaria Municipal de Meio Ambiente', 'SEMEIA', 'secretaria_municipal', 'municipal', 'meioambiente@ji-parana.ro.gov.br', '(69) 3416-4400'),
('Secretaria Municipal de Assistência Social', 'SEMAS', 'secretaria_municipal', 'municipal', 'assistenciasocial@ji-parana.ro.gov.br', '(69) 3416-4500'),
('Secretaria Municipal de Fazenda', 'SEMFAZ', 'secretaria_municipal', 'municipal', 'fazenda@ji-parana.ro.gov.br', '(69) 3416-4600'),
('Secretaria Municipal de Agricultura', 'SEMAGRI', 'secretaria_municipal', 'municipal', 'agricultura@ji-parana.ro.gov.br', '(69) 3416-4700'),
('Secretaria Municipal de Esportes e Lazer', 'SEMEL', 'secretaria_municipal', 'municipal', 'esportes@ji-parana.ro.gov.br', '(69) 3416-4800'),
('Secretaria Municipal de Cultura', 'SEMCULT', 'secretaria_municipal', 'municipal', 'cultura@ji-parana.ro.gov.br', '(69) 3416-4900'),
('Secretaria Municipal de Trânsito', 'SEMTRAN', 'secretaria_municipal', 'municipal', 'transito@ji-parana.ro.gov.br', '(69) 3416-5000'),
('Instituto de Previdência de Ji-Paraná', 'IPREJIP', 'autarquia_municipal', 'municipal', 'iprejip@ji-parana.ro.gov.br', '(69) 3421-5500'),
('Serviço Autônomo de Água e Esgoto', 'SAAE', 'autarquia_municipal', 'municipal', 'saae@ji-parana.ro.gov.br', '(69) 3421-6000')
ON CONFLICT DO NOTHING;

-- Órgãos Estaduais
INSERT INTO agerji_orgaos (nome, sigla, tipo, esfera, email, telefone) VALUES
('Companhia de Águas e Esgotos de Rondônia', 'CAERD', 'autarquia_estadual', 'estadual', 'ouvidoria@caerd.ro.gov.br', '(69) 3216-5000'),
('Ministério Público do Estado de Rondônia', 'MP-RO', 'mp_estadual', 'estadual', 'ouvidoria@mpro.mp.br', '(69) 3216-7500'),
('Tribunal de Justiça do Estado de Rondônia', 'TJ-RO', 'tribunal_justica', 'estadual', 'ouvidoria@tjro.jus.br', '(69) 3309-6000'),
('Tribunal de Contas do Estado de Rondônia', 'TCE-RO', 'tribunal_contas_estadual', 'estadual', 'ouvidoria@tce.ro.gov.br', '(69) 3211-9000'),
('Defensoria Pública do Estado de Rondônia', 'DPE-RO', 'defensoria', 'estadual', 'ouvidoria@defensoria.ro.def.br', '(69) 3216-8000'),
('Secretaria de Estado de Saúde', 'SESAU', 'secretaria_estadual', 'estadual', 'ouvidoria@sesau.ro.gov.br', '(69) 3216-5200'),
('Secretaria de Estado de Educação', 'SEDUC', 'secretaria_estadual', 'estadual', 'ouvidoria@seduc.ro.gov.br', '(69) 3216-5300'),
('Polícia Militar de Rondônia', 'PM-RO', 'autarquia_estadual', 'estadual', 'ouvidoria@pm.ro.gov.br', '190'),
('Polícia Civil de Rondônia', 'PC-RO', 'autarquia_estadual', 'estadual', 'ouvidoria@pc.ro.gov.br', '(69) 3216-7000'),
('Corpo de Bombeiros Militar de Rondônia', 'CBM-RO', 'autarquia_estadual', 'estadual', 'ouvidoria@cbm.ro.gov.br', '193'),
('Departamento Estadual de Estradas de Rodagem', 'DER-RO', 'autarquia_estadual', 'estadual', 'ouvidoria@der.ro.gov.br', '(69) 3216-6000')
ON CONFLICT DO NOTHING;

-- Órgãos Federais
INSERT INTO agerji_orgaos (nome, sigla, tipo, esfera, email, telefone) VALUES
('Ministério Público Federal', 'MPF', 'mp_federal', 'federal', 'ouvidoria@mpf.mp.br', '(69) 3217-6100'),
('Tribunal de Contas da União', 'TCU', 'tribunal_contas_federal', 'federal', 'ouvidoria@tcu.gov.br', '0800-644-1500'),
('Polícia Federal', 'PF', 'policia_federal', 'federal', 'ouvidoria@pf.gov.br', '(69) 3216-9000'),
('Instituto Nacional do Seguro Social', 'INSS', 'autarquia_federal', 'federal', 'ouvidoria@inss.gov.br', '135'),
('Receita Federal do Brasil', 'RFB', 'autarquia_federal', 'federal', 'ouvidoria@rfb.gov.br', '146'),
('Instituto Brasileiro do Meio Ambiente', 'IBAMA', 'autarquia_federal', 'federal', 'ouvidoria@ibama.gov.br', '0800-618080'),
('Caixa Econômica Federal', 'CEF', 'autarquia_federal', 'federal', 'ouvidoria@caixa.gov.br', '0800-726-0101'),
('Banco do Brasil', 'BB', 'autarquia_federal', 'federal', 'ouvidoria@bb.com.br', '0800-729-0001'),
('Agência Nacional de Energia Elétrica', 'ANEEL', 'autarquia_federal', 'federal', 'ouvidoria@aneel.gov.br', '167'),
('Agência Nacional de Telecomunicações', 'ANATEL', 'autarquia_federal', 'federal', 'ouvidoria@anatel.gov.br', '1331')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- DADOS INICIAIS - CATEGORIAS
-- =============================================================================

INSERT INTO agerji_categorias (nome, descricao, cor) VALUES
('Infraestrutura', 'Demandas relacionadas a obras, pavimentação, iluminação pública', '#f97316'),
('Saúde', 'Demandas relacionadas a atendimento médico, UBS, medicamentos', '#ef4444'),
('Educação', 'Demandas relacionadas a escolas, creches, transporte escolar', '#3b82f6'),
('Segurança', 'Demandas relacionadas a policiamento, iluminação, vigilância', '#6366f1'),
('Meio Ambiente', 'Demandas relacionadas a limpeza urbana, áreas verdes, poluição', '#22c55e'),
('Assistência Social', 'Demandas relacionadas a benefícios sociais, CRAS, CREAS', '#ec4899'),
('Saneamento', 'Demandas relacionadas a água, esgoto, drenagem', '#06b6d4'),
('Transporte', 'Demandas relacionadas a transporte público, trânsito', '#8b5cf6'),
('Habitação', 'Demandas relacionadas a moradia, regularização fundiária', '#f59e0b'),
('Outros', 'Outras demandas não classificadas', '#64748b')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =============================================================================

ALTER TABLE agerji_orgaos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agerji_cidadaos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agerji_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE agerji_providencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE agerji_providencias_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE agerji_providencias_anexos ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários autenticados
CREATE POLICY "Permitir leitura de órgãos para autenticados" ON agerji_orgaos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir todas operações em órgãos para autenticados" ON agerji_orgaos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura de cidadãos para autenticados" ON agerji_cidadaos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir todas operações em cidadãos para autenticados" ON agerji_cidadaos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura de categorias para autenticados" ON agerji_categorias
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir todas operações em categorias para autenticados" ON agerji_categorias
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura de providências para autenticados" ON agerji_providencias
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir todas operações em providências para autenticados" ON agerji_providencias
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura de histórico para autenticados" ON agerji_providencias_historico
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir todas operações em histórico para autenticados" ON agerji_providencias_historico
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura de anexos para autenticados" ON agerji_providencias_anexos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir todas operações em anexos para autenticados" ON agerji_providencias_anexos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
