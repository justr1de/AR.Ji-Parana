// Tipos para o sistema de departamentos e documentos

export interface Department {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  parent_id: string | null; // Para subpastas
  order_index: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DepartmentDocument {
  id: string;
  department_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  tags: string[] | null;
  version: number;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string | null;
  category: 'oficio' | 'memorando' | 'parecer' | 'relatorio' | 'ata' | 'portaria' | 'resolucao' | 'outros';
  content: string; // HTML ou Markdown do template
  variables: string[] | null; // Variáveis que podem ser substituídas no template
  icon: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  title: string;
  description: string | null;
  type: 'atividades' | 'documentos' | 'estatisticas' | 'auditoria' | 'personalizado';
  parameters: Record<string, any> | null;
  generated_by: string | null;
  file_url: string | null;
  created_at: string;
}

// Departamentos padrão
export const DEFAULT_DEPARTMENTS: Omit<Department, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Gabinete',
    description: 'Documentos e processos do Gabinete da Direção',
    icon: 'Building2',
    color: '#1e40af',
    parent_id: null,
    order_index: 1,
    created_by: null
  },
  {
    name: 'Diretoria Técnica',
    description: 'Documentos técnicos, pareceres e análises',
    icon: 'FileText',
    color: '#059669',
    parent_id: null,
    order_index: 2,
    created_by: null
  },
  {
    name: 'Diretoria Administrativa',
    description: 'Documentos administrativos, contratos e licitações',
    icon: 'Briefcase',
    color: '#d97706',
    parent_id: null,
    order_index: 3,
    created_by: null
  },
  {
    name: 'Ouvidoria',
    description: 'Documentos da Ouvidoria, denúncias e manifestações',
    icon: 'MessageSquare',
    color: '#7c3aed',
    parent_id: null,
    order_index: 4,
    created_by: null
  }
];

