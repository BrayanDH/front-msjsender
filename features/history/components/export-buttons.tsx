"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { exportToCSV, exportToJSON, exportToExcel } from "../utils/export-utils"
import type { Message } from "../types/message"

const mockMessages: Message[] = [
  {
    id: "1",
    recipient: "+52 123 456 7890",
    message: "Hola, tu pedido está en camino",
    channel: "whatsapp",
    status: "sent",
    date: "2025-01-02 10:30",
  },
  {
    id: "2",
    recipient: "+52 987 654 3210",
    message: "Recordatorio: Tu cita es mañana a las 9am",
    channel: "sms",
    status: "sent",
    date: "2025-01-02 09:15",
  },
  {
    id: "3",
    recipient: "+52 555 123 4567",
    message: "¡Oferta especial! 50% de descuento",
    channel: "whatsapp",
    status: "scheduled",
    date: "2025-01-05 14:00",
  },
]

export function ExportButtons() {
  const { toast } = useToast()

  const handleExport = (format: "csv" | "json" | "excel") => {
    try {
      switch (format) {
        case "csv":
          exportToCSV(mockMessages, "mensajes")
          break
        case "json":
          exportToJSON(mockMessages, "mensajes")
          break
        case "excel":
          exportToExcel(mockMessages, "mensajes")
          break
      }

      toast({
        title: "Exportación exitosa",
        description: `Archivo ${format.toUpperCase()} descargado correctamente`,
      })
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudo exportar el archivo. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="size-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Formato de Exportación</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2">
          <FileText className="size-4" />
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")} className="gap-2">
          <FileJson className="size-4" />
          Exportar como JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2">
          <FileSpreadsheet className="size-4" />
          Exportar como Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
