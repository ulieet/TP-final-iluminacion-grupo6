import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  Calculator,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Users,
  Phone,
  Mail,
  Clock,
  LineChart,
  Target,
  Lightbulb,
  FileText,
  Home,
  Briefcase,
  School,
  Building, // Añadido para ambientes corporativos/genéricos
  Palette, // Añadido para creatividad/diseño (ej. sala de reuniones)
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="relative h-[500px] flex items-center mt-20">
        <img
          src="/modern-corporate-office-with-professional-led-ligh.jpg"
          alt="Iluminación profesional LED"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Soluciones de Iluminación LED Profesional
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Diseño de simulador interactivo para la integracion luminica en espacios requeridos
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/simulador">
                <Calculator className="w-5 h-5 mr-2" />
                Calcular Iluminación
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-5">Transformando el Dimensionamiento Lumínico</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-5">

              <p className="text-base text-muted-foreground leading-relaxed mt-15">
                Somos una empresa especializada en soluciones de iluminación profesional, dedicada a integrar tecnología,
                diseño y eficiencia en cada proyecto. Combinamos criterios técnicos rigurosos con herramientas digitales
                modernas para facilitar el dimensionamiento lumínico en ambientes como aulas, oficinas y salas de reuniones.
              </p>

              <p className="text-base text-muted-foreground leading-relaxed">
                Para lograr esto desarrollamos <strong>LumiDimension</strong>, un simulador inteligente que utiliza modelos
                matemáticos basados en mínimos cuadrados (LS) y datos reales. La herramienta estima los lúmenes requeridos
                según superficie y tipo de ambiente, recomienda la cantidad óptima de luminarias (LED o fluorescentes),
                calcula la potencia instalada y verifica automáticamente el cumplimiento del nivel de lux objetivo.
              </p>


              <p className="text-base text-muted-foreground leading-relaxed">
                Nuestro objetivo es ofrecer una experiencia simple, confiable y técnicamente sólida para que arquitectos,
                instaladores y estudiantes puedan dimensionar soluciones lumínicas completas en segundos.
              </p>
            </div>


            <div className="relative h-full">
              <img
                src="/modern-living-room-with-elegant-led-accent-lightin.jpg"
                alt="Instalación de iluminación LED"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Simulador Lumínico Profesional</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Nuestra herramienta estrella utiliza modelos matemáticos para calcular con precisión
              científica las necesidades lumínicas de su proyecto!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
              <img
                src="simuladoryjared.png"
                alt="Simulador de iluminación"
                className="relative w-full h-[400px] object-cover rounded-2xl shadow-2xl"
              />
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Ventajas del Simulador</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <LineChart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">Cálculo Preciso</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Algoritmo validado que garantiza precisión en la estimación de lúmenes requeridos de acuerdo al proyecto
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">Dimensionamiento Óptimo</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Calcula la cantidad exacta de luminarias necesarias según tipo de ambiente (aula, oficina, sala
                        de reuniones) y tecnología (LED/fluorescente)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">Cumplimiento Normativo</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Verifica automáticamente si el diseño cumple con los niveles de lux objetivo según normativas
                        internacionales de iluminación
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">Bandas de Incertidumbre</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Muestra rangos de variación (±5% / ±10%) basados en el error estadístico del modelo para una
                        planificación más robusta
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="flex-1">
                  <Link href="/simulador">
                    <Calculator className="w-5 h-5 mr-2" />
                    Probar Simulador
                  </Link>
                </Button>
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN ACTUALIZADA con 5 ambientes y las imágenes originales (sin la lámpara de mesa) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-3">Soluciones Lumínicas para Diversos Ambientes</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {[
              {
                title: "OFICINAS Y ESPACIOS CORPORATIVOS",
                subtitle: "Iluminación eficiente que mejora la productividad y el bienestar laboral.",
                image: "/oficina.jpg", 
              },
              {
                title: "AULAS Y CENTROS EDUCATIVOS",
                subtitle: "Ambientes lumínicos que favorecen la concentración y el aprendizaje.",
                image: "/aula.jpg", 
              },
              {
                title: "SALAS DE REUNIONES",
                subtitle: "Diseños versátiles para presentaciones, videollamadas y colaboración efectiva.",
                image: "/empresarial.jpg", 
              },
             
            
            ].map((category, index) => (
              <Card key={index} className="overflow-hidden border-border group hover:shadow-xl transition-all">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-sm text-white/90 mb-4">{category.subtitle}</p>
                    
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* FIN SECCIÓN ACTUALIZADA */}

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/professional-business-team-meeting-in-modern-offic.jpg"
                alt="Asesoramiento profesional"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">ASESORAMIENTO</h2>

              <p className="text-base text-muted-foreground leading-relaxed">
              Te acompañamos a aprovechar al máximo nuestro simulador de iluminación, brindándote orientación para evaluar diferentes configuraciones, niveles 
              y tipos de luz antes de implementarlos. Analizamos junto a vos cómo cada ajuste impacta en la apariencia, funcionalidad y rendimiento del espacio.
              Nuestro objetivo es que el simulador se convierta en una herramienta clave para optimizar tus proyectos con seguridad y claridad.
              </p>
              
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">¿Por qué elegir LumiTech?</h2>
            <p className="text-base text-muted-foreground text-pretty leading-relaxed">
              Combinamos ciencia de datos con expertise en iluminación para ofrecer soluciones precisas y eficientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Tecnología LED",
                description:
                  "Soluciones con última tecnología LED que reducen consumo energético hasta un 60% vs. fluorescentes.",
              },
              {
                icon: TrendingUp,
                title: "Optimización de Costos",
                description:
                  "Dimensionamiento real que evita sobredimensionar, ahorrando en inversión inicial y consumo.",
              },
              {
                icon: Award,
                title: "Certificación ISO",
                description: "Procesos certificados bajo normas ISO 9001 e ISO 50001 de gestión energética.",
              },
              {
                icon: Users,
                title: "Soporte Personalizado",
                description:
                  "Equipo de ingenieros especializados disponibles para asesoramiento técnico durante todo el proyecto.",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background" id="contacto">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-3">Consulte con Nuestros Profesionales</h2>
            <p className="text-base text-muted-foreground">
              Estamos a su disposición para brindarle el asesoramiento que necesita. Complete el formulario y nos
              pondremos en contacto a la brevedad.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Teléfono</h3>
                  <p className="text-primary hover:underline cursor-pointer">+54 11 5555 8888</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-primary hover:underline cursor-pointer">contacto@lumitechsolutions.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Horario de Atención</h3>
                  <p className="text-muted-foreground">Lunes a Viernes: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nombre Completo <span className="text-destructive">*</span>
                    </Label>
                    <Input id="name" placeholder="Juan Pérez" className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input id="email" type="email" placeholder="juan@ejemplo.com" className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Teléfono <span className="text-destructive">*</span>
                    </Label>
                    <Input id="phone" placeholder="+54 11 1234 5678" className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">
                      Empresa
                    </Label>
                    <Input id="company" placeholder="Nombre de su empresa" className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      Mensaje <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Cuéntenos cómo podemos ayudarle..."
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-[#E4715C] hover:bg-[#E4715C]/90 text-white font-medium"
                  >
                    Enviar Consulta
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">* Campos obligatorios</p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}