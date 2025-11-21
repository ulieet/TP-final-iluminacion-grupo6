import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import SimulatorForm from "@/components/simulator-form"


export default function SimulatorPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Simulador de Dimensionamiento Lumínico
            </h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Calcula la solución de iluminación perfecta para tu espacio usando nuestro modelo validado por mínimos
              cuadrados.
            </p>
          </div>

          <SimulatorForm />
        </div>
      </div>

      <Footer />
    </div>
  )
}
