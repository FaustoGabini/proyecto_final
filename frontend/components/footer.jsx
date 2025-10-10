import { Building2, Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">InmoIA</span>
            </div>
            <p className="text-muted-foreground max-w-md text-pretty">
              Plataforma de búsqueda de propiedades impulsada por Inteligencia Artificial. Encontrá tu hogar ideal
              usando lenguaje natural.
            </p>
            <div className="pt-2">
              <p className="text-sm font-medium text-foreground mb-2">Proyecto Final</p>
              <p className="text-sm text-muted-foreground">Ingeniería en Informática</p>
              <p className="text-sm text-muted-foreground">Universidad Nacional del Litoral (UNL)</p>
              <p className="text-sm text-muted-foreground">2025</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Plataforma</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cómo funciona
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Buscar propiedades
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre InmoIA
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Conectá con nosotros</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@inmoia.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  info@inmoia.com
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 InmoIA. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacidad
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
