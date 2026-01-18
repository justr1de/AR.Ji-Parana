import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEFAULT_DEPARTMENTS } from '@/types/departments';

// GET - Listar todos os departamentos
export async function GET(request: NextRequest) {
  try {
    const { data: departments, error } = await supabase
      .from('departments')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      // Se a tabela não existir, criar e inserir departamentos padrão
      if (error.code === '42P01') {
        await initializeDepartments();
        const { data: newDepartments } = await supabase
          .from('departments')
          .select('*')
          .order('order_index', { ascending: true });
        return NextResponse.json(newDepartments || []);
      }
      throw error;
    }

    // Se não houver departamentos, inicializar com os padrão
    if (!departments || departments.length === 0) {
      await initializeDepartments();
      const { data: newDepartments } = await supabase
        .from('departments')
        .select('*')
        .order('order_index', { ascending: true });
      return NextResponse.json(newDepartments || []);
    }

    return NextResponse.json(departments);
  } catch (error) {
    console.error('Erro ao buscar departamentos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar departamentos' },
      { status: 500 }
    );
  }
}

// POST - Criar novo departamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon, color, parent_id } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome do departamento é obrigatório' },
        { status: 400 }
      );
    }

    // Obter o próximo order_index
    const { data: lastDept } = await supabase
      .from('departments')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const nextOrderIndex = (lastDept?.order_index || 0) + 1;

    const { data: department, error } = await supabase
      .from('departments')
      .insert({
        name,
        description: description || null,
        icon: icon || 'Folder',
        color: color || '#6b7280',
        parent_id: parent_id || null,
        order_index: nextOrderIndex
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar departamento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar departamento' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar departamento
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, icon, color, parent_id, order_index } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do departamento é obrigatório' },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (parent_id !== undefined) updateData.parent_id = parent_id;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data: department, error } = await supabase
      .from('departments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(department);
  } catch (error) {
    console.error('Erro ao atualizar departamento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar departamento' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir departamento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do departamento é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se há documentos no departamento
    const { data: documents } = await supabase
      .from('department_documents')
      .select('id')
      .eq('department_id', id)
      .limit(1);

    if (documents && documents.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir departamento com documentos. Remova os documentos primeiro.' },
        { status: 400 }
      );
    }

    // Verificar se há subdepartamentos
    const { data: subDepts } = await supabase
      .from('departments')
      .select('id')
      .eq('parent_id', id)
      .limit(1);

    if (subDepts && subDepts.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir departamento com subdepartamentos.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir departamento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir departamento' },
      { status: 500 }
    );
  }
}

// Função auxiliar para inicializar departamentos padrão
async function initializeDepartments() {
  for (const dept of DEFAULT_DEPARTMENTS) {
    await supabase.from('departments').insert(dept);
  }
}
