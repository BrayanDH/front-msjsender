import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout"
import { MessageHistory } from "@/features/history/components/message-history"

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Historial de Mensajes</h1>
          <p className="text-muted-foreground text-pretty">
            Visualiza y gestiona todos los mensajes enviados y programados
          </p>
        </div>
        <MessageHistory />
      </div>
    </DashboardLayout>
  )
}
