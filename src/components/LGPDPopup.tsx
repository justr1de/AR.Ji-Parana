"use client";

import { useState, useEffect } from "react";
import { Info, X, Shield, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LGPDPopupProps {
  /** Tipo de coleta de dados para personalizar a mensagem */
  tipo?: "login" | "cadastro" | "recuperacao" | "formulario";
  /** Posição do ícone informativo */
  position?: "inline" | "bottom";
  /** Classe CSS adicional */
  className?: string;
  /** Callback quando o usuário aceita os termos */
  onAccept?: () => void;
  /** Mostrar botão de aceitar e continuar */
  showAcceptButton?: boolean;
}

// Campos de coleta de dados por tipo de formulário
const camposColetados = {
  login: [
    { campo: "E-mail", finalidade: "Identificação do usuário", baseLegal: "Art. 7º, III - Execução de políticas públicas" },
    { campo: "Senha", finalidade: "Autenticação e segurança", baseLegal: "Art. 7º, V - Execução de contrato" },
  ],
  cadastro: [
    { campo: "Nome completo", finalidade: "Identificação do usuário", baseLegal: "Art. 7º, III - Execução de políticas públicas" },
    { campo: "E-mail", finalidade: "Comunicação e identificação", baseLegal: "Art. 7º, III - Execução de políticas públicas" },
    { campo: "Cargo/Função", finalidade: "Controle de acesso", baseLegal: "Art. 23 - Finalidade pública" },
    { campo: "Perfil de acesso", finalidade: "Gestão de permissões", baseLegal: "Art. 23 - Finalidade pública" },
  ],
  recuperacao: [
    { campo: "E-mail", finalidade: "Envio de link de recuperação", baseLegal: "Art. 7º, V - Execução de contrato" },
  ],
  formulario: [
    { campo: "Dados informados", finalidade: "Prestação de serviços públicos", baseLegal: "Art. 7º, III - Execução de políticas públicas" },
  ],
};

export function LGPDPopup({ 
  tipo = "formulario", 
  position = "bottom", 
  className = "",
  onAccept,
  showAcceptButton = true
}: LGPDPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showAuditReport, setShowAuditReport] = useState(false);

  // Verificar se já aceitou anteriormente (localStorage)
  useEffect(() => {
    const accepted = localStorage.getItem(`lgpd_consent_${tipo}`);
    if (accepted === "true") {
      setHasAccepted(true);
    }
  }, [tipo]);

  const handleAccept = () => {
    localStorage.setItem(`lgpd_consent_${tipo}`, "true");
    localStorage.setItem(`lgpd_consent_${tipo}_date`, new Date().toISOString());
    setHasAccepted(true);
    setIsOpen(false);
    onAccept?.();
  };

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
  const campos = camposColetados[tipo];

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
          {hasAccepted && <Check className="w-3 h-3 text-green-600" />}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-700 transition-colors mt-2"
          aria-label="Informações sobre proteção de dados"
        >
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[10px] sm:text-xs">Todos os dados coletados respeitam as normas da LGPD</span>
          {hasAccepted && <Check className="w-3 h-3 text-green-600 flex-shrink-0" />}
        </button>
      )}

      {/* Modal/Popup */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50" 
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-3 sm:p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-white/20 p-1.5 sm:p-2 rounded-full">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-lg">Proteção de Dados - LGPD</h3>
                    <p className="text-[10px] sm:text-xs text-green-200">Lei Geral de Proteção de Dados</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo - Scrollable */}
            <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
              {/* Mensagem específica */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-green-800 mb-1 sm:mb-2 text-sm">{titulo}</h4>
                <p className="text-xs sm:text-sm text-green-700">{descricao}</p>
              </div>

              {/* Botão para ver relatório de auditoria */}
              <button
                type="button"
                onClick={() => setShowAuditReport(!showAuditReport)}
                className="w-full flex items-center justify-between p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-blue-800">
                    Relatório de Auditoria - Campos Coletados
                  </span>
                </div>
                <span className="text-blue-600 text-xs">{showAuditReport ? "▲" : "▼"}</span>
              </button>

              {/* Relatório de Auditoria */}
              {showAuditReport && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-3 py-2 border-b">
                    <h5 className="text-xs font-semibold text-gray-700">
                      Campos de Coleta de Dados - {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 sm:px-3 py-2 text-left font-semibold text-gray-700 border-b">Campo</th>
                          <th className="px-2 sm:px-3 py-2 text-left font-semibold text-gray-700 border-b">Finalidade</th>
                          <th className="px-2 sm:px-3 py-2 text-left font-semibold text-gray-700 border-b">Base Legal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campos.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-2 sm:px-3 py-2 font-medium text-gray-800 border-b">{item.campo}</td>
                            <td className="px-2 sm:px-3 py-2 text-gray-600 border-b">{item.finalidade}</td>
                            <td className="px-2 sm:px-3 py-2 text-gray-600 border-b text-[10px] sm:text-xs">{item.baseLegal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-3 py-2 bg-amber-50 border-t border-amber-200">
                    <p className="text-[10px] text-amber-700">
                      <strong>Nota:</strong> Este relatório é gerado automaticamente para fins de auditoria e conformidade com a LGPD.
                    </p>
                  </div>
                </div>
              )}

              {/* Informações gerais */}
              <div className="space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  A <strong>AGERJI - Agência Reguladora de Serviços Públicos Delegados do Município de Ji-Paraná</strong> está 
                  comprometida com a proteção dos seus dados pessoais, em conformidade com a Lei nº 13.709/2018 (LGPD).
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-amber-800 mb-1 sm:mb-2 text-xs sm:text-sm">Base Legal para Tratamento</h4>
                  <p className="text-[10px] sm:text-xs text-amber-700 leading-relaxed">
                    O tratamento de dados pessoais pela AGERJI é realizado com fundamento nas seguintes bases legais da LGPD:
                  </p>
                </div>
              </div>

              {/* Artigos da LGPD */}
              <div className="space-y-2">
                <div className="border-l-4 border-green-600 pl-2 sm:pl-3 py-1.5 sm:py-2 bg-gray-50 rounded-r">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-800">Art. 7º, inciso III</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                    Tratamento pela administração pública para execução de políticas públicas previstas em leis e regulamentos.
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-2 sm:pl-3 py-1.5 sm:py-2 bg-gray-50 rounded-r">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-800">Art. 7º, inciso V</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                    Tratamento necessário para execução de contrato ou procedimentos preliminares relacionados a contrato.
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-2 sm:pl-3 py-1.5 sm:py-2 bg-gray-50 rounded-r">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-800">Art. 23</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                    O tratamento de dados pessoais pelas pessoas jurídicas de direito público deverá ser realizado para o 
                    atendimento de sua finalidade pública, na persecução do interesse público.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-2 sm:pl-3 py-1.5 sm:py-2 bg-gray-50 rounded-r">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-800">Art. 26</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                    O uso compartilhado de dados pessoais pelo Poder Público deve atender a finalidades específicas de 
                    execução de políticas públicas e atribuição legal pelos órgãos e entidades públicas.
                  </p>
                </div>
              </div>

              {/* Direitos do titular */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-gray-800 mb-1.5 sm:mb-2 text-xs sm:text-sm">Seus Direitos (Art. 18 da LGPD)</h4>
                <ul className="text-[10px] sm:text-xs text-gray-600 space-y-0.5 sm:space-y-1">
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
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Para exercer seus direitos ou esclarecer dúvidas, entre em contato:
                </p>
                <p className="text-[10px] sm:text-xs font-medium text-green-700 mt-1">
                  agerji@ji-parana.ro.gov.br | (69) 3421-5996
                </p>
              </div>
            </div>

            {/* Footer com botões */}
            <div className="p-3 sm:p-4 bg-gray-50 border-t flex-shrink-0">
              {showAcceptButton ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    className="flex-1 text-xs sm:text-sm"
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Aceitar e Continuar
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm"
                >
                  Entendi
                </Button>
              )}
              {hasAccepted && (
                <p className="text-[10px] text-green-600 text-center mt-2">
                  ✓ Você aceitou os termos em {new Date(localStorage.getItem(`lgpd_consent_${tipo}_date`) || "").toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LGPDPopup;
