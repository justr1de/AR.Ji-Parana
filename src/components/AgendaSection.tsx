import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";

interface EventItem {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  event_type: string;
  start_date: string;
  all_day: boolean;
}

interface AgendaSectionProps {
  events?: EventItem[];
}

const defaultEvents: EventItem[] = [
  {
    id: 1,
    title: "Reunião do Conselho Diretor",
    description: "Reunião ordinária do Conselho Diretor da AGERJI",
    location: "Sede da AGERJI",
    event_type: "reuniao",
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: false,
  },
  {
    id: 2,
    title: "Audiência Pública - Revisão Tarifária",
    description: "Audiência pública sobre a revisão tarifária dos serviços",
    location: "Câmara Municipal de Ji-Paraná",
    event_type: "audiencia",
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: false,
  },
  {
    id: 3,
    title: "Consulta Pública - Normas Técnicas",
    description: "Consulta pública sobre novas normas técnicas",
    location: "Online",
    event_type: "consulta",
    start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
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

function formatDate(dateString: string): { day: string; month: string; time: string } {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase(),
    time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function AgendaSection({ events = defaultEvents }: AgendaSectionProps) {
  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <section className="py-12 bg-secondary/30" aria-labelledby="agenda-title">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-primary" />
            <div>
              <h2 id="agenda-title" className="text-2xl md:text-3xl font-bold text-foreground">
                Agenda Executiva
              </h2>
              <p className="text-muted-foreground">
                Próximos eventos e reuniões
              </p>
            </div>
          </div>
          <Link href="/agenda">
            <Button variant="outline" className="hidden md:flex items-center gap-2">
              Ver agenda completa
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => {
            const dateInfo = formatDate(event.start_date);
            return (
              <Card key={event.id} className="transition-all duration-200 hover:shadow-lg">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Date badge */}
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="bg-primary text-primary-foreground rounded-t-md py-1 text-xs font-medium">
                        {dateInfo.month}
                      </div>
                      <div className="bg-card border border-t-0 border-border rounded-b-md py-2">
                        <span className="text-2xl font-bold text-foreground">
                          {dateInfo.day}
                        </span>
                      </div>
                    </div>

                    {/* Event details */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium text-white rounded mb-2 ${
                          eventTypeColors[event.event_type] || "bg-primary"
                        }`}
                      >
                        {eventTypeLabels[event.event_type] || event.event_type}
                      </span>
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.all_day ? "Dia inteiro" : dateInfo.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/agenda">
            <Button variant="outline" className="w-full">
              Ver agenda completa
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
