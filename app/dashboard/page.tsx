import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout"
import { SendMessagePanel } from "@/features/messaging/components/send-message-panel"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Enviar Mensajes</h1>
          <p className="text-muted-foreground text-pretty">Crea y programa tus campañas de mensajería</p>
        </div>
        <SendMessagePanel />
      </div>
    </DashboardLayout>
  )
}
