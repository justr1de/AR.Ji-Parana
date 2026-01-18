import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Target, Users, Scale, FileText, Calendar } from "lucide-react";

export const metadata = {
  title: "Institucional - AGERJI",
  description: "Conheça a AGERJI - Agência Reguladora de Serviços Públicos Delegados do Município de Ji-Paraná",
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
            é uma autarquia municipal especial, dotada de autonomia administrativa, financeira e
            patrimonial, responsável pela regulação e fiscalização dos serviços públicos delegados
            no município de Ji-Paraná, estado de Rondônia.
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
              <p className="text-muted-foreground mb-4">
                A AGERJI foi criada pela <strong>Lei Municipal nº 2.271, de 07 de março de 2012</strong>,
                com a finalidade de regular, controlar e fiscalizar os serviços públicos delegados
                pelo Município de Ji-Paraná, garantindo a qualidade e a eficiência na prestação
                desses serviços à população.
              </p>
              <p className="text-muted-foreground">
                A agência passou por alterações através da <strong>Lei nº 3.643/2023</strong>,
                que modernizou sua estrutura e ampliou suas competências regulatórias.
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
                usuários e da sociedade, assegurando o equilíbrio econômico-financeiro dos
                contratos e a universalização do acesso aos serviços essenciais.
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
                públicos no estado de Rondônia e na região Norte do Brasil.
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
                <li>• Transparência e ética na gestão pública</li>
                <li>• Eficiência e qualidade nos serviços</li>
                <li>• Imparcialidade e independência técnica</li>
                <li>• Responsabilidade social e ambiental</li>
                <li>• Participação e controle social</li>
                <li>• Defesa do interesse público</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Legislação */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <FileText className="h-7 w-7 text-primary" />
            Legislação de Criação
          </h2>
          <div className="bg-secondary/30 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-background rounded-lg border">
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Lei Municipal nº 2.271/2012</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cria a Agência Reguladora de Serviços Públicos Delegados do Município de
                    Ji-Paraná - AGERJI e estabelece suas competências, estrutura organizacional
                    e regime jurídico.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Publicada em 07 de março de 2012
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-background rounded-lg border">
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Lei Municipal nº 3.643/2023</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Altera dispositivos da Lei nº 2.271/2012, modernizando a estrutura da AGERJI
                    e ampliando suas competências regulatórias.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Publicada em 2023
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competências */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Competências</h2>
          <div className="bg-secondary/30 rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              Conforme estabelecido no art. 4º da Lei Municipal nº 2.271/2012, compete à AGERJI:
            </p>
            <ul className="space-y-3 text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">I.</span>
                <span>Regular e fiscalizar os serviços de abastecimento de água e esgotamento sanitário;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">II.</span>
                <span>Regular e fiscalizar os serviços de limpeza urbana e manejo de resíduos sólidos;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">III.</span>
                <span>Regular e fiscalizar os serviços de drenagem e manejo de águas pluviais;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">IV.</span>
                <span>Estabelecer normas técnicas, padrões de qualidade e indicadores de desempenho;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">V.</span>
                <span>Fixar, reajustar e revisar tarifas, taxas e outros preços públicos;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">VI.</span>
                <span>Aplicar penalidades aos prestadores de serviços em caso de descumprimento;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">VII.</span>
                <span>Promover audiências e consultas públicas para participação da sociedade;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">VIII.</span>
                <span>Receber, apurar e solucionar reclamações dos usuários dos serviços;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">IX.</span>
                <span>Editar resoluções, portarias e demais atos normativos no âmbito de sua competência.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Estrutura */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Estrutura Organizacional</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground text-lg">Diretoria Presidente</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Órgão executivo de direção superior, responsável pela gestão geral da autarquia
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground text-lg">Diretoria Técnica</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Responsável pela fiscalização, regulação e análise técnica dos serviços
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground text-lg">Diretoria Administrativa</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Gestão administrativa, financeira e de recursos humanos
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Associação ABAR */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Associação</h2>
          <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
            <p className="text-foreground">
              A AGERJI é membro da <strong>ABAR - Associação Brasileira de Agências Reguladoras</strong>,
              entidade que reúne as agências reguladoras do Brasil e promove a cooperação técnica,
              o intercâmbio de experiências e o fortalecimento institucional do setor regulatório
              brasileiro.
            </p>
            <a
              href="https://abar.org.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline font-medium"
            >
              Visite o site da ABAR →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
