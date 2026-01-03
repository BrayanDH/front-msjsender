"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RecipientSourceSelector } from "./recipient-source-selector"


export function ScheduledSendForm() {
  const [message, setMessage] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [channels, setChannels] = useState<string[]>(["whatsapp"])
  const [sourceType, setSourceType] = useState<"manual" | "database" | "csv" | "json">("manual")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Mensaje programado",
      description: `Tu mensaje se enviará el ${date} a las ${time}`,
    })
  }

  const toggleChannel = (channel: string) => {
    setChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scheduled-message">Mensaje</Label>
          <Textarea
            id="scheduled-message"
            placeholder="Escribe tu mensaje aquí..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Hora</Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Canales de Envío</Label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheduled-whatsapp"
                checked={channels.includes("whatsapp")}
                onCheckedChange={() => toggleChannel("whatsapp")}
              />
              <label htmlFor="scheduled-whatsapp" className="text-sm font-medium leading-none">
                WhatsApp
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheduled-sms"
                checked={channels.includes("sms")}
                onCheckedChange={() => toggleChannel("sms")}
              />
              <label htmlFor="scheduled-sms" className="text-sm font-medium leading-none">
                SMS
              </label>
            </div>
          </div>
        </div>

        <RecipientSourceSelector onSourceChange={setSourceType} />
      </div>

      <Button type="submit" className="w-full gap-2">
        <Calendar className="size-4" />
        Programar Envío
      </Button>
    </form>
  )
}
