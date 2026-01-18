import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tipos de ações que o assistente pode executar
type AssistantAction = 
  | 'search_documents'
  | 'search_news'
  | 'search_events'
  | 'get_statistics'
  | 'list_recent_documents'
  | 'list_recent_news'
  | 'list_upcoming_events'
  | 'generate_report_preview'
  | 'general_query';

interface AssistantRequest {
  query: string;
  action?: AssistantAction;
  filters?: {
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  };
}

// Função para detectar a intenção do usuário
function detectIntent(query: string): AssistantAction {
  const lowerQuery = query.toLowerCase();
  
  // Busca de documentos
  if (lowerQuery.includes('documento') || lowerQuery.includes('lei') || 
      lowerQuery.includes('resolução') || lowerQuery.includes('portaria') ||
      lowerQuery.includes('buscar documento') || lowerQuery.includes('encontrar documento')) {
    return 'search_documents';
  }
  
  // Busca de notícias
  if (lowerQuery.includes('notícia') || lowerQuery.includes('publicação') ||
      lowerQuery.includes('comunicado') || lowerQuery.includes('aviso')) {
    return 'search_news';
  }
  
  // Busca de eventos
  if (lowerQuery.includes('evento') || lowerQuery.includes('audiência') ||
      lowerQuery.includes('reunião') || lowerQuery.includes('agenda') ||
      lowerQuery.includes('próximos eventos')) {
    return 'list_upcoming_events';
  }
  
  // Estatísticas
  if (lowerQuery.includes('estatística') || lowerQuery.includes('quantos') ||
      lowerQuery.includes('total') || lowerQuery.includes('resumo') ||
      lowerQuery.includes('dashboard')) {
    return 'get_statistics';
  }
  
  // Relatórios
  if (lowerQuery.includes('relatório') || lowerQuery.includes('auditoria') ||
      lowerQuery.includes('gerar relatório')) {
    return 'generate_report_preview';
  }
  
  // Documentos recentes
  if (lowerQuery.includes('recentes') && lowerQuery.includes('documento')) {
    return 'list_recent_documents';
  }
  
  // Notícias recentes
  if (lowerQuery.includes('recentes') && lowerQuery.includes('notícia')) {
    return 'list_recent_news';
  }
  
  return 'general_query';
}

// Função para buscar documentos
async function searchDocuments(query: string, filters?: AssistantRequest['filters']) {
  let queryBuilder = supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  
  if (filters?.category) {
    queryBuilder = queryBuilder.eq('category', filters.category);
  }
  
  if (filters?.limit) {
    queryBuilder = queryBuilder.limit(filters.limit);
  } else {
    queryBuilder = queryBuilder.limit(10);
  }
  
  // Busca por texto no título ou descrição
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }
  
  const { data, error } = await queryBuilder;
  
  if (error) {
    console.error('Erro ao buscar documentos:', error);
    return [];
  }
  
  return data || [];
}

// Função para buscar notícias
async function searchNews(query: string, filters?: AssistantRequest['filters']) {
  let queryBuilder = supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });
  
  if (filters?.category) {
    queryBuilder = queryBuilder.eq('category', filters.category);
  }
  
  if (filters?.limit) {
    queryBuilder = queryBuilder.limit(filters.limit);
  } else {
    queryBuilder = queryBuilder.limit(10);
  }
  
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
  }
  
  const { data, error } = await queryBuilder;
  
  if (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
  
  return data || [];
}

// Função para buscar eventos
async function searchEvents(query: string, filters?: AssistantRequest['filters']) {
  let queryBuilder = supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .order('event_date', { ascending: true });
  
  if (filters?.category) {
    queryBuilder = queryBuilder.eq('type', filters.category);
  }
  
  if (filters?.limit) {
    queryBuilder = queryBuilder.limit(filters.limit);
  } else {
    queryBuilder = queryBuilder.limit(10);
  }
  
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }
  
  const { data, error } = await queryBuilder;
  
  if (error) {
    console.error('Erro ao buscar eventos:', error);
    return [];
  }
  
  return data || [];
}

// Função para listar próximos eventos
async function listUpcomingEvents(limit: number = 5) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(limit);
  
  if (error) {
    console.error('Erro ao buscar próximos eventos:', error);
    return [];
  }
  
  return data || [];
}

