export type MessageStatus = "sent" | "pending" | "scheduled" | "failed"
export type MessageChannel = "whatsapp" | "sms"

export interface Message {
  id: string
  recipient: string
  message: string
  channel: MessageChannel
  status: MessageStatus
  date: string
  scheduledDate?: string
}

export interface MessageFilters {
  status: string
  channel: string
  dateRange: string
  search: string
}
