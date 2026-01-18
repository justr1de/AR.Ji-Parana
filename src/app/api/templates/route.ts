import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEFAULT_TEMPLATES } from '@/types/departments';

// GET - Listar todos os templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('document_templates')
      .select('*')
      .order('name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: templates, error } = await query;

    if (error) {
      // Se a tabela não existir, retornar templates padrão
      if (error.code === '42P01') {
        await initializeTemplates();
        const { data: newTemplates } = await supabase
          .from('document_templates')
          .select('*')
          .order('name', { ascending: true });
        return NextResponse.json(newTemplates || DEFAULT_TEMPLATES);
      }
      throw error;
    }

    // Se não houver templates, inicializar com os padrão
    if (!templates || templates.length === 0) {
      await initializeTemplates();
      const { data: newTemplates } = await supabase
        .from('document_templates')
        .select('*')
        .order('name', { ascending: true });
      return NextResponse.json(newTemplates || DEFAULT_TEMPLATES);
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Erro ao buscar templates:', error);
    // Retornar templates padrão em caso de erro
    return NextResponse.json(DEFAULT_TEMPLATES);
  }
}

// POST - Criar novo template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, content, variables, icon } = body;

    if (!name || !category || !content) {
      return NextResponse.json(
        { error: 'Nome, categoria e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }

    const { data: template, error } = await supabase
      .from('document_templates')
      .insert({
        name,
        description: description || null,
        category,
        content,
        variables: variables || null,
        icon: icon || 'FileText'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar template:', error);
    return NextResponse.json(
      { error: 'Erro ao criar template' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar template
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, category, content, variables, icon } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do template é obrigatório' },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (content !== undefined) updateData.content = content;
    if (variables !== undefined) updateData.variables = variables;
    if (icon !== undefined) updateData.icon = icon;

    const { data: template, error } = await supabase
      .from('document_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(template);
  } catch (error) {
    console.error('Erro ao atualizar template:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar template' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir template
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do template é obrigatório' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('document_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir template:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir template' },
      { status: 500 }
    );
  }
}

// Função auxiliar para inicializar templates padrão
async function initializeTemplates() {
  for (const template of DEFAULT_TEMPLATES) {
    await supabase.from('document_templates').insert(template);
  }
}
