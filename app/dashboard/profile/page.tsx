import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Perfil de Usuario</h1>
          <p className="text-muted-foreground text-pretty">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-balance">Información Personal</CardTitle>
            <CardDescription className="text-pretty">Actualiza tus datos de contacto y preferencias</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" placeholder="Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="juan@ejemplo.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" placeholder="Mi Empresa S.A." />
              </div>
              <Button type="submit">Guardar Cambios</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
