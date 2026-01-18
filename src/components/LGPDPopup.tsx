"use client";

import { useState } from "react";
import { Info, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LGPDPopupProps {
  /** Tipo de coleta de dados para personalizar a mensagem */
  tipo?: "login" | "cadastro" | "recuperacao" | "formulario";
  /** Posição do ícone informativo */
  position?: "inline" | "bottom";
  /** Classe CSS adicional */
  className?: string;
}

export function LGPDPopup({ tipo = "formulario", position = "bottom", className = "" }: LGPDPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const mensagens = {
    login: {
      titulo: "Coleta de Dados para Autenticação",
      descricao: "Os dados de e-mail e senha são coletados exclusivamente para fins de autenticação e controle de acesso ao sistema administrativo da AGERJI.",
    },
    cadastro: {
      titulo: "Coleta de Dados Cadastrais",
      descricao: "Os dados pessoais informados (nome, e-mail, cargo) são coletados para identificação e gestão de usuários do sistema administrativo da AGERJI.",
    },
    recuperacao: {
      titulo: "Coleta de Dados para Recuperação de Senha",
      descricao: "O e-mail informado será utilizado exclusivamente para envio do link de recuperação de senha, conforme solicitado pelo usuário.",
    },
    formulario: {
      titulo: "Coleta de Dados",
      descricao: "Os dados informados neste formulário são coletados para fins de gestão administrativa e prestação de serviços públicos pela AGERJI.",
    },
  };

  const { titulo, descricao } = mensagens[tipo];

  return (
    <div className={`relative ${className}`}>
      {/* Ícone/Botão para abrir o popup */}
      {position === "inline" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-green-700 transition-colors"
          aria-label="Informações sobre proteção de dados"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-700 transition-colors mt-2"
          aria-label="Informações sobre proteção de dados"
        >
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          <span>Todos os dados coletados respeitam as normas da LGPD</span>
        </button>
      )}

      {/* Modal/Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Proteção de Dados - LGPD</h3>
                    <p className="text-xs text-green-200">Lei Geral de Proteção de Dados</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-5 space-y-4">
              {/* Mensagem específica */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">{titulo}</h4>
                <p className="text-sm text-green-700">{descricao}</p>
              </div>

              {/* Informações gerais */}
              <div className="space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  A <strong>AGERJI - Agência Reguladora de Serviços Públicos Delegados do Município de Ji-Paraná</strong> está 
                  comprometida com a proteção dos seus dados pessoais, em conformidade com a Lei nº 13.709/2018 (LGPD).
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-2 text-sm">Base Legal para Tratamento</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    O tratamento de dados pessoais pela AGERJI é realizado com fundamento nas seguintes bases legais da LGPD:
                  </p>
                </div>
              </div>

              {/* Artigos da LGPD */}
              <div className="space-y-2">
                <div className="border-l-4 border-green-600 pl-3 py-2 bg-gray-50 rounded-r">
                  <p className="text-xs font-semibold text-gray-800">Art. 7º, inciso III</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Tratamento pela administração pública para execução de políticas públicas previstas em leis e regulamentos.
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-3 py-2 bg-gray-50 rounded-r">
                  <p className="text-xs font-semibold text-gray-800">Art. 7º, inciso V</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Tratamento necessário para execução de contrato ou procedimentos preliminares relacionados a contrato.
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-3 py-2 bg-gray-50 rounded-r">
                  <p className="text-xs font-semibold text-gray-800">Art. 23</p>
                  <p className="text-xs text-gray-600 mt-1">
                    O tratamento de dados pessoais pelas pessoas jurídicas de direito público deverá ser realizado para o 
                    atendimento de sua finalidade pública, na persecução do interesse público.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-3 py-2 bg-gray-50 rounded-r">
                  <p className="text-xs font-semibold text-gray-800">Art. 26</p>
                  <p className="text-xs text-gray-600 mt-1">
                    O uso compartilhado de dados pessoais pelo Poder Público deve atender a finalidades específicas de 
                    execução de políticas públicas e atribuição legal pelos órgãos e entidades públicas.
                  </p>
                </div>
              </div>

              {/* Direitos do titular */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Seus Direitos (Art. 18 da LGPD)</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Confirmação da existência de tratamento</li>
                  <li>• Acesso aos dados</li>
                  <li>• Correção de dados incompletos ou desatualizados</li>
                  <li>• Anonimização, bloqueio ou eliminação de dados</li>
                  <li>• Informação sobre compartilhamento de dados</li>
                  <li>• Revogação do consentimento (quando aplicável)</li>
                </ul>
              </div>

              {/* Contato DPO */}
              <div className="text-center pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Para exercer seus direitos ou esclarecer dúvidas, entre em contato:
                </p>
                <p className="text-xs font-medium text-green-700 mt-1">
                  agerji@ji-parana.ro.gov.br | (69) 3421-5996
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 rounded-b-xl border-t">
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full bg-green-700 hover:bg-green-800 text-white"
              >
                Entendi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LGPDPopup;
