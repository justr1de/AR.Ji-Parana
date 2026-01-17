import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Target, Users, Scale } from "lucide-react";

export const metadata = {
  title: "Institucional - AGERJI",
  description: "Conheça a AGERJI - Agência Reguladora de Ji-Paraná",
};

export default function InstitucionalPage() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Institucional
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            A AGERJI - Agência Reguladora de Serviços Públicos Delegados do Município de Ji-Paraná
            é uma autarquia municipal responsável pela regulação e fiscalização dos serviços públicos
            delegados no município.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-6 w-6" />
                </div>
                <CardTitle>Sobre a AGERJI</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A AGERJI foi criada pela Lei Municipal nº 2.XXX/XXXX com a finalidade de regular,
                controlar e fiscalizar os serviços públicos delegados pelo Município de Ji-Paraná,
                garantindo a qualidade e a eficiência na prestação desses serviços à população.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <CardTitle>Missão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Regular e fiscalizar os serviços públicos delegados no município de Ji-Paraná,
                promovendo a qualidade, eficiência e modicidade tarifária, em benefício dos
                usuários e da sociedade.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Visão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ser reconhecida como uma agência reguladora de excelência, referência em
                transparência, eficiência e defesa dos direitos dos usuários de serviços
                públicos no estado de Rondônia.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Scale className="h-6 w-6" />
                </div>
                <CardTitle>Valores</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2">
                <li>• Transparência e ética</li>
                <li>• Eficiência e qualidade</li>
                <li>• Imparcialidade e independência</li>
                <li>• Responsabilidade social</li>
                <li>• Participação social</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Competências */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Competências</h2>
          <div className="bg-secondary/30 rounded-lg p-6">
            <ul className="space-y-3 text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">I.</span>
                <span>Regular e fiscalizar os serviços de saneamento básico;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">II.</span>
                <span>Regular e fiscalizar os serviços de transporte público coletivo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">III.</span>
                <span>Regular e fiscalizar os serviços de manejo de resíduos sólidos;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">IV.</span>
                <span>Estabelecer normas técnicas e padrões de qualidade;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">V.</span>
                <span>Fixar, reajustar e revisar tarifas;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">VI.</span>
                <span>Aplicar penalidades aos prestadores de serviços;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">VII.</span>
                <span>Promover audiências e consultas públicas;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">VIII.</span>
                <span>Receber e processar reclamações dos usuários.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Estrutura */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Estrutura Organizacional</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground">Conselho Diretor</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Órgão colegiado deliberativo
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground">Diretoria Técnica</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Fiscalização e regulação
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground">Diretoria Administrativa</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Gestão e suporte
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
