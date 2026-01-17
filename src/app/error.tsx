"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-destructive mb-4">Erro</h1>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Algo deu errado
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Ir para a Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
