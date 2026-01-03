"use client"

import { useState, useEffect } from "react"
import { messagesService } from "@/lib/messages-service"
import type { Message, MessageFilters } from "../types/message"

// Helper to format date for UI display
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Helper to compute date range
const getDateRange = (range: string): { date_from?: string; date_to?: string } => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (range) {
    case "today":
      return { date_from: today.toISOString() }
    case "week": {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return { date_from: weekAgo.toISOString() }
    }
    case "month": {
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return { date_from: monthAgo.toISOString() }
    }
    case "all":
    default:
      return {}
  }
}

export function useMessageData(filters: MessageFilters) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Build API filters
        const dateRange = getDateRange(filters.dateRange)
        const apiFilters = {
          skip: 0,
          limit: 100, // Adjust as needed
          status: filters.status !== "all" ? filters.status : undefined,
          channel: filters.channel !== "all" ? filters.channel : undefined,
          search: filters.search || undefined,
          ...dateRange,
        }

        // Remove undefined values
        Object.keys(apiFilters).forEach(key => {
          if (apiFilters[key as keyof typeof apiFilters] === undefined) {
            delete apiFilters[key as keyof typeof apiFilters]
          }
        })

        console.log("[useMessageData] Fetching with filters:", apiFilters)

        const response = await messagesService.getMessageHistory(apiFilters)

        // Transform backend messages to UI format
        const transformedMessages: Message[] = response.messages.map(msg => ({
          ...msg,
          // Add computed date property for backward compatibility
          date: formatDate(msg.sent_at || msg.queued_at || msg.created_at),
          scheduledDate: msg.scheduled_at ? formatDate(msg.scheduled_at) : undefined,
        }))

        setMessages(transformedMessages)
        setTotal(response.total)
        console.log(`[useMessageData] Loaded ${transformedMessages.length} messages (total: ${response.total})`)
      } catch (err) {
        console.error("[useMessageData] Error fetching messages:", err)
        setError(err instanceof Error ? err.message : "Error al cargar mensajes")
        setMessages([])
        setTotal(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [filters.status, filters.channel, filters.dateRange, filters.search])

  return { messages, isLoading, error, total }
}