// Função para obter estatísticas
async function getStatistics() {
  const [docsResult, newsResult, eventsResult, usersResult] = await Promise.all([
    supabase.from('documents').select('id, category', { count: 'exact' }),
    supabase.from('news').select('id, category', { count: 'exact' }),
    supabase.from('events').select('id, type', { count: 'exact' }),
    supabase.from('admin_users').select('id, role', { count: 'exact' }),
  ]);
  
  // Contar por categoria
  const docsByCategory: Record<string, number> = {};
  docsResult.data?.forEach((doc: any) => {
    docsByCategory[doc.category] = (docsByCategory[doc.category] || 0) + 1;
  });
  
  const newsByCategory: Record<string, number> = {};
  newsResult.data?.forEach((news: any) => {
    newsByCategory[news.category] = (newsByCategory[news.category] || 0) + 1;
  });
  
  const eventsByType: Record<string, number> = {};
  eventsResult.data?.forEach((event: any) => {
    eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
  });
  
  return {
    documents: {
      total: docsResult.count || 0,
      byCategory: docsByCategory,
    },
    news: {
      total: newsResult.count || 0,
      byCategory: newsByCategory,
    },
    events: {
      total: eventsResult.count || 0,
      byType: eventsByType,
    },
    users: {
      total: usersResult.count || 0,
    },
  };
}

// Função para gerar preview de relatório
async function generateReportPreview() {
  const stats = await getStatistics();
  const recentDocs = await searchDocuments('', { limit: 5 });
  const upcomingEvents = await listUpcomingEvents(5);
  
  return {
    generatedAt: new Date().toISOString(),
    statistics: stats,
    recentDocuments: recentDocs,
    upcomingEvents: upcomingEvents,
    auditInfo: {
      status: 'preview',
      message: 'Funcionalidade de auditoria completa será implementada em breve. Este é um preview do relatório.',
      plannedFeatures: [
        'Logs de acesso detalhados',
        'Histórico de alterações em documentos',
        'Relatório de atividades por usuário',
        'Exportação em PDF e Excel',
        'Agendamento automático de relatórios',
      ],
    },
  };
}

