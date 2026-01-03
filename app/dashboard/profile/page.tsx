"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/features/auth/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Mail, 
  Calendar, 
  Shield,
  Key
} from "lucide-react"

export default function ProfilePage() {
  const { user, updateProfile, changePassword, refreshUser } = useAuthContext()
  const { toast } = useToast()
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    nombre: "",
    apellido: "",
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
      })
    }
  }, [user])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    setProfileSuccess(false)
    setProfileError(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setPasswordSuccess(false)
    setPasswordError(null)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(false)
    setIsSavingProfile(true)

    try {
      await updateProfile(profileData)
      setProfileSuccess(true)
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido guardada correctamente.",
      })
    } catch (err) {
      if (err instanceof Error) {
        setProfileError(err.message)
      } else {
        setProfileError("Error al actualizar el perfil")
      }
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("Las contraseñas nuevas no coinciden")
      return
    }

    if (passwordData.new_password.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres")
      return
    }

    setIsSavingPassword(true)

    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      })
      setPasswordSuccess(true)
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente.",
      })
    } catch (err) {
      if (err instanceof Error) {
        setPasswordError(err.message)
      } else {
        setPasswordError("Error al cambiar la contraseña")
      }
    } finally {
      setIsSavingPassword(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Perfil de Usuario</h1>
          <p className="text-muted-foreground text-pretty">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Account Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-balance flex items-center gap-2">
              <User className="size-5" />
              Información de la Cuenta
            </CardTitle>
            <CardDescription className="text-pretty">
              Detalles de tu cuenta y estado actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Correo Electrónico</p>
                  <p className="text-sm text-muted-foreground">{user?.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Rol</p>
                  <Badge variant={user?.rol === "admin" ? "default" : "secondary"} className="mt-1">
                    {user?.rol === "admin" ? "Administrador" : "Usuario"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Miembro desde</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.fecha_creacion ? formatDate(user.fecha_creacion) : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`size-3 rounded-full ${user?.activo ? "bg-green-500" : "bg-red-500"}`} />
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.activo ? "Cuenta activa" : "Cuenta inactiva"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-balance">Información Personal</CardTitle>
            <CardDescription className="text-pretty">
              Actualiza tus datos personales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {profileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}
              {profileSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Perfil actualizado correctamente</AlertDescription>
                </Alert>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Juan"
                    value={profileData.nombre}
                    onChange={handleProfileChange}
                    disabled={isSavingProfile}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    placeholder="Pérez"
                    value={profileData.apellido}
                    onChange={handleProfileChange}
                    disabled={isSavingProfile}
                    className="h-11"
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={isSavingProfile} className="h-11">
                {isSavingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-balance flex items-center gap-2">
              <Key className="size-5" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription className="text-pretty">
              Actualiza tu contraseña de acceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              {passwordSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Contraseña actualizada correctamente</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="current_password">Contraseña Actual</Label>
                <Input
                  id="current_password"
                  name="current_password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  disabled={isSavingPassword}
                  className="h-11"
                  autoComplete="current-password"
                />
              </div>
              
              <Separator />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">Nueva Contraseña</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    disabled={isSavingPassword}
                    className="h-11"
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirmar Contraseña</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    placeholder="Repite la nueva contraseña"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    disabled={isSavingPassword}
                    className="h-11"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              
              <Button type="submit" variant="outline" disabled={isSavingPassword} className="h-11">
                {isSavingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cambiando...
                  </>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
