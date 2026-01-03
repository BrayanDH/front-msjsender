// Channels Service - Connects to Channels API
// Handles channel status, configuration, and provider management

import { AUTH_STORAGE_KEYS } from './api-config'

// API Base URL
const CHANNELS_API_URL = process.env.NEXT_PUBLIC_CHANNELS_API_URL || 'http://localhost:8095'

// Types for channel responses
export interface WhatsAppStatus {
  connected: boolean
  provider?: string
  active_provider?: string
  whatsapp_number?: string
  sandbox?: boolean
  message?: string
}

export interface SMSStatus {
  configured: boolean
  provider?: string
  active_provider?: string
  phone_number?: string
  message?: string
}

export interface ChannelsStatusResponse {
  whatsapp: WhatsAppStatus
  sms: SMSStatus
  available_providers: {
    whatsapp: {
      meta: boolean
      twilio: boolean
    }
    sms: {
      plivo: boolean
      twilio: boolean
    }
  }
  pricing_note?: Record<string, Record<string, string>>
}

export interface BalanceResponse {
  balance: number
  currency: string
  estimated_sms?: number
  error?: string
}

export interface BalancesResponse {
  plivo?: BalanceResponse
  twilio?: BalanceResponse
}

export interface SendResult {
  success: boolean
  message_sid?: string
  status?: string
  error?: string
  details?: string
  provider_used?: string
  channel?: string
}

class ChannelsService {
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

    const url = `${CHANNELS_API_URL}${endpoint}`
    console.log(`[ChannelsService] ${options.method || 'GET'} ${url}`)

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'Unknown Error',
        detail: `Error ${response.status}`,
      }))
      
      console.error('[ChannelsService] Error:', errorData)
      throw new Error(
        typeof errorData.detail === 'string'
          ? errorData.detail
          : JSON.stringify(errorData.detail)
      )
    }

    return response.json()
  }

  /**
   * Get unified channels status (WhatsApp + SMS with all providers)
   */
  async getChannelsStatus(): Promise<ChannelsStatusResponse> {
    const response = await this.makeRequest<{ success: boolean; data: ChannelsStatusResponse }>(
      '/api/v1/channels/send/status',
      { method: 'GET' }
    )
    return response.data
  }

  /**
   * Get WhatsApp specific status
   */
  async getWhatsAppStatus(): Promise<WhatsAppStatus> {
    const response = await this.makeRequest<{ success: boolean; data: WhatsAppStatus }>(
      '/api/v1/channels/whatsapp/status',
      { method: 'GET' }
    )
    return response.data
  }

  /**
   * Get SMS specific status
   */
  async getSMSStatus(): Promise<SMSStatus> {
    const response = await this.makeRequest<{ success: boolean; data: SMSStatus }>(
      '/api/v1/channels/sms/status',
      { method: 'GET' }
    )
    return response.data
  }

  /**
   * Get account balances for all configured providers
   */
  async getBalances(): Promise<BalancesResponse> {
    const response = await this.makeRequest<{ success: boolean; data: BalancesResponse }>(
      '/api/v1/channels/send/balances',
      { method: 'GET' }
    )
    return response.data
  }

  /**
   * Get SMS account balance
   */
  async getSMSBalance(): Promise<BalanceResponse> {
    const response = await this.makeRequest<{ success: boolean; data: BalanceResponse }>(
      '/api/v1/channels/sms/balance',
      { method: 'GET' }
    )
    return response.data
  }

  /**
   * Send message via unified endpoint (auto-selects channel/provider)
   */
  async sendUnified(
    to: string,
    message: string,
    channel: 'whatsapp' | 'sms' | 'auto' = 'auto',
    provider?: string
  ): Promise<SendResult> {
    const body: Record<string, string> = { to, message, channel }
    if (provider) body.provider = provider

    const response = await this.makeRequest<{ success: boolean; data: SendResult }>(
      '/api/v1/channels/send',
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    )
    return response.data
  }

  /**
   * Send WhatsApp message directly
   */
  async sendWhatsApp(to: string, message: string): Promise<SendResult> {
    const response = await this.makeRequest<{ success: boolean; data: SendResult }>(
      '/api/v1/channels/whatsapp/send',
      {
        method: 'POST',
        body: JSON.stringify({ to, message }),
      }
    )
    return response.data
  }

  /**
   * Send SMS message directly
   */
  async sendSMS(to: string, message: string): Promise<SendResult> {
    const response = await this.makeRequest<{ success: boolean; data: SendResult }>(
      '/api/v1/channels/sms/send',
      {
        method: 'POST',
        body: JSON.stringify({ to, message }),
      }
    )
    return response.data
  }
}

// Export singleton instance
export const channelsService = new ChannelsService()
export default channelsService
