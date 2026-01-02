export type MessageChannel = "whatsapp" | "sms" | "both"
export type SendType = "instant" | "scheduled"

export interface SendMessagePayload {
  message: string
  channels: MessageChannel[]
  sendToAll: boolean
  recipient?: string
  scheduledDate?: string
  scheduledTime?: string
}

export interface BulkImportPayload {
  message: string
  channels: MessageChannel[]
  fileType: "csv" | "json" | "excel"
  file: File
}
