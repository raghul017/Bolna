// Bolna API Client

const BOLNA_BASE_URL = process.env.BOLNA_BASE_URL || 'https://api.bolna.dev'
const BOLNA_API_KEY = process.env.BOLNA_API_KEY || ''
const BOLNA_AGENT_ID = process.env.BOLNA_AGENT_ID || ''

export interface BolnaCallPayload {
  agent_id: string
  recipient_phone_number: string
  user_data?: Record<string, string>
}

export interface BolnaCallResponse {
  call_id: string
  status: string
  message?: string
}

export interface BolnaWebhookPayload {
  call_id: string
  agent_id: string
  status: string // 'completed' | 'failed' | 'no-answer'
  duration?: number
  transcript?: string
  recording_url?: string
  user_data?: Record<string, string>
}

export async function initiateCall(
  phoneNumber: string,
  userData: Record<string, string> = {}
): Promise<BolnaCallResponse> {
  const payload: BolnaCallPayload = {
    agent_id: BOLNA_AGENT_ID,
    recipient_phone_number: phoneNumber,
    user_data: userData,
  }

  const response = await fetch(`${BOLNA_BASE_URL}/call`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BOLNA_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Bolna API error: ${response.status} - ${error}`)
  }

  return response.json()
}

export async function getCallStatus(callId: string) {
  const response = await fetch(`${BOLNA_BASE_URL}/call/${callId}`, {
    headers: {
      Authorization: `Bearer ${BOLNA_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get call status: ${response.status}`)
  }

  return response.json()
}

export { BOLNA_AGENT_ID, BOLNA_API_KEY }
