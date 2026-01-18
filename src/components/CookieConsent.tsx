"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie, Shield } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Pequeno delay para a animação de entrada
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    closePopup();
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    closePopup();
  };

  const closePopup = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isAnimating ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-2xl">
        <div className="container py-4 md:py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
            {/* Ícone e Texto */}
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                    Política de Cookies e Privacidade
                  </h3>
                </div>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  A AGERJI utiliza cookies para melhorar sua experiência de navegação, 
                  analisar o tráfego do site e personalizar conteúdo. Em conformidade com a{" "}
                  <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>, 
                  solicitamos seu consentimento para o uso de cookies.{" "}
                  <Link 
                    href="/privacidade" 
                    className="text-primary hover:underline font-medium"
                  >
                    Saiba mais sobre nossa Política de Privacidade
                  </Link>
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <button
                onClick={handleAcceptNecessary}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
              >
                Apenas Necessários
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
              >
                Aceitar Todos
              </button>
            </div>

            {/* Botão Fechar */}
            <button
              onClick={handleAcceptNecessary}
              className="absolute top-2 right-2 lg:relative lg:top-auto lg:right-auto p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Informação adicional */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center lg:text-left">
              Ao continuar navegando, você concorda com o uso de cookies essenciais para o funcionamento do site.
              Você pode alterar suas preferências a qualquer momento nas configurações de privacidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
