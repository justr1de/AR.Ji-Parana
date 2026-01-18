import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Listar documentos de um departamento
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('department_id');
    const folderId = searchParams.get('folder_id');
    const search = searchParams.get('search');

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

    if (folderId) {
      query = query.eq('folder_id', folderId);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: documents, error } = await query;

    if (error) {
      // Se a tabela não existir, retornar array vazio
      if (error.code === '42P01') {
        return NextResponse.json([]);
      }
      throw error;
    }

    return NextResponse.json(documents || []);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar documentos' },
      { status: 500 }
    );
  }
}

// POST - Upload de novo documento
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const departmentId = formData.get('department_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;
    const folderId = formData.get('folder_id') as string;

    if (!file || !departmentId || !title) {
      return NextResponse.json(
        { error: 'Arquivo, departamento e título são obrigatórios' },
        { status: 400 }
      );
    }

    // Upload do arquivo para o Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `department-documents/${departmentId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      // Se o bucket não existir, criar e tentar novamente
      if (uploadError.message.includes('not found')) {
        await supabase.storage.createBucket('documents', { public: false });
        const { error: retryError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);
        if (retryError) throw retryError;
      } else {
        throw uploadError;
      }
    }

    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Inserir registro no banco de dados
    const { data: document, error: dbError } = await supabase
      .from('department_documents')
      .insert({
        department_id: departmentId,
        folder_id: folderId || null,
        title,
        description: description || null,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        tags: tags ? JSON.parse(tags) : null,
        version: 1
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload do documento' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar documento
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, tags, department_id, folder_id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do documento é obrigatório' },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;
    if (department_id !== undefined) updateData.department_id = department_id;
    if (folder_id !== undefined) updateData.folder_id = folder_id;

    const { data: document, error } = await supabase
      .from('department_documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(document);
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar documento' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir documento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do documento é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar o documento para obter o caminho do arquivo
    const { data: document } = await supabase
      .from('department_documents')
      .select('file_url')
      .eq('id', id)
      .single();

    // Excluir o arquivo do storage (se existir)
    if (document?.file_url) {
      const filePath = document.file_url.split('/documents/')[1];
      if (filePath) {
        await supabase.storage.from('documents').remove([filePath]);
      }
    }

    // Excluir o registro do banco de dados
    const { error } = await supabase
      .from('department_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir documento' },
      { status: 500 }
    );
  }
}
