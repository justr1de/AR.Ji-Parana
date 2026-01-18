"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Base de conhecimento da AGERJI
const knowledgeBase = {
  saudacao: {
    keywords: ["olá", "oi", "bom dia", "boa tarde", "boa noite", "ola", "hello", "hi"],
    response: "Olá! Sou o assistente virtual da AGERJI - Agência Reguladora de Ji-Paraná. Como posso ajudá-lo hoje? Posso fornecer informações sobre nossos serviços, como fazer denúncias, consultar tarifas, participar de audiências públicas e muito mais!"
  },
  sobre: {
    keywords: ["o que é", "sobre", "agerji", "agência", "quem são", "missão", "função"],
    response: "A AGERJI (Agência Reguladora de Serviços Públicos Delegados do Município de Ji-Paraná) foi criada pela Lei Municipal nº 2.271, de 07 de março de 2012. Nossa missão é regular, controlar e fiscalizar os serviços públicos delegados no município, garantindo qualidade e eficiência para os cidadãos. Somos membros da ABAR (Associação Brasileira de Agências Reguladoras)."
  },
  saneamento: {
    keywords: ["saneamento", "água", "esgoto", "abastecimento", "tratamento", "caerd"],
    response: "A AGERJI regula os serviços de saneamento básico em Ji-Paraná, incluindo:\n\n• **Abastecimento de água**: Fiscalizamos a qualidade e regularidade do fornecimento\n• **Esgotamento sanitário**: Monitoramos o tratamento e destinação adequada\n• **Tarifas**: Analisamos e aprovamos reajustes tarifários\n\nPara denúncias sobre problemas no abastecimento de água ou esgoto, acesse nossa página de Denúncias ou ligue para (69) 3421-5996."
  },
  residuos: {
    keywords: ["resíduos", "lixo", "coleta", "reciclagem", "limpeza urbana", "residuos"],
    response: "A AGERJI fiscaliza os serviços de limpeza urbana e manejo de resíduos sólidos, incluindo:\n\n• **Coleta de lixo**: Regularidade e abrangência do serviço\n• **Limpeza de vias**: Varrição e manutenção de espaços públicos\n• **Destinação final**: Monitoramento do aterro sanitário\n\nSe você identificar problemas na coleta de lixo em sua região, registre uma denúncia em nosso portal."
  },
  denuncia: {
    keywords: ["denúncia", "denunciar", "reclamar", "reclamação", "problema", "irregularidade", "denuncia", "reclamacao"],
    response: "Para registrar uma denúncia sobre irregularidades nos serviços públicos regulados:\n\n1. **Online**: Acesse a página 'Denúncias' em nosso portal\n2. **Presencial**: Compareça à sede da AGERJI na Rua do Brilhante, 130 - Urupá\n3. **Telefone**: Ligue para (69) 3421-5996\n4. **E-mail**: agerji@ji-parana.ro.gov.br\n\nSua denúncia pode ser anônima e será tratada com sigilo."
  },
  ouvidoria: {
    keywords: ["ouvidoria", "sugestão", "elogio", "crítica", "manifestação", "sugestao", "critica", "manifestacao"],
    response: "A Ouvidoria da AGERJI é o canal para:\n\n• **Reclamações**: Sobre atendimento ou serviços\n• **Sugestões**: Para melhoria dos serviços\n• **Elogios**: Reconhecimento de bom atendimento\n• **Denúncias**: Irregularidades e má conduta\n\nAcesse a página de Atendimento e clique em 'Ouvidoria' para registrar sua manifestação. O prazo de resposta é de até 30 dias."
  },
  tarifas: {
    keywords: ["tarifa", "preço", "valor", "conta", "cobrança", "reajuste", "cobranca"],
    response: "A AGERJI é responsável por analisar e aprovar as tarifas dos serviços regulados:\n\n• **Água e esgoto**: Tarifas definidas por faixas de consumo\n• **Revisões tarifárias**: Realizadas periodicamente com audiência pública\n• **Segunda via**: Disponível nos canais da concessionária\n\nPara consultar as tarifas vigentes, acesse a seção 'Tarifas e Taxas' em nosso portal ou entre em contato conosco."
  },
  audiencia: {
    keywords: ["audiência", "consulta pública", "participação", "participar", "audiencia", "participacao"],
    response: "A participação social é fundamental para a AGERJI! Você pode participar de:\n\n• **Audiências Públicas**: Debates presenciais sobre temas regulatórios\n• **Consultas Públicas**: Contribuições por escrito sobre normas e tarifas\n\nAcompanhe nossa Agenda para saber das próximas audiências. As contribuições são analisadas e podem influenciar as decisões da agência."
  },
  contato: {
    keywords: ["contato", "telefone", "endereço", "email", "horário", "localização", "endereco", "horario", "localizacao"],
    response: "**Contato da AGERJI:**\n\n📍 **Endereço**: Rua do Brilhante, 130 - Urupá, Ji-Paraná - RO\n📮 **CEP**: 76.900-150\n📞 **Telefone**: (69) 3421-5996\n📧 **E-mail**: agerji@ji-parana.ro.gov.br\n🕐 **Horário**: Segunda a Sexta, das 07:30 às 13:30"
  },
  transparencia: {
    keywords: ["transparência", "portal", "licitação", "contrato", "prestação de contas", "transparencia", "licitacao"],
    response: "O Portal da Transparência da AGERJI disponibiliza:\n\n• **Contratos e convênios**: Documentos firmados pela agência\n• **Licitações**: Processos de compras e contratações\n• **Prestação de contas**: Relatórios financeiros\n• **Resoluções e portarias**: Atos normativos publicados\n\nAcesse a página 'Transparência' para consultar todas as informações."
  },
  legislacao: {
    keywords: ["lei", "legislação", "resolução", "portaria", "norma", "regulamento", "legislacao", "resolucao"],
    response: "A AGERJI disponibiliza toda a legislação aplicável:\n\n• **Lei de criação**: Lei Municipal nº 2.271/2012\n• **Alterações**: Lei nº 3.643/2023\n• **Resoluções**: Normas técnicas e regulamentares\n• **Portarias**: Atos administrativos\n\nAcesse a seção 'Leis e Atos' para consultar todos os documentos."
  },
  default: {
    response: "Desculpe, não encontrei informações específicas sobre esse assunto. Posso ajudá-lo com:\n\n• Informações sobre a AGERJI\n• Serviços de saneamento básico\n• Coleta de resíduos sólidos\n• Como fazer denúncias\n• Ouvidoria e atendimento\n• Tarifas dos serviços\n• Audiências e consultas públicas\n• Transparência e legislação\n• Contato e localização\n\nDigite sua dúvida ou escolha um dos temas acima!"
  }
};