// Função para formatar resposta do assistente
function formatResponse(action: AssistantAction, data: any, query: string): string {
  switch (action) {
    case 'search_documents':
      if (data.length === 0) {
        return `Não encontrei documentos relacionados a "${query}". Tente usar termos diferentes ou verifique se o documento foi publicado.`;
      }
      let docsResponse = `📄 **Encontrei ${data.length} documento(s):**\n\n`;
      data.forEach((doc: any, index: number) => {
        const categoryLabel = {
          lei: '⚖️ Lei',
          resolucao: '📋 Resolução',
          relatorio: '📊 Relatório',
          audiencia: '👥 Audiência',
          outros: '📁 Outros',
        }[doc.category] || doc.category;
        docsResponse += `${index + 1}. **${doc.title}**\n   ${categoryLabel} | ${new Date(doc.created_at).toLocaleDateString('pt-BR')}\n`;
        if (doc.description) {
          docsResponse += `   ${doc.description.substring(0, 100)}...\n`;
        }
        docsResponse += '\n';
      });
      return docsResponse;
    
    case 'search_news':
      if (data.length === 0) {
        return `Não encontrei notícias relacionadas a "${query}".`;
      }
      let newsResponse = `📰 **Encontrei ${data.length} notícia(s):**\n\n`;
      data.forEach((news: any, index: number) => {
        newsResponse += `${index + 1}. **${news.title}**\n   ${new Date(news.published_at || news.created_at).toLocaleDateString('pt-BR')}\n`;
        if (news.excerpt) {
          newsResponse += `   ${news.excerpt.substring(0, 100)}...\n`;
        }
        newsResponse += '\n';
      });
      return newsResponse;
    
    case 'list_upcoming_events':
      if (data.length === 0) {
        return `Não há eventos programados para os próximos dias.`;
      }
      let eventsResponse = `📅 **Próximos eventos:**\n\n`;
      data.forEach((event: any, index: number) => {
        const typeLabel = {
          reuniao: '🤝 Reunião',
          audiencia: '👥 Audiência Pública',
          consulta: '📝 Consulta Pública',
          evento: '🎯 Evento',
        }[event.type] || event.type;
        eventsResponse += `${index + 1}. **${event.title}**\n   ${typeLabel}\n   📆 ${new Date(event.event_date).toLocaleDateString('pt-BR')}`;
        if (event.start_time) {
          eventsResponse += ` às ${event.start_time}`;
        }
        if (event.location) {
          eventsResponse += `\n   📍 ${event.location}`;
        }
        eventsResponse += '\n\n';
      });
      return eventsResponse;
    
    case 'get_statistics':
      return `📊 **Estatísticas do Sistema:**\n\n` +
        `**Documentos:** ${data.documents.total} total\n` +
        Object.entries(data.documents.byCategory).map(([cat, count]) => `  • ${cat}: ${count}`).join('\n') + '\n\n' +
        `**Notícias:** ${data.news.total} total\n` +
        Object.entries(data.news.byCategory).map(([cat, count]) => `  • ${cat}: ${count}`).join('\n') + '\n\n' +
        `**Eventos:** ${data.events.total} total\n` +
        Object.entries(data.events.byType).map(([type, count]) => `  • ${type}: ${count}`).join('\n') + '\n\n' +
        `**Usuários cadastrados:** ${data.users.total}`;
    
    case 'generate_report_preview':
      return `📋 **Preview do Relatório de Gestão**\n\n` +
        `📅 Gerado em: ${new Date(data.generatedAt).toLocaleString('pt-BR')}\n\n` +
        `**Resumo:**\n` +
        `• ${data.statistics.documents.total} documentos cadastrados\n` +
        `• ${data.statistics.news.total} notícias publicadas\n` +
        `• ${data.statistics.events.total} eventos registrados\n\n` +
        `**⚠️ Funcionalidades de Auditoria:**\n` +
        `${data.auditInfo.message}\n\n` +
        `**Recursos planejados:**\n` +
        data.auditInfo.plannedFeatures.map((f: string) => `• ${f}`).join('\n');
    
    case 'list_recent_documents':
      if (data.length === 0) {
        return `Não há documentos cadastrados recentemente.`;
      }
      let recentDocsResponse = `📄 **Documentos recentes:**\n\n`;
      data.forEach((doc: any, index: number) => {
        recentDocsResponse += `${index + 1}. **${doc.title}** - ${new Date(doc.created_at).toLocaleDateString('pt-BR')}\n`;
      });
      return recentDocsResponse;
    
    case 'list_recent_news':
      if (data.length === 0) {
        return `Não há notícias publicadas recentemente.`;
      }
      let recentNewsResponse = `📰 **Notícias recentes:**\n\n`;
      data.forEach((news: any, index: number) => {
        recentNewsResponse += `${index + 1}. **${news.title}** - ${new Date(news.published_at || news.created_at).toLocaleDateString('pt-BR')}\n`;
      });
      return recentNewsResponse;
    
    default:
      return `Posso ajudar você com:\n\n` +
        `📄 **Documentos:** "Buscar documento sobre...", "Documentos recentes"\n` +
        `📰 **Notícias:** "Buscar notícia sobre...", "Notícias recentes"\n` +
        `📅 **Eventos:** "Próximos eventos", "Buscar audiência..."\n` +
        `📊 **Estatísticas:** "Mostrar estatísticas", "Resumo do sistema"\n` +
        `📋 **Relatórios:** "Gerar relatório", "Preview de auditoria"\n\n` +
        `Digite sua pergunta ou selecione uma opção acima.`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AssistantRequest = await request.json();
    const { query, action, filters } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query é obrigatória' },
        { status: 400 }
      );
    }
    
    // Detectar intenção se não foi especificada
    const detectedAction = action || detectIntent(query);
    
    let data: any;
    
    switch (detectedAction) {
      case 'search_documents':
        data = await searchDocuments(query, filters);
        break;
      case 'search_news':
        data = await searchNews(query, filters);
        break;
      case 'search_events':
        data = await searchEvents(query, filters);
        break;
      case 'list_upcoming_events':
        data = await listUpcomingEvents(filters?.limit || 5);
        break;
      case 'get_statistics':
        data = await getStatistics();
        break;
      case 'generate_report_preview':
        data = await generateReportPreview();
        break;
      case 'list_recent_documents':
        data = await searchDocuments('', { limit: 5 });
        break;
      case 'list_recent_news':
        data = await searchNews('', { limit: 5 });
        break;
      default:
        data = null;
    }
    
    const response = formatResponse(detectedAction, data, query);
    
    return NextResponse.json({
      success: true,
      action: detectedAction,
      response,
      data,
    });
    
  } catch (error) {
    console.error('Erro no assistente administrativo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