// Templates de documentos padrão
export const DEFAULT_TEMPLATES: Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Ofício',
    description: 'Modelo de ofício para comunicações oficiais externas',
    category: 'oficio',
    icon: 'Mail',
    created_by: null,
    variables: ['numero', 'data', 'destinatario', 'cargo_destinatario', 'assunto', 'corpo', 'remetente', 'cargo_remetente'],
    content: `
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="/agerji-logo.png" alt="AGERJI" style="height: 80px;" />
    <h3 style="margin: 10px 0 5px;">AGÊNCIA REGULADORA DE SERVIÇOS PÚBLICOS DELEGADOS</h3>
    <h4 style="margin: 0;">DO MUNICÍPIO DE JI-PARANÁ - AGERJI</h4>
  </div>
  
  <p style="text-align: right;">Ji-Paraná/RO, {{data}}</p>
  
  <p><strong>OFÍCIO Nº {{numero}}/{{ano}}/AGERJI</strong></p>
  
  <p>
    <strong>A(o) Sr(a). {{destinatario}}</strong><br/>
    {{cargo_destinatario}}
  </p>
  
  <p><strong>Assunto:</strong> {{assunto}}</p>
  
  <p>Prezado(a) Senhor(a),</p>
  
  <div style="text-align: justify; text-indent: 2cm;">
    {{corpo}}
  </div>
  
  <p>Atenciosamente,</p>
  
  <div style="margin-top: 50px; text-align: center;">
    <p>_______________________________________</p>
    <p><strong>{{remetente}}</strong></p>
    <p>{{cargo_remetente}}</p>
  </div>
</div>
    `
  },
  {
    name: 'Memorando',
    description: 'Modelo de memorando para comunicações internas',
    category: 'memorando',
    icon: 'FileText',
    created_by: null,
    variables: ['numero', 'data', 'de', 'para', 'assunto', 'corpo'],
    content: `
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="/agerji-logo.png" alt="AGERJI" style="height: 80px;" />
    <h3 style="margin: 10px 0 5px;">AGÊNCIA REGULADORA DE SERVIÇOS PÚBLICOS DELEGADOS</h3>
    <h4 style="margin: 0;">DO MUNICÍPIO DE JI-PARANÁ - AGERJI</h4>
  </div>
  
  <p><strong>MEMORANDO Nº {{numero}}/{{ano}}/AGERJI</strong></p>
  
  <p style="text-align: right;">Ji-Paraná/RO, {{data}}</p>
  
  <table style="width: 100%; margin: 20px 0;">
    <tr><td><strong>DE:</strong></td><td>{{de}}</td></tr>
    <tr><td><strong>PARA:</strong></td><td>{{para}}</td></tr>
    <tr><td><strong>ASSUNTO:</strong></td><td>{{assunto}}</td></tr>
  </table>
  
  <div style="text-align: justify; text-indent: 2cm;">
    {{corpo}}
  </div>
  
  <p>Atenciosamente,</p>
  
  <div style="margin-top: 50px; text-align: center;">
    <p>_______________________________________</p>
    <p><strong>{{de}}</strong></p>
  </div>
</div>
    `
  },
  {
    name: 'Parecer Técnico',
    description: 'Modelo de parecer técnico para análises e avaliações',
    category: 'parecer',
    icon: 'ClipboardCheck',
    created_by: null,
    variables: ['numero', 'data', 'processo', 'interessado', 'assunto', 'relato', 'fundamentacao', 'conclusao', 'tecnico', 'cargo'],
    content: `
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="/agerji-logo.png" alt="AGERJI" style="height: 80px;" />
    <h3 style="margin: 10px 0 5px;">AGÊNCIA REGULADORA DE SERVIÇOS PÚBLICOS DELEGADOS</h3>
    <h4 style="margin: 0;">DO MUNICÍPIO DE JI-PARANÁ - AGERJI</h4>
  </div>
  
  <h2 style="text-align: center;">PARECER TÉCNICO Nº {{numero}}/{{ano}}/AGERJI</h2>
  
  <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
    <tr><td style="padding: 5px; border: 1px solid #ccc;"><strong>Processo:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">{{processo}}</td></tr>
    <tr><td style="padding: 5px; border: 1px solid #ccc;"><strong>Interessado:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">{{interessado}}</td></tr>
    <tr><td style="padding: 5px; border: 1px solid #ccc;"><strong>Assunto:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">{{assunto}}</td></tr>
  </table>
  
  <h3>I - RELATÓRIO</h3>
  <div style="text-align: justify; text-indent: 2cm;">
    {{relato}}
  </div>
  
  <h3>II - FUNDAMENTAÇÃO</h3>
  <div style="text-align: justify; text-indent: 2cm;">
    {{fundamentacao}}
  </div>
  
  <h3>III - CONCLUSÃO</h3>
  <div style="text-align: justify; text-indent: 2cm;">
    {{conclusao}}
  </div>
  
  <p style="text-align: right; margin-top: 30px;">Ji-Paraná/RO, {{data}}</p>
  
  <div style="margin-top: 50px; text-align: center;">
    <p>_______________________________________</p>
    <p><strong>{{tecnico}}</strong></p>
    <p>{{cargo}}</p>
  </div>
</div>
    `
  },
  {
    name: 'Ata de Reunião',
    description: 'Modelo de ata para registro de reuniões',
    category: 'ata',
    icon: 'Users',
    created_by: null,
    variables: ['numero', 'data', 'hora_inicio', 'hora_fim', 'local', 'participantes', 'pauta', 'deliberacoes', 'secretario'],
    content: `
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="/agerji-logo.png" alt="AGERJI" style="height: 80px;" />
    <h3 style="margin: 10px 0 5px;">AGÊNCIA REGULADORA DE SERVIÇOS PÚBLICOS DELEGADOS</h3>
    <h4 style="margin: 0;">DO MUNICÍPIO DE JI-PARANÁ - AGERJI</h4>
  </div>
  
  <h2 style="text-align: center;">ATA DE REUNIÃO Nº {{numero}}/{{ano}}</h2>
  
  <p style="text-align: justify;">
    Aos {{data}}, às {{hora_inicio}}, no(a) {{local}}, reuniram-se os seguintes participantes:
  </p>
  
  <p><strong>Participantes:</strong></p>
  <div style="margin-left: 20px;">
    {{participantes}}
  </div>
  
  <p><strong>Pauta:</strong></p>
  <div style="margin-left: 20px;">
    {{pauta}}
  </div>
  
  <p><strong>Deliberações:</strong></p>
  <div style="text-align: justify; text-indent: 2cm;">
    {{deliberacoes}}
  </div>
  
  <p style="text-align: justify;">
    Nada mais havendo a tratar, a reunião foi encerrada às {{hora_fim}}, e eu, {{secretario}}, lavrei a presente ata que, após lida e aprovada, será assinada por todos os presentes.
  </p>
  
  <div style="margin-top: 50px;">
    <p><strong>Assinaturas:</strong></p>
    <br/><br/>
    <p>_______________________________________</p>
    <br/><br/>
    <p>_______________________________________</p>
    <br/><br/>
    <p>_______________________________________</p>
  </div>
</div>
    `
  },
  {
    name: 'Portaria',
    description: 'Modelo de portaria para atos administrativos internos',
    category: 'portaria',
    icon: 'Stamp',
    created_by: null,
    variables: ['numero', 'data', 'ementa', 'considerandos', 'resolve', 'diretor', 'cargo'],
    content: `
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="/agerji-logo.png" alt="AGERJI" style="height: 80px;" />
    <h3 style="margin: 10px 0 5px;">AGÊNCIA REGULADORA DE SERVIÇOS PÚBLICOS DELEGADOS</h3>
    <h4 style="margin: 0;">DO MUNICÍPIO DE JI-PARANÁ - AGERJI</h4>
  </div>
  
  <h2 style="text-align: center;">PORTARIA Nº {{numero}}/{{ano}}/AGERJI</h2>
  
  <p style="text-align: center; font-style: italic; margin: 20px 0;">
    "{{ementa}}"
  </p>
  
  <p style="text-align: justify;">
    O DIRETOR-PRESIDENTE DA AGÊNCIA REGULADORA DE SERVIÇOS PÚBLICOS DELEGADOS DO MUNICÍPIO DE JI-PARANÁ - AGERJI, no uso de suas atribuições legais,
  </p>
  
  <div style="text-align: justify;">
    {{considerandos}}
  </div>
  
  <p style="text-align: center; font-weight: bold; margin: 20px 0;">RESOLVE:</p>
  
  <div style="text-align: justify;">
    {{resolve}}
  </div>
  
  <p style="text-align: right; margin-top: 30px;">Ji-Paraná/RO, {{data}}</p>
  
  <div style="margin-top: 50px; text-align: center;">
    <p>_______________________________________</p>
    <p><strong>{{diretor}}</strong></p>
    <p>{{cargo}}</p>
  </div>
</div>
    `
  },
  {
    name: 'Resolução',
    description: 'Modelo de resolução para atos normativos',
    category: 'resolucao',
    icon: 'Scale',
    created_by: null,
    variables: ['numero', 'data', 'ementa', 'considerandos', 'resolve', 'diretor', 'cargo'],
    content: `
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="/agerji-logo.png" alt="AGERJI" style="height: 80px;" />
    <h3 style="margin: 10px 0 5px;">AGÊNCIA REGULADORA DE SERVIÇOS PÚBLICOS DELEGADOS</h3>
    <h4 style="margin: 0;">DO MUNICÍPIO DE JI-PARANÁ - AGERJI</h4>
  </div>
  
  <h2 style="text-align: center;">RESOLUÇÃO Nº {{numero}}/{{ano}}/AGERJI</h2>
  
  <p style="text-align: center; font-style: italic; margin: 20px 0;">
    "{{ementa}}"
  </p>
  
  <p style="text-align: justify;">
    O CONSELHO DIRETOR DA AGÊNCIA REGULADORA DE SERVIÇOS PÚBLICOS DELEGADOS DO MUNICÍPIO DE JI-PARANÁ - AGERJI, no uso de suas atribuições legais conferidas pela Lei Municipal nº XXXX/XXXX,
  </p>
  
  <div style="text-align: justify;">
    {{considerandos}}
  </div>
  
  <p style="text-align: center; font-weight: bold; margin: 20px 0;">RESOLVE:</p>
  
  <div style="text-align: justify;">
    {{resolve}}
  </div>
  
  <p style="text-align: right; margin-top: 30px;">Ji-Paraná/RO, {{data}}</p>
  
  <div style="margin-top: 50px; text-align: center;">
    <p>_______________________________________</p>
    <p><strong>{{diretor}}</strong></p>
    <p>{{cargo}}</p>
  </div>
</div>
    `
  }
];