function findResponse(userMessage: string): string {
  const normalizedMessage = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (key === "default") continue;
    
    const hasKeyword = data.keywords.some(keyword => 
      normalizedMessage.includes(keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    );
    
    if (hasKeyword) {
      return data.response;
    }
  }
  
  return knowledgeBase.default.response;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o assistente virtual da AGERJI. Como posso ajudá-lo hoje? Posso responder dúvidas sobre nossos serviços, como fazer denúncias, consultar tarifas e muito mais!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simular delay de digitação
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const response = findResponse(userMessage.content);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "O que é a AGERJI?",
    "Como fazer uma denúncia?",
    "Qual o horário de atendimento?",
    "Informações sobre tarifas"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Abrir assistente virtual"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Precisa de ajuda?
        </span>
        {/* Indicador de pulsação */}
        <span className="absolute top-0 right-0 h-3 w-3 bg-green-400 rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? "w-80 h-14" : "w-96 h-[550px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-1.5">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Assistente AGERJI</h3>
            {!isMinimized && (
              <p className="text-xs text-white/80">Online • Pronto para ajudar</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isMinimized ? "Expandir" : "Minimizar"}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Fechar assistente"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[380px] bg-gray-50/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 mb-2">Perguntas frequentes:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => {
                      setInput(question);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
