"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Clock, ArrowRight } from "lucide-react";

interface EventItem {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  event_type: string;
  start_date: string;
  all_day: boolean;
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
  {
    id: 4,
    title: "Fiscalização de Serviços",
    description: "Fiscalização programada nos serviços de saneamento",
    location: "Ji-Paraná",
    event_type: "evento",
    start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: false,
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

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function CalendarSection({ events = defaultEvents }: { events?: EventItem[] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Verificar se um dia tem eventos
  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  // Eventos do dia selecionado ou próximos eventos
  const displayEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.start_date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : events.slice(0, 3);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateFull = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
    });
  };

  // Gerar dias do calendário
  const calendarDays = [];
  
  // Dias vazios antes do primeiro dia do mês
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <section className="py-8 bg-gradient-to-b from-white to-secondary/20" aria-labelledby="calendar-title">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <div>
              <h2 id="calendar-title" className="text-xl md:text-2xl font-bold text-foreground">
                Calendário de Eventos
              </h2>
              <p className="text-sm text-muted-foreground">
                Acompanhe as atividades da AGERJI
              </p>
            </div>
          </div>
          <Link href="/agenda">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
              Ver agenda completa
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4">
              {/* Header do calendário */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Mês anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h3 className="text-base font-semibold text-foreground">
                  {MONTHS[currentMonth]} {currentYear}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Próximo mês"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-muted-foreground py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const dayEvents = getEventsForDay(day);
                  const isToday =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();
                  const isSelected =
                    selectedDate &&
                    day === selectedDate.getDate() &&
                    currentMonth === selectedDate.getMonth() &&
                    currentYear === selectedDate.getFullYear();

                  return (
                    <button
                      key={day}
                      onClick={() =>
                        setSelectedDate(new Date(currentYear, currentMonth, day))
                      }
                      className={`aspect-square flex flex-col items-center justify-center rounded-md transition-all relative
                        ${isToday ? "bg-primary text-primary-foreground font-bold" : ""}
                        ${isSelected && !isToday ? "bg-primary/20 ring-1 ring-primary" : ""}
                        ${!isToday && !isSelected ? "hover:bg-secondary" : ""}
                      `}
                    >
                      <span className="text-xs">{day}</span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayEvents.slice(0, 3).map((event, i) => (
                            <span
                              key={i}
                              className={`w-1 h-1 rounded-full ${
                                eventTypeColors[event.event_type] || "bg-primary"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border">
                {Object.entries(eventTypeLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs">
                    <span
                      className={`w-2 h-2 rounded-full ${eventTypeColors[key]}`}
                    />
                    <span className="text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lista de eventos */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {selectedDate
                  ? `Eventos em ${selectedDate.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                    })}`
                  : "Próximos Eventos"}
              </h3>

              {displayEvents.length > 0 ? (
                <div className="space-y-3">
                  {displayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 bg-secondary/50 rounded-md border-l-3"
                      style={{
                        borderLeftColor:
                          event.event_type === "reuniao"
                            ? "#3b82f6"
                            : event.event_type === "audiencia"
                            ? "#a855f7"
                            : event.event_type === "consulta"
                            ? "#f59e0b"
                            : "#1a5c38",
                      }}
                    >
                      <span
                        className={`inline-block px-1.5 py-0.5 text-[10px] font-medium text-white rounded mb-1.5 ${
                          eventTypeColors[event.event_type] || "bg-primary"
                        }`}
                      >
                        {eventTypeLabels[event.event_type] || event.event_type}
                      </span>
                      <h4 className="text-sm font-medium text-foreground mb-1.5">
                        {event.title}
                      </h4>
                      <div className="space-y-0.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          <span>
                            {event.all_day
                              ? `${formatDateFull(event.start_date)} - Dia inteiro`
                              : `${formatDateFull(event.start_date)} às ${formatTime(
                                  event.start_date
                                )}`}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Nenhum evento nesta data</p>
                </div>
              )}

              {selectedDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-xs"
                  onClick={() => setSelectedDate(null)}
                >
                  Ver todos os próximos eventos
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 text-center md:hidden">
          <Link href="/agenda">
            <Button variant="outline" size="sm" className="w-full">
              Ver agenda completa
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
