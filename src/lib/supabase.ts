import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do banco de dados
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  description: string | null;
  category: 'lei' | 'resolucao' | 'relatorio' | 'audiencia' | 'outros';
  file_url: string;
  file_name: string;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  published: boolean;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: 'noticia' | 'publicacao' | 'resolucao' | 'aviso';
  image_url: string | null;
  author_id: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  type: 'reuniao' | 'audiencia' | 'consulta' | 'evento';
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  created_by: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}
