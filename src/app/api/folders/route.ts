import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Listar pastas de um departamento
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('department_id');
    const parentFolderId = searchParams.get('parent_folder_id');

    let query = supabase
      .from('folders')
      .select('*')
      .order('name', { ascending: true });

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    if (parentFolderId === 'null' || parentFolderId === '') {
      query = query.is('parent_folder_id', null);
    } else if (parentFolderId) {
      query = query.eq('parent_folder_id', parentFolderId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pastas' }, { status: 500 });
  }
}

// POST - Criar nova pasta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { department_id, parent_folder_id, name, description, color, icon } = body;

    if (!department_id || !name) {
      return NextResponse.json(
        { error: 'department_id e name são obrigatórios' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('folders')
      .insert({
        department_id,
        parent_folder_id: parent_folder_id || null,
        name,
        description: description || null,
        color: color || '#6B7280',
        icon: icon || 'folder'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Já existe uma pasta com este nome neste local' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar pasta' }, { status: 500 });
  }
}

// PUT - Atualizar pasta
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, color, icon, parent_folder_id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;
    if (parent_folder_id !== undefined) updateData.parent_folder_id = parent_folder_id;

    const { data, error } = await supabase
      .from('folders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar pasta' }, { status: 500 });
  }
}

// DELETE - Excluir pasta
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    // Verificar se há subpastas
    const { data: subfolders } = await supabase
      .from('folders')
      .select('id')
      .eq('parent_folder_id', id);

    if (subfolders && subfolders.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir pasta com subpastas. Exclua as subpastas primeiro.' },
        { status: 400 }
      );
    }

    // Verificar se há documentos na pasta
    const { data: documents } = await supabase
      .from('department_documents')
      .select('id')
      .eq('folder_id', id);

    if (documents && documents.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir pasta com documentos. Mova ou exclua os documentos primeiro.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir pasta' }, { status: 500 });
  }
}
