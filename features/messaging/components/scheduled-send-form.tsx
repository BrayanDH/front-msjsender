"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Users, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RecipientSourceSelector } from "./recipient-source-selector"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ScheduledSendForm() {
  const [message, setMessage] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [channels, setChannels] = useState<string[]>(["whatsapp"])
  const [recipientType, setRecipientType] = useState<"single" | "multiple">("single")
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

        <div className="space-y-3">
          <Label>Tipo de Envío</Label>
          <RadioGroup
            value={recipientType}
            onValueChange={(value: "single" | "multiple") => setRecipientType(value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="scheduled-single" />
              <label htmlFor="scheduled-single" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <User className="size-4" />
                Una persona
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiple" id="scheduled-multiple" />
              <label
                htmlFor="scheduled-multiple"
                className="flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <Users className="size-4" />
                Múltiples personas
              </label>
            </div>
          </RadioGroup>
        </div>

        <RecipientSourceSelector onSourceChange={setSourceType} recipientType={recipientType} />
      </div>

      <Button type="submit" className="w-full gap-2">
        <Calendar className="size-4" />
        Programar Envío
      </Button>
    </form>
  )
}
