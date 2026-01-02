"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function BulkImportForm() {
  const [message, setMessage] = useState("")
  const [fileType, setFileType] = useState("csv")
  const [channels, setChannels] = useState<string[]>(["whatsapp"])
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Archivo cargado",
      description: "Los contactos han sido importados exitosamente",
    })
  }

  const toggleChannel = (channel: string) => {
    setChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bulk-message">Mensaje</Label>
          <Textarea
            id="bulk-message"
            placeholder="Escribe tu mensaje aquí..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label>Formato de Archivo</Label>
          <RadioGroup value={fileType} onValueChange={setFileType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <label htmlFor="csv" className="text-sm font-medium leading-none">
                CSV (Comma-separated values)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <label htmlFor="json" className="text-sm font-medium leading-none">
                JSON (JavaScript Object Notation)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excel" id="excel" />
              <label htmlFor="excel" className="text-sm font-medium leading-none">
                Excel (XLSX)
              </label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Cargar Archivo</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <FileText className="size-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2 text-pretty">
              Arrastra tu archivo aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-muted-foreground text-pretty">Formatos aceptados: CSV, JSON, XLSX (máx. 10MB)</p>
            <input type="file" id="file" className="hidden" accept=".csv,.json,.xlsx" />
          </div>
          <p className="text-xs text-muted-foreground text-pretty">
            Tu archivo debe contener columnas: nombre, numero, correo
          </p>
        </div>

        <div className="space-y-2">
          <Label>Canales de Envío</Label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bulk-whatsapp"
                checked={channels.includes("whatsapp")}
                onCheckedChange={() => toggleChannel("whatsapp")}
              />
              <label htmlFor="bulk-whatsapp" className="text-sm font-medium leading-none">
                WhatsApp
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="bulk-sms" checked={channels.includes("sms")} onCheckedChange={() => toggleChannel("sms")} />
              <label htmlFor="bulk-sms" className="text-sm font-medium leading-none">
                SMS
              </label>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full gap-2">
        <Upload className="size-4" />
        Importar y Enviar
      </Button>
    </form>
  )
}
