import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

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
              Comprometidos en implementar soluciones de iluminación basadas en ciencia de datos desde 2023.
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
              Hacer que la planificación de iluminación sea accesible, clara y precisa para cualquier empresa, 
              brindando herramientas que permitan visualizar y optimizar sus espacios antes de invertir en soluciones reales.
            </p>
            <p className="text-muted-foreground text-pretty">
              Buscamos transformar la forma en que se diseñan los proyectos lumínicos, ofreciendo un simulador 
              intuitivo y potente que facilite decisiones fundamentadas con resultados confiables y realistas.
            </p>

              </div>
            </div>
          </section>


          

          <Card className="max-w-5xl mx-auto mb-20 border-2 overflow-hidden">
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-2 relative h-64 lg:h-auto">
                <img src="/led-lighting-laboratory-with-engineers-testing-equ.jpg" alt="Our story" className="w-full h-full object-cover" />
              </div>
              <CardContent className="lg:col-span-3 p-8 md:p-12 space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Nuestra Historia</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-pretty leading-relaxed">
                    LumiTech Solutions nació en 2023 cuando un grupo de ingenieros en sistemas
                    decidió aplicar algoritmos avanzados al diseño de iluminación industrial. Observamos que la mayoría
                    de proyectos se dimensionaban "a ojo" o con reglas muy generales, resultando en
                    sobredimensionamiento costoso o iluminación insuficiente.
                  </p>
                  <p className="text-pretty leading-relaxed">
                    Hoy, después de más de 500 proyectos completados para
                    nuestros clientes, seguimos innovando con tecnologías IoT y machine learning para hacer la
                    iluminación aún más inteligente y eficiente.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>

<div className="text-center mb-12">
  <h2 className="text-4xl font-bold text-foreground mb-4">Nuestro Equipo Directivo</h2>
  <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
    Liderazgo multidisciplinario con expertise en ingeniería, data science y gestión de proyectos
  </p>
</div>

<div className="max-w-xs mx-auto mb-16">
  <Card className="overflow-hidden hover:shadow-xl transition-all">
    <div className="aspect-square relative overflow-hidden">
      <img
        src="/jared.png"
        alt="Jared Leto"
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    <CardContent className="p-6 text-center space-y-2">
      <h3 className="font-semibold text-xl text-foreground">Jared Leto</h3>
      <p className="text-sm font-medium text-primary">CEO & Fundador</p>
      <p className="text-sm text-muted-foreground">
        Visión estratégica y liderazgo creativo en innovación tecnológica 
      </p>
    </CardContent>
  </Card>
</div>

<div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
  {[
    {
      name: "Ing. Luca Giordani",
      role: "Jefe de Data Science",
      expertise: "Modelado de datos y desarrollo de motores para simulación lumínica",
      image: "/luca.jpg",
    },
    {
      name: "Ing. Martín Forlini",
      role: "Ingeniero Especialista en Iluminación",
      expertise: "Fotometría aplicada y optimización técnica de proyectos lumínicos",
      image: "/martin.jpg",
    },
    
    {
      name: "Ing. Ulises Vetere",
      role: "Líder de Proyecto",
      expertise: "Simulación de interiores y diseño de experiencias visuales a medida",
      image: "/ulises.jpg",
    },
    {
      name: "Ing. Nicolás Sergio Sampaoli",
      role: "Director de Investigación",
      expertise: "Desarrollo y validación de modelos predictivos para simulación",
      image: "/sampa.png",
    },
  ].map((member, index) => (
    <Card key={index} className="overflow-hidden hover:shadow-xl transition-all">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={member.image}
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
