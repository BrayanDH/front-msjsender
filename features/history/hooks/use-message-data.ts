"use client"

import { useState, useEffect } from "react"
import type { Message, MessageFilters } from "../types/message"

// Mock data generator
const generateMockMessages = (): Message[] => {
  return [
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
    {
      id: "4",
      recipient: "+52 444 987 6543",
      message: "Confirmación de compra #12345",
      channel: "sms",
      status: "pending",
      date: "2025-01-02 11:45",
    },
    {
      id: "5",
      recipient: "+52 333 222 1111",
      message: "Tu paquete ha sido entregado",
      channel: "whatsapp",
      status: "failed",
      date: "2025-01-01 16:20",
    },
    {
      id: "6",
      recipient: "+52 222 333 4444",
      message: "Gracias por tu compra. Código de seguimiento: ABC123",
      channel: "whatsapp",
      status: "sent",
      date: "2025-01-01 14:10",
    },
    {
      id: "7",
      recipient: "+52 111 222 3333",
      message: "Tu suscripción vence en 3 días",
      channel: "sms",
      status: "sent",
      date: "2024-12-30 09:00",
    },
    {
      id: "8",
      recipient: "+52 999 888 7777",
      message: "Nuevo producto disponible en tu tienda favorita",
      channel: "whatsapp",
      status: "scheduled",
      date: "2025-01-10 15:00",
    },
  ]
}

export function useMessageData(filters: MessageFilters) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      let data = generateMockMessages()

      // Apply filters
      if (filters.status !== "all") {
        data = data.filter((msg) => msg.status === filters.status)
      }
      if (filters.channel !== "all") {
        data = data.filter((msg) => msg.channel === filters.channel)
      }
      if (filters.search) {
        data = data.filter(
          (msg) =>
            msg.recipient.toLowerCase().includes(filters.search.toLowerCase()) ||
            msg.message.toLowerCase().includes(filters.search.toLowerCase()),
        )
      }

      setMessages(data)
      setIsLoading(false)
    }, 300)
  }, [filters])

  return { messages, isLoading }
}
