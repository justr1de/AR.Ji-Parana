import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Agenda - AGERJI",
  description: "Agenda de eventos e reuniões da AGERJI",
};

// Dados de exemplo - serão substituídos por dados do Supabase
const mockEvents = [
  {
    id: 1,
    title: "Reunião do Conselho Diretor",
    description: "Reunião ordinária do Conselho Diretor da AGERJI para deliberação sobre processos regulatórios.",
    location: "Sede da AGERJI",
    event_type: "reuniao",
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: false,
  },
  {
    id: 2,
    title: "Audiência Pública - Revisão Tarifária",
    description: "Audiência pública sobre a revisão tarifária dos serviços de água e esgoto do município.",
    location: "Câmara Municipal de Ji-Paraná",
    event_type: "audiencia",
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: false,
  },
  {
    id: 3,
    title: "Consulta Pública - Normas Técnicas",
    description: "Consulta pública sobre novas normas técnicas para prestação de serviços de saneamento.",
    location: "Online",
    event_type: "consulta",
    start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: true,
  },
  {
    id: 4,
    title: "Reunião Técnica - Transporte Público",
    description: "Reunião técnica com a concessionária de transporte público para avaliação de indicadores.",
    location: "Sede da AGERJI",
    event_type: "reuniao",
    start_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: false,
  },
  {
    id: 5,
    title: "Capacitação - Regulação de Serviços",
    description: "Capacitação para servidores sobre regulação de serviços públicos.",
    location: "Auditório da Prefeitura",
    event_type: "evento",
    start_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: true,
  },
];

const eventTypeLabels: Record<string, string> = {
  reuniao: "Reunião",
  audiencia: "Audiência Pública",
  consulta: "Consulta Pública",
  evento: "Evento",
};

const eventTypeColors: Record<string, string> = {
  reuniao: "bg-blue-500",
  audiencia: "bg-purple-500",
  consulta: "bg-amber-500",
  evento: "bg-primary",
};

function formatDate(dateString: string): { day: string; month: string; year: string; time: string; weekday: string } {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase(),
    year: date.getFullYear().toString(),
    time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    weekday: date.toLocaleDateString("pt-BR", { weekday: "long" }),
  };
}

export default function AgendaPage() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="h-10 w-10 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Agenda Executiva
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Confira os próximos eventos, reuniões e audiências públicas da AGERJI.
          </p>
        </div>

        {/* Events list */}
        <div className="space-y-6">
          {mockEvents.map((event) => {
            const dateInfo = formatDate(event.start_date);
            return (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Date column */}
                    <div className="bg-primary text-primary-foreground p-6 md:w-32 flex flex-col items-center justify-center text-center">
                      <span className="text-sm font-medium">{dateInfo.month}</span>
                      <span className="text-4xl font-bold">{dateInfo.day}</span>
                      <span className="text-sm">{dateInfo.year}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium text-white rounded mb-2 ${
                              eventTypeColors[event.event_type] || "bg-primary"
                            }`}
                          >
                            {eventTypeLabels[event.event_type] || event.event_type}
                          </span>
                          <h2 className="text-xl font-semibold text-foreground mb-2">
                            {event.title}
                          </h2>
                          <p className="text-muted-foreground mb-4">
                            {event.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {event.all_day ? "Dia inteiro" : dateInfo.time} •{" "}
                                {dateInfo.weekday}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
