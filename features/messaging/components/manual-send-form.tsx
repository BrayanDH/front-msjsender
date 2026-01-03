"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RecipientSourceSelector } from "./recipient-source-selector"


export function ManualSendForm() {
  const [message, setMessage] = useState("")
  const [channels, setChannels] = useState<string[]>(["whatsapp"])
  const [sourceType, setSourceType] = useState<"manual" | "database" | "csv" | "json">("manual")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Mensaje enviado",
      description: "Tu mensaje ha sido enviado exitosamente",
    })
  }

  const toggleChannel = (channel: string) => {
    setChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            placeholder="Escribe tu mensaje aquí..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
          />
          <p className="text-xs text-muted-foreground">{message.length} caracteres</p>
        </div>

        <div className="space-y-2">
          <Label>Canales de Envío</Label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="whatsapp"
                checked={channels.includes("whatsapp")}
                onCheckedChange={() => toggleChannel("whatsapp")}
              />
              <label
                htmlFor="whatsapp"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                WhatsApp
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sms" checked={channels.includes("sms")} onCheckedChange={() => toggleChannel("sms")} />
              <label
                htmlFor="sms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                SMS
              </label>
            </div>
          </div>
        </div>

        <RecipientSourceSelector onSourceChange={setSourceType} />
      </div>

      <Button type="submit" className="w-full gap-2">
        <Send className="size-4" />
        Enviar Ahora
      </Button>
    </form>
  )
}
