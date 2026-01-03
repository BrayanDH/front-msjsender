import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Zap, Shield, BarChart3, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-8 text-primary" />
            <span className="text-xl font-bold text-balance">MensajeríaPro</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Características
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Precios
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Empezar Gratis</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-balance leading-tight">
            Envía mensajes masivos con <span className="text-primary">precisión y control</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
            Plataforma profesional para gestionar campañas de WhatsApp y SMS. Programa envíos, segmenta audiencias y
            obtén reportes detallados.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Comenzar Ahora
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-balance">Todo lo que necesitas para crecer</h2>
          <p className="text-muted-foreground text-pretty">Herramientas profesionales al alcance de tu mano</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="size-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-balance">Envíos Programados</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Programa tus mensajes para el momento óptimo. Define fechas y horarios específicos.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <MessageSquare className="size-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-balance">Multi-Canal</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Envía por WhatsApp, SMS o ambos canales simultáneamente desde una sola plataforma.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="size-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-balance">Segmentación Inteligente</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Selecciona destinatarios específicos o envía a todos. Importa contactos desde CSV o JSON.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <BarChart3 className="size-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-balance">Reportes Detallados</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Visualiza el estado de cada mensaje. Filtra por fecha y exporta tus reportes.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="size-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-balance">Envíos Instantáneos</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cuando la urgencia importa, envía mensajes al instante a toda tu base de contactos.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Shield className="size-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-balance">Base de Datos Integrada</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gestiona todos tus contactos en un solo lugar. Sincronización automática.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-balance">Comienza a enviar mensajes hoy mismo</h2>
          <p className="text-muted-foreground mb-8 text-pretty">
            Únete a miles de empresas que confían en nuestra plataforma
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Crear Cuenta Gratis
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-6 text-primary" />
              <span className="font-semibold">MensajeríaPro</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 MensajeríaPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
