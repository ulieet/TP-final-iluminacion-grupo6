import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PlanesPage() {
  const plans = [
    {
      name: "Básico",
      price: "$45.000",
      period: "/mes",
      description: "Ideal para pequeñas oficinas y espacios comerciales. Obtenga estimaciones rápidas y confiables.",
      features: [
        "Límite de Uso: Hasta 10 simulaciones mensuales",
        "Precisión: Banda de Incertidumbre Fija en ±10%",
        "Tecnología: Modelos LED y Fluorescente",
        "Luminarias: Acceso a modelos Estándar (L1 y F1)",
        "Reporte: Visualización de la simulación web y Resultados Analíticos básicos",
      ],
    },
    {
      name: "Profesional",
      price: "$80.000",
      period: "/mes",
      description: "Perfecto para consultoras y empresas que exigen alta precisión y flexibilidad en los proyectos.",
      featured: true,
      features: [
        "Simulaciones Ilimitadas en la plataforma web",
        "Precisión: Banda de Incertidumbre Elegible (±5% o ±10%)",
        "Luminarias: Biblioteca Ampliada (Incluye Alta Eficiencia L2 y F2)",
        "Reporte Técnico: Reportes completos exportables (PNG/PDF) con gráfico LS",
        "Acceso API para integración (Conteo de uso)",
        "Cálculos de ROI energético",
        "Soporte prioritario 24/7",
      ],
    },
    {
      name: "Empresarial",
      price: "Consultar",
      period: "",
      description: "Solución completa y escalable para grandes corporaciones, proyectos complejos e integración total.",
      features: [
        "Todo lo incluido en el Plan Profesional",
        "Integración BI: Exportación de Datos Brutos CSV/JSON",
        "Ingeniero de proyecto asignado dedicado",
        "Asesoría técnica y Video Llamadas para consultas",
        "Graficos Avanzados",
        "Garantía extendida 5 años y Mantenimiento predictivo",
        "Bot de IA para analizar construcciones propias"
      ],
    },
  
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">Planes y Servicios</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Elige el plan que mejor se adapte a las necesidades de tu proyecto. Todos incluyen acceso a nuestro
              simulador basado en mínimos cuadrados.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.featured ? "border-primary shadow-lg scale-105" : "border-border"}`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    Más Popular
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-pretty">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={plan.featured ? "default" : "outline"}>
                    <Link href="/#contacto">{plan.price === "Consultar" ? "Contactar Ventas" : "Comenzar Ahora"}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Services */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Servicios Adicionales</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Auditoría Energética",
                  description: "Análisis completo de consumo actual y potencial de ahorro con LED",
                 
                },
                {
                  title: "Instalación y Puesta en Marcha",
                  description: "Servicio integral de instalación por equipo certificado",
                 
                },
                {
                  title: "Capacitación Técnica",
                  description: "Formación para tu equipo en uso del simulador y mantenimiento",
                 
                },
                {
                  title: "Mantenimiento Anual",
                  description: "Revisiones programadas y reemplazo preventivo",
                
                },
              ].map((service, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/#contacto">Consultar</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
