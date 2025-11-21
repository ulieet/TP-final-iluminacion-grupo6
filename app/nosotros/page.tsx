import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Target, Users, Zap, Building2, Globe } from "lucide-react"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
 

      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background/70 z-10" />
          <img src="/professional-business-team-collaborating-in-modern.jpg" alt="Our team" className="w-full h-full object-cover" />
        </div>

        <div className="container mx-auto relative z-20">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance leading-tight">
              Sobre LumiTech Solutions
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Pioneros en soluciones de iluminación basadas en ciencia de datos y comprometidos con la eficiencia
              energética desde 2015.
            </p>
          </div>
        </div>
      </section>

      <div className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <section className="py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl" />
                <img
                  src="/modern-sustainable-office-building-with-led-lighti.jpg"
                  alt="Our mission"
                  className="relative rounded-xl shadow-2xl w-full"
                />
              </div>
              <div className="space-y-6">
                
                <h2 className="text-4xl font-bold text-foreground">Nuestra Misión</h2>
                <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                  Democratizar el acceso a soluciones de iluminación científicamente optimizadas, permitiendo a empresas
                  de todos los tamaños reducir su consumo energético mientras mejoran la calidad lumínica de sus
                  espacios.
                </p>
                <p className="text-muted-foreground text-pretty">
                  Nos comprometemos a transformar la industria de la iluminación mediante la aplicación de algoritmos
                  avanzados y modelos predictivos que garantizan resultados medibles y sostenibles.
                </p>
              </div>
            </div>
          </section>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <Card className="border-2">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Nuestra Visión</h2>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Ser la empresa líder en Latinoamérica en soluciones de iluminación inteligente, reconocida por nuestra
                  innovación tecnológica y compromiso con la sostenibilidad ambiental.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Compromiso Ambiental</h2>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Cada proyecto que desarrollamos contribuye a la reducción de la huella de carbono. Hasta la fecha,
                  hemos ayudado a evitar más de 8,500 toneladas de CO₂ mediante la optimización energética.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          

          <Card className="max-w-5xl mx-auto mb-20 border-2 overflow-hidden">
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-2 relative h-64 lg:h-auto">
                <img src="/led-lighting-laboratory-with-engineers-testing-equ.jpg" alt="Our story" className="w-full h-full object-cover" />
              </div>
              <CardContent className="lg:col-span-3 p-8 md:p-12 space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Nuestra Historia</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-pretty leading-relaxed">
                    LumiTech Solutions nació en 2015 cuando un grupo de ingenieros electrónicos y científicos de datos
                    decidió aplicar algoritmos avanzados al diseño de iluminación industrial. Observamos que la mayoría
                    de proyectos se dimensionaban "a ojo" o con reglas muy generales, resultando en
                    sobredimensionamiento costoso o iluminación insuficiente.
                  </p>
                  <p className="text-pretty leading-relaxed">
                    Desarrollamos nuestro primer modelo de regresión por mínimos cuadrados recopilando datos de más de
                    200 instalaciones reales. Este modelo nos permitió predecir con precisión del 98% los lúmenes
                    requeridos para cualquier tipo de ambiente.
                  </p>
                  <p className="text-pretty leading-relaxed">
                    Hoy, después de más de 500 proyectos completados y un ahorro acumulado de más de 15 GWh para
                    nuestros clientes, seguimos innovando con tecnologías IoT y machine learning para hacer la
                    iluminación aún más inteligente y eficiente.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Team */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Nuestro Equipo Directivo</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Liderazgo multidisciplinario con expertise en ingeniería, data science y gestión de proyectos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Dr. Martín Rodriguez",
                role: "CEO & Fundador",
                expertise: "PhD en Ingeniería Eléctrica - MIT",
                image: "/professional-male-engineer-ceo-portrait-in-busines.jpg",
              },
              {
                name: "Ing. Laura Fernández",
                role: "Directora Técnica",
                expertise: "Especialista en Fotometría - 15 años exp.",
                image: "/professional-female-engineer-portrait-in-business-.jpg",
              },
              {
                name: "Dr. Carlos Mendoza",
                role: "Jefe de Data Science",
                expertise: "PhD en Estadística Aplicada - Stanford",
                image: "/professional-male-data-scientist-portrait-in-busin.jpg",
              },
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 text-center space-y-2">
                  <h3 className="font-semibold text-xl text-foreground">{member.name}</h3>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.expertise}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
