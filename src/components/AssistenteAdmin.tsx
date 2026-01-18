"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Send, User, X, Minimize2, Maximize2, FileText, Calendar, BarChart3, FileSearch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

// Ações rápidas para o assistente administrativo
const quickActions = [
  { 
    label: "Estatísticas", 
    query: "Mostrar estatísticas do sistema",
    icon: BarChart3,
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200"
  },
  { 
    label: "Documentos recentes", 
    query: "Listar documentos recentes",
    icon: FileText,
    color: "bg-green-100 text-green-700 hover:bg-green-200"
  },
  { 
    label: "Próximos eventos", 
    query: "Próximos eventos agendados",
    icon: Calendar,
    color: "bg-purple-100 text-purple-700 hover:bg-purple-200"
  },
  { 
    label: "Buscar documento", 
    query: "Buscar documento",
    icon: FileSearch,
    color: "bg-amber-100 text-amber-700 hover:bg-amber-200"
  },
];

// Sugestões de consultas
const suggestions = [
  "Buscar resolução sobre saneamento",
  "Quantos documentos foram cadastrados?",
  "Gerar preview de relatório",
  "Listar audiências públicas",
  "Notícias recentes",
  "Buscar lei municipal",
];

export function AssistenteAdmin() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `👋 **Olá! Sou o Assistente Administrativo da AGERJI.**

Posso ajudar você com:
• 📄 **Busca de documentos** - Encontre leis, resoluções e relatórios
• 📰 **Consulta de notícias** - Acesse publicações e comunicados
• 📅 **Agenda de eventos** - Veja audiências e reuniões
• 📊 **Estatísticas** - Resumo do sistema
• 📋 **Relatórios** - Preview de auditoria (em desenvolvimento)

Selecione uma ação rápida ou digite sua pergunta.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (query?: string) => {
    const userMessage = query || input.trim();
    if (!userMessage || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };

    // Adicionar mensagem do usuário e placeholder de loading
    const loadingMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await response.json();

      // Remover mensagem de loading e adicionar resposta real
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.isLoading);
        return [
          ...filtered,
          {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: data.response || "Desculpe, não consegui processar sua solicitação. Tente novamente.",
          },
        ];
      });
    } catch (error) {
      console.error('Erro ao consultar assistente:', error);
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.isLoading);
        return [
          ...filtered,
          {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: "❌ Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggle = () => {
    setIsMinimized(!isMinimized);
  };

  // Função para renderizar markdown básico
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Card do Assistente */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden ${
          isMinimized 
            ? "w-14 h-14 cursor-pointer hover:scale-105" 
            : "w-[420px] max-h-[600px] flex flex-col"
        }`}
        onClick={isMinimized ? handleToggle : undefined}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r from-green-700 to-green-800 text-white ${isMinimized ? 'p-3 rounded-2xl' : 'p-4'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`bg-white/20 rounded-full flex items-center justify-center ${isMinimized ? 'w-8 h-8' : 'w-10 h-10'}`}>
                <Bot className={isMinimized ? "w-5 h-5" : "w-6 h-6"} />
              </div>
              {!isMinimized && (
                <div>
                  <h3 className="font-bold text-base">Assistente Administrativo</h3>
                  <p className="text-xs text-green-200">Acesso ao banco de dados</p>
                </div>
              )}
            </div>
            {!isMinimized && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                  onClick={handleToggle}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo expandido */}
        {!isMinimized && (
          <>
            {/* Ações rápidas */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2 font-medium">Ações rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.query)}
                    disabled={isLoading}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${action.color} disabled:opacity-50`}
                  >
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[320px] bg-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-green-600 text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Consultando banco de dados...</span>
                      </div>
                    ) : (
                      <div 
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Sugestões */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">Sugestões:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.slice(0, 4).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSend(suggestion)}
                      disabled={isLoading}
                      className="text-xs px-2.5 py-1 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua consulta..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                🔒 Dados protegidos conforme LGPD
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AssistenteAdmin;
