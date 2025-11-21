import Link from "next/link"
import { Lightbulb, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LumiTech</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Soluciones de iluminación inteligente basadas en ciencia y tecnología.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/nosotros"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/planes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Planes y Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/simulador"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Simulador
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/documentacion"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentación Técnica
                </Link>
              </li>
              <li>
                <Link
                  href="/casos-estudio"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Casos de Estudio
                </Link>
              </li>
              <li>
                <Link href="/soporte" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Soporte Técnico
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5" />
                <span>info@lumitech.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5" />
                <span>+54 11 4567-8900</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LumiTech Solutions. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
