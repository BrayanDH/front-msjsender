"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RecipientSourceSelector } from "./recipient-source-selector"
import { messagesService, type RecipientInfo, type SendMessageRequest } from "@/lib/messages-service"


export function ManualSendForm() {
  const [message, setMessage] = useState("")
  const [channels, setChannels] = useState<string[]>(["whatsapp"])
  const [sourceType, setSourceType] = useState<"manual" | "database" | "csv" | "json">("manual")
  const [recipients, setRecipients] = useState<RecipientInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRecipientsChange = (newRecipients: RecipientInfo[]) => {
    setRecipients(newRecipients)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (recipients.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un destinatario",
        variant: "destructive",
      })
      return
    }

    if (channels.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos un canal de envío",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const request: SendMessageRequest = {
        message,
        channels: channels as Array<'whatsapp' | 'sms'>,
        recipients,
      }

      const response = await messagesService.sendMessage(request)
      
      if (response.success) {
        toast({
          title: "Mensaje enviado",
          description: `Se enviaron ${response.data.messages_queued} mensajes exitosamente`,
        })
        // Reset form
        setMessage("")
        setRecipients([])
      }
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
            disabled={isLoading}
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
                disabled={isLoading}
              />
              <label
                htmlFor="whatsapp"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                WhatsApp
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sms" 
                checked={channels.includes("sms")} 
                onCheckedChange={() => toggleChannel("sms")}
                disabled={isLoading}
              />
              <label
                htmlFor="sms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                SMS
              </label>
            </div>
          </div>
        </div>

        <RecipientSourceSelector 
          onSourceChange={setSourceType}
          onRecipientsChange={handleRecipientsChange}
        />
      </div>

      <Button type="submit" className="w-full gap-2" disabled={isLoading || recipients.length === 0}>
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Enviar Ahora ({recipients.length} destinatario{recipients.length !== 1 ? 's' : ''})
          </>
        )}
      </Button>
    </form>
  )
}
