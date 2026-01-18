import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Listar relatórios gerados ou obter estatísticas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Se for solicitação de estatísticas
    if (type === 'statistics') {
      return await getStatistics();
    }

    // Se for solicitação de relatório de atividades
    if (type === 'activities') {
      const startDate = searchParams.get('start_date');
      const endDate = searchParams.get('end_date');
      return await getActivitiesReport(startDate, endDate);
    }

    // Se for solicitação de relatório de documentos
    if (type === 'documents') {
      const departmentId = searchParams.get('department_id');
      return await getDocumentsReport(departmentId);
    }

    // Listar relatórios salvos
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json([]);
      }
      throw error;
    }

    return NextResponse.json(reports || []);
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar relatórios' },
      { status: 500 }
    );
  }
}

// POST - Gerar novo relatório
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description, parameters } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Tipo e título são obrigatórios' },
        { status: 400 }
      );
    }

    let reportData: any = null;

    // Gerar dados do relatório baseado no tipo
    switch (type) {
      case 'atividades':
        reportData = await generateActivitiesReport(parameters);
        break;
      case 'documentos':
        reportData = await generateDocumentsReport(parameters);
        break;
      case 'estatisticas':
        reportData = await generateStatisticsReport();
        break;
      case 'auditoria':
        reportData = await generateAuditReport(parameters);
        break;
      default:
        reportData = { message: 'Tipo de relatório não implementado' };
    }

    // Salvar relatório no banco de dados
    const { data: report, error } = await supabase
      .from('reports')
      .insert({
        title,
        description: description || null,
        type,
        parameters: parameters || null,
        data: reportData
      })
      .select()
      .single();

    if (error) {
      // Se a tabela não existir, retornar apenas os dados
      if (error.code === '42P01') {
        return NextResponse.json({
          id: 'temp-' + Date.now(),
          title,
          type,
          data: reportData,
          created_at: new Date().toISOString()
        }, { status: 201 });
      }
      throw error;
    }

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    );
  }
}

// Funções auxiliares para geração de relatórios

async function getStatistics() {
  try {
    // Contagem de documentos
    const { count: documentsCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });

    // Contagem de notícias
    const { count: newsCount } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true });

    // Contagem de eventos
    const { count: eventsCount } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    // Contagem de departamentos
    const { count: departmentsCount } = await supabase
      .from('departments')
      .select('*', { count: 'exact', head: true });

    // Contagem de documentos por departamento
    const { data: docsByDept } = await supabase
      .from('department_documents')
      .select('department_id, departments(name)')
      .order('department_id');

    // Agrupar documentos por departamento
    const deptStats: Record<string, number> = {};
    docsByDept?.forEach((doc: any) => {
      const deptName = doc.departments?.name || 'Sem departamento';
      deptStats[deptName] = (deptStats[deptName] || 0) + 1;
    });

    return NextResponse.json({
      totals: {
        documents: documentsCount || 0,
        news: newsCount || 0,
        events: eventsCount || 0,
        departments: departmentsCount || 0
      },
      documentsByDepartment: deptStats,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return NextResponse.json({
      totals: { documents: 0, news: 0, events: 0, departments: 0 },
      documentsByDepartment: {},
      generatedAt: new Date().toISOString()
    });
  }
}

async function getActivitiesReport(startDate: string | null, endDate: string | null) {
  try {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();

    // Buscar notícias no período
    const { data: news } = await supabase
      .from('news')
      .select('id, title, created_at, category')
      .gte('created_at', start)
      .lte('created_at', end)
      .order('created_at', { ascending: false });

    // Buscar eventos no período
    const { data: events } = await supabase
      .from('events')
      .select('id, title, start_date, event_type')
      .gte('start_date', start)
      .lte('start_date', end)
      .order('start_date', { ascending: false });

    // Buscar documentos no período
    const { data: documents } = await supabase
      .from('documents')
      .select('id, title, created_at, category')
      .gte('created_at', start)
      .lte('created_at', end)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      period: { start, end },
      news: news || [],
      events: events || [],
      documents: documents || [],
      summary: {
        totalNews: news?.length || 0,
        totalEvents: events?.length || 0,
        totalDocuments: documents?.length || 0
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de atividades:', error);
    return NextResponse.json({
      period: { start: startDate, end: endDate },
      news: [],
      events: [],
      documents: [],
      summary: { totalNews: 0, totalEvents: 0, totalDocuments: 0 },
      generatedAt: new Date().toISOString()
    });
  }
}

async function getDocumentsReport(departmentId: string | null) {
  try {
    let query = supabase
      .from('department_documents')
      .select(`
        *,
        departments (
          id,
          name,
          color
        )
      `)
      .order('created_at', { ascending: false });

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    const { data: documents } = await query;

    // Agrupar por departamento
    const byDepartment: Record<string, any[]> = {};
    documents?.forEach((doc: any) => {
      const deptName = doc.departments?.name || 'Sem departamento';
      if (!byDepartment[deptName]) {
        byDepartment[deptName] = [];
      }
      byDepartment[deptName].push(doc);
    });

    // Calcular tamanho total
    const totalSize = documents?.reduce((acc: number, doc: any) => acc + (doc.file_size || 0), 0) || 0;

    return NextResponse.json({
      documents: documents || [],
      byDepartment,
      summary: {
        totalDocuments: documents?.length || 0,
        totalSize,
        totalSizeFormatted: formatFileSize(totalSize)
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de documentos:', error);
    return NextResponse.json({
      documents: [],
      byDepartment: {},
      summary: { totalDocuments: 0, totalSize: 0, totalSizeFormatted: '0 B' },
      generatedAt: new Date().toISOString()
    });
  }
}

async function generateActivitiesReport(parameters: any) {
  const startDate = parameters?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const endDate = parameters?.endDate || new Date().toISOString();

  const response = await getActivitiesReport(startDate, endDate);
  return response.json ? await response.json() : response;
}

async function generateDocumentsReport(parameters: any) {
  const departmentId = parameters?.departmentId || null;

  const response = await getDocumentsReport(departmentId);
  return response.json ? await response.json() : response;
}

async function generateStatisticsReport() {
  const response = await getStatistics();
  return response.json ? await response.json() : response;
}

async function generateAuditReport(parameters: any) {
  // Relatório de auditoria - preparado para implementação futura
  return {
    type: 'auditoria',
    message: 'Relatório de auditoria em desenvolvimento',
    parameters,
    sections: [
      {
        title: 'Acessos ao Sistema',
        status: 'pendente',
        description: 'Registro de acessos e ações dos usuários'
      },
      {
        title: 'Alterações em Documentos',
        status: 'pendente',
        description: 'Histórico de modificações em documentos'
      },
      {
        title: 'Conformidade LGPD',
        status: 'pendente',
        description: 'Verificação de conformidade com a LGPD'
      }
    ],
    generatedAt: new Date().toISOString()
  };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
