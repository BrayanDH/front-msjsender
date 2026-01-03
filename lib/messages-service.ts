// Messages Service - Connects to Messages API
// Handles message sending, scheduling, and history retrieval

import { AUTH_STORAGE_KEYS } from './api-config'

// API Base URL
const MESSAGES_API_URL = process.env.NEXT_PUBLIC_MESSAGES_API_URL || 'http://localhost:8082'

// Types matching backend models
export interface RecipientInfo {
  phone: string
  name?: string
}

export interface SendMessageRequest {
  message: string
  channel?: 'whatsapp' | 'sms'
  channels?: Array<'whatsapp' | 'sms'>
  recipient?: RecipientInfo
  recipients?: RecipientInfo[]
  group_id?: string
  send_to_all?: boolean
  contact_ids?: string[]
  template_id?: string
}

export interface ScheduleMessageRequest {
  message: string
  channel: 'whatsapp' | 'sms'
  recipients: RecipientInfo[]
  scheduled_at: string // ISO 8601 datetime
  timezone?: string
}

export interface MessageHistoryFilters {
  skip?: number
  limit?: number
  status?: string
  channel?: string
  date_from?: string // ISO 8601 datetime
  date_to?: string // ISO 8601 datetime
  search?: string
}

export interface MessageResponse {
  id: string
  batch_id?: string
  recipient: string
  recipient_name?: string
  message: string
  channel: string
  status: string
  scheduled_at?: string
  queued_at?: string
  sent_at?: string
  delivered_at?: string
  error_message?: string
  created_at: string
}

export interface MessageHistoryResponse {
  messages: MessageResponse[]
  total: number
  skip: number
  limit: number
}

export interface SendMessageResponse {
  success: boolean
  data: {
    batch_id: string
    messages_queued: number
    estimated_time: string
    messages: Array<{
      message_id: string
      recipient: string
      channel: string
      status: string
    }>
  }
  message: string
}

export interface ScheduleMessageResponse {
  success: boolean
  data: {
    schedule_id: string
    batch_id: string
    scheduled_at: string
    timezone: string
    recipients_count: number
    status: string
  }
  message: string
}

export interface ApiErrorResponse {
  error: string
  detail: string | Record<string, any>
}

class MessagesService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const url = `${MESSAGES_API_URL}${endpoint}`
    console.log(`[MessagesService] ${options.method || 'GET'} ${url}`)

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'Unknown Error',
        detail: `Error ${response.status}`,
      })) as ApiErrorResponse
      
      console.error('[MessagesService] Error:', errorData)
      throw new Error(
        typeof errorData.detail === 'string'
          ? errorData.detail
          : JSON.stringify(errorData.detail)
      )
    }

    return response.json()
  }

  /**
   * Send instant message to one or multiple recipients
   */
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    return this.makeRequest<SendMessageResponse>('/api/v1/messages/send', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Schedule a message for future sending
   */
  async scheduleMessage(data: ScheduleMessageRequest): Promise<ScheduleMessageResponse> {
    return this.makeRequest<ScheduleMessageResponse>('/api/v1/messages/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Get message history with filters and pagination
   */
  async getMessageHistory(filters: MessageHistoryFilters = {}): Promise<MessageHistoryResponse> {
    const params = new URLSearchParams()
    
    if (filters.skip !== undefined) params.append('skip', filters.skip.toString())
    if (filters.limit !== undefined) params.append('limit', filters.limit.toString())
    if (filters.status) params.append('status', filters.status)
    if (filters.channel) params.append('channel', filters.channel)
    if (filters.date_from) params.append('date_from', filters.date_from)
    if (filters.date_to) params.append('date_to', filters.date_to)
    if (filters.search) params.append('search', filters.search)

    const queryString = params.toString()
    const endpoint = `/api/v1/messages/history${queryString ? `?${queryString}` : ''}`

    const response = await this.makeRequest<{ success: boolean; data: MessageHistoryResponse }>(endpoint, {
      method: 'GET',
    })

    return response.data
  }

  /**
   * Get detailed status of a single message
   */
  async getMessage(messageId: string): Promise<MessageResponse> {
    const response = await this.makeRequest<{ success: boolean; data: MessageResponse }>(
      `/api/v1/messages/${messageId}`,
      { method: 'GET' }
    )
    return response.data
  }

  /**
   * Cancel a scheduled message
   */
  async cancelMessage(messageId: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>(
      `/api/v1/messages/${messageId}/cancel`,
      { method: 'POST' }
    )
  }

  /**
   * Retry a failed message
   */
  async retryMessage(messageId: string): Promise<{ success: boolean; data: any; message: string }> {
    return this.makeRequest<{ success: boolean; data: any; message: string }>(
      `/api/v1/messages/${messageId}/retry`,
      { method: 'POST' }
    )
  }

  /**
   * Get batch details
   */
  async getBatch(batchId: string): Promise<any> {
    const response = await this.makeRequest<{ success: boolean; data: any }>(
      `/api/v1/batches/${batchId}`,
      { method: 'GET' }
    )
    return response.data
  }
}

// Export singleton instance
export const messagesService = new MessagesService()
export default messagesService
