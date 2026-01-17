export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  link_text: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  image_url: string | null;
  category: "noticia" | "publicacao" | "resolucao" | "comunicado";
  featured: boolean;
  published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  event_type: "reuniao" | "audiencia" | "consulta" | "evento";
  start_date: string;
  end_date: string | null;
  all_day: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  category: "lei" | "decreto" | "resolucao" | "portaria" | "ata" | "relatorio" | "outros";
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  type: "contato" | "ouvidoria" | "denuncia" | "sugestao";
  status: "pendente" | "em_andamento" | "respondido" | "arquivado";
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  link_url: string | null;
  category: "infraestrutura" | "guias" | "denuncias" | "outros";
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}
