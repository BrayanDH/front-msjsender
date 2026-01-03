// Message types matching backend API responses
export type MessageStatus = "pending" | "queued" | "sent" | "delivered" | "failed" | "scheduled" | "cancelled"
export type MessageChannel = "whatsapp" | "sms"

export interface Message {
  id: string
  batch_id?: string
  recipient: string
  recipient_name?: string
  message: string
  channel: MessageChannel
  status: MessageStatus
  scheduled_at?: string
  queued_at?: string
  sent_at?: string
  delivered_at?: string
  error_message?: string
  created_at: string
  // Computed properties for UI
  date?: string // For backward compatibility
  scheduledDate?: string
}

export interface MessageFilters {
  status: string
  channel: string
  dateRange: string
  search: string
}

export interface MessageHistoryParams {
  skip?: number
  limit?: number
  status?: string
  channel?: string
  date_from?: string
  date_to?: string
  search?: string
}
