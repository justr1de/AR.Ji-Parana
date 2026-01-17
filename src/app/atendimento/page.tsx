"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function AtendimentoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "contato",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envio - será substituído por integração real com Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="py-12">
        <div className="container max-w-2xl">
          <Card className="text-center">
            <CardContent className="py-12">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Mensagem Enviada!
              </h2>
              <p className="text-muted-foreground mb-6">
                Sua mensagem foi recebida com sucesso. Entraremos em contato em breve.
              </p>
              <Button onClick={() => setSubmitted(false)}>
                Enviar nova mensagem
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Atendimento
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Entre em contato conosco. Estamos à disposição para atender suas
            dúvidas, sugestões e reclamações.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Endereço</p>
                    <p className="text-sm text-muted-foreground">
                      Ji-Paraná, Rondônia
                      <br />
                      CEP: 76900-000
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Telefone</p>
                    <p className="text-sm text-muted-foreground">(69) 3421-0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">E-mail</p>
                    <p className="text-sm text-muted-foreground">
                      contato@agerji.ji-parana.ro.gov.br
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Horário</p>
                    <p className="text-sm text-muted-foreground">
                      Segunda a Sexta
                      <br />
                      07:30 às 13:30
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-4">
                <h3 className="font-semibold text-primary mb-2">Ouvidoria</h3>
                <p className="text-sm text-muted-foreground">
                  Para denúncias, reclamações ou elogios sobre os serviços
                  regulados, utilize nossa ouvidoria.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Nome completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Tipo de contato *
                      </label>
                      <select
                        id="type"
                        name="type"
                        required
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="contato">Contato</option>
                        <option value="ouvidoria">Ouvidoria</option>
                        <option value="denuncia">Denúncia</option>
                        <option value="sugestao">Sugestão</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Assunto *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    {loading ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
