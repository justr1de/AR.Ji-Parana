"use client";

import { useState } from "react";
import { Bot, Send, User, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Consultas padrão que o assistente pode responder
const defaultQueries = [
  { label: "O que é a AGERJI?", query: "O que é a AGERJI?" },
  { label: "Saneamento básico", query: "Quais serviços de saneamento básico são regulados?" },
  { label: "Resíduos sólidos", query: "Como funciona a regulação de resíduos sólidos?" },
  { label: "Como fazer denúncia", query: "Como posso fazer uma denúncia sobre serviços públicos?" },
  { label: "Ouvidoria", query: "Como entrar em contato com a ouvidoria?" },
  { label: "Tarifas e taxas", query: "Como são definidas as tarifas dos serviços regulados?" },
  { label: "Audiências públicas", query: "Como participar das audiências públicas?" },
  { label: "Contato e localização", query: "Qual o endereço e horário de funcionamento da AGERJI?" },
];

// Respostas pré-definidas para consultas comuns
const responses: Record<string, string> = {
  "O que é a AGERJI?": `A **AGERJI** (Agência Reguladora de Serviços Públicos Delegados do Município de Ji-Paraná) é uma autarquia municipal criada pela Lei nº 2.271/2012.

Nossa missão é **regular, controlar e fiscalizar** os serviços públicos delegados no município, garantindo:
- Qualidade dos serviços prestados
- Modicidade tarifária
- Proteção dos direitos dos usuários
- Eficiência na prestação dos serviços

Atuamos nos setores de **saneamento básico**, **transporte público** e **resíduos sólidos**.`,

  "Quais serviços de saneamento básico são regulados?": `A AGERJI regula os seguintes serviços de **saneamento básico**:

**Abastecimento de Água:**
- Captação, tratamento e distribuição
- Qualidade da água fornecida
- Continuidade do serviço

**Esgotamento Sanitário:**
- Coleta e tratamento de esgoto
- Destinação adequada dos efluentes

**Drenagem Urbana:**
- Manejo das águas pluviais
- Prevenção de alagamentos

Para reclamações sobre estes serviços, entre em contato com nossa ouvidoria.`,

  "Como funciona a regulação de resíduos sólidos?": `A regulação de **resíduos sólidos** pela AGERJI abrange:

**Coleta Domiciliar:**
- Frequência e horários de coleta
- Qualidade do serviço prestado

**Destinação Final:**
- Fiscalização do aterro sanitário
- Cumprimento das normas ambientais

**Limpeza Urbana:**
- Varrição de vias públicas
- Capina e roçagem

A AGERJI também fiscaliza o cumprimento do **Plano Municipal de Gestão Integrada de Resíduos Sólidos**.`,

  "Como posso fazer uma denúncia sobre serviços públicos?": `Para fazer uma **denúncia** sobre irregularidades nos serviços públicos regulados:

**Canais de Atendimento:**
1. **Presencial:** Rua do Brilhante, 130 - Urupá
2. **Telefone:** (69) 3421-5996
3. **E-mail:** agerji@ji-parana.ro.gov.br
4. **Ouvidoria Online:** Acesse nosso portal

**Informações necessárias:**
- Descrição detalhada do problema
- Local e data da ocorrência
- Fotos ou documentos (se houver)
- Seus dados de contato

Todas as denúncias são tratadas com **sigilo** e recebem acompanhamento.`,

  "Como entrar em contato com a ouvidoria?": `A **Ouvidoria da AGERJI** está disponível para:
- Reclamações sobre serviços regulados
- Denúncias de irregularidades
- Sugestões de melhorias
- Elogios aos serviços

**Contatos:**
- **Telefone:** (69) 3421-5996
- **E-mail:** agerji@ji-parana.ro.gov.br
- **Endereço:** Rua do Brilhante, 130 - Urupá, Ji-Paraná - RO

**Horário de Atendimento:**
Segunda a Sexta: 07:30 às 13:30

Sua manifestação receberá um número de protocolo para acompanhamento.`,

  "Como são definidas as tarifas dos serviços regulados?": `As **tarifas** dos serviços regulados são definidas através de:

**Processo de Revisão Tarifária:**
1. Análise técnica dos custos operacionais
2. Avaliação dos investimentos necessários
3. Audiência pública para participação social
4. Deliberação do Conselho Diretor

**Princípios observados:**
- **Modicidade:** Tarifas justas e acessíveis
- **Equilíbrio econômico-financeiro:** Sustentabilidade do serviço
- **Transparência:** Processo público e participativo

As tarifas são publicadas em **Diário Oficial** e disponibilizadas em nosso portal.`,

  "Como participar das audiências públicas?": `As **audiências públicas** da AGERJI são abertas a toda a população:

**Como participar:**
1. Acompanhe o calendário em nosso site
2. Inscreva-se antecipadamente (quando necessário)
3. Compareça no local e horário indicados
4. Apresente suas contribuições

**Temas comuns:**
- Revisões tarifárias
- Novos regulamentos
- Planos de investimento
- Qualidade dos serviços

**Próximas audiências:**
Consulte nossa agenda para datas e locais.

Sua participação é fundamental para a melhoria dos serviços públicos!`,

  "Qual o endereço e horário de funcionamento da AGERJI?": `**Localização da AGERJI:**

📍 **Endereço:**
Rua do Brilhante, 130 - Bairro Urupá
Ji-Paraná - RO
CEP: 76.900-150

📞 **Telefone:** (69) 3421-5996

✉️ **E-mail:** agerji@ji-parana.ro.gov.br

🕐 **Horário de Atendimento:**
Segunda a Sexta-feira
07:30 às 13:30

Estamos localizados próximo ao centro da cidade, com fácil acesso por transporte público.`,
};

export function AssistenteVirtualFixo() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Como posso ajudar você hoje?\n\nSelecione uma opção abaixo ou digite sua pergunta.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (query?: string) => {
    const userMessage = query || input.trim();
    if (!userMessage) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simular delay de resposta
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Buscar resposta pré-definida ou resposta genérica
    let responseContent = responses[userMessage];

    if (!responseContent) {
      // Buscar por palavras-chave
      const lowerQuery = userMessage.toLowerCase();
      if (lowerQuery.includes("agerji") || lowerQuery.includes("agência")) {
        responseContent = responses["O que é a AGERJI?"];
      } else if (lowerQuery.includes("saneamento") || lowerQuery.includes("água") || lowerQuery.includes("esgoto")) {
        responseContent = responses["Quais serviços de saneamento básico são regulados?"];
      } else if (lowerQuery.includes("resíduo") || lowerQuery.includes("lixo") || lowerQuery.includes("coleta")) {
        responseContent = responses["Como funciona a regulação de resíduos sólidos?"];
      } else if (lowerQuery.includes("denúncia") || lowerQuery.includes("reclamação") || lowerQuery.includes("problema")) {
        responseContent = responses["Como posso fazer uma denúncia sobre serviços públicos?"];
      } else if (lowerQuery.includes("ouvidoria") || lowerQuery.includes("contato")) {
        responseContent = responses["Como entrar em contato com a ouvidoria?"];
      } else if (lowerQuery.includes("tarifa") || lowerQuery.includes("taxa") || lowerQuery.includes("preço")) {
        responseContent = responses["Como são definidas as tarifas dos serviços regulados?"];
      } else if (lowerQuery.includes("audiência") || lowerQuery.includes("participar") || lowerQuery.includes("consulta")) {
        responseContent = responses["Como participar das audiências públicas?"];
      } else if (lowerQuery.includes("endereço") || lowerQuery.includes("horário") || lowerQuery.includes("localização")) {
        responseContent = responses["Qual o endereço e horário de funcionamento da AGERJI?"];
      } else {
        responseContent = `Obrigado pela sua pergunta! Para informações mais específicas sobre "${userMessage}", recomendo:

1. **Ligar para:** (69) 3421-5996
2. **Enviar e-mail:** agerji@ji-parana.ro.gov.br
3. **Visitar:** Rua do Brilhante, 130 - Urupá

Horário de atendimento: Segunda a Sexta, 07:30 às 13:30.

Posso ajudar com algo mais?`;
      }
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseContent,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div 
      className={`fixed bottom-6 right-8 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? "w-72 h-14" : "w-[400px] max-h-[580px]"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a5c38] to-[#1e6b40] text-white p-3.5 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Assistente Virtual AGERJI</h3>
              {!isMinimized && (
                <p className="text-xs text-white/80">Tire suas dúvidas sobre nossos serviços</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isMinimized ? "Expandir" : "Minimizar"}
          >
            {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-52 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-[#1a5c38] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-[#1a5c38] text-white rounded-br-sm"
                      : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-[#1a5c38] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-xl rounded-bl-sm px-4 py-2.5 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex flex-wrap gap-1.5">
              {defaultQueries.slice(0, 4).map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSend(item.query)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-[#1a5c38] hover:text-white rounded-full transition-colors"
                  disabled={isLoading}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {defaultQueries.slice(4).map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSend(item.query)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-[#1a5c38] hover:text-white rounded-full transition-colors"
                  disabled={isLoading}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c38] focus:border-transparent"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-[#1a5c38] hover:bg-[#1e6b40] w-9 h-9"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-400 text-center mt-2">
              Para atendimento personalizado: (69) 3421-5996
            </p>
          </div>
        </>
      )}
    </div>
  );
}
