'use client';

import { useEffect, useState } from 'react';
import { supabase, Event } from '@/lib/supabase';
import Link from 'next/link';

const typeLabels: Record<string, string> = {
  reuniao: 'Reunião',
  audiencia: 'Audiência Pública',
  consulta: 'Consulta Pública',
  evento: 'Evento',
};

const typeColors: Record<string, string> = {
  reuniao: 'bg-blue-100 text-blue-800',
  audiencia: 'bg-purple-100 text-purple-800',
  consulta: 'bg-yellow-100 text-yellow-800',
  evento: 'bg-green-100 text-green-800',
};

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  async function fetchEvents() {
    setLoading(true);
    try {
      let query = supabase.from('events').select('*').order('event_date', { ascending: true });
      
      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('Erro ao excluir evento');
    }
  }

  async function togglePublished(id: string, published: boolean) {
    try {
      const { error } = await supabase
        .from('events')
        .update({ published: !published })
        .eq('id', id);
      
      if (error) throw error;
      setEvents(events.map((event) => 
        event.id === id ? { ...event, published: !published } : event
      ));
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5);
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Eventos</h1>
          <p className="text-gray-600 mt-2">Gerencie os eventos e agenda da AGERJI</p>
        </div>
        <Link
          href="/admin/dashboard/eventos/novo"
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Evento
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {Object.entries(typeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">Nenhum evento encontrado</p>
            <Link
              href="/admin/dashboard/eventos/novo"
              className="inline-block mt-4 text-green-700 hover:text-green-800 font-medium"
            >
              Criar primeiro evento
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {events.map((event) => (
              <div key={event.id} className={`p-6 hover:bg-gray-50 transition-colors ${!isUpcoming(event.event_date) ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    {/* Data visual */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center ${isUpcoming(event.event_date) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      <span className="text-2xl font-bold">{new Date(event.event_date).getDate()}</span>
                      <span className="text-xs uppercase">{new Date(event.event_date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[event.type]}`}>
                          {typeLabels[event.type]}
                        </span>
                        <button
                          onClick={() => togglePublished(event.id, event.published)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {event.published ? 'Publicado' : 'Rascunho'}
                        </button>
                        {!isUpcoming(event.event_date) && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                            Passado
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(event.event_date)}
                        </span>
                        {event.start_time && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(event.start_time)}
                            {event.end_time && ` - ${formatTime(event.end_time)}`}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/dashboard/eventos/${event.id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
