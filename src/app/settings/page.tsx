'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Settings, Key, Webhook, Bot, Save, CheckCircle, Copy } from 'lucide-react'

const AGENT_PROMPT = `You are Aria, a professional AI recruiter assistant for our company. You conduct friendly and structured initial phone screenings.

Your goal is to complete a 5-minute screening call by asking these questions in order:

1. "Can you briefly walk me through your current role and years of experience?"
2. "What is your current notice period, and when would you be available to start?"
3. "What are your salary expectations for this role?"
4. "Why are you considering leaving your current position?"
5. "Do you have hands-on experience with [JOB_SKILL]? Can you give me a quick example?"

RULES:
- Be warm, concise, and professional at all times
- Listen actively and acknowledge responses before moving to the next question
- If a candidate seems very disinterested or aggressive, politely end the call
- Collect all 5 answers before ending the call
- End with: "Thank you so much for your time! Our recruiting team will review your responses and get back to you within 2 business days."

Do NOT make any promises about hiring decisions.
Do NOT discuss internal salary budgets or team structure.`

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [agentId, setAgentId] = useState('')
  const [webhookUrl, setWebhookUrl] = useState(
    typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/bolna` : ''
  )

  const handleSave = () => {
    // In production, these would be saved to env vars via API
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(AGENT_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Settings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Configure your Bolna voice agent integration
          </p>
        </div>

        <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
          {/* API Config */}
          <div className="card">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={18} color="#6d28d9" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Bolna API Configuration</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Connect your Bolna account to enable AI calls</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Bolna API Key</label>
                <input
                  className="input"
                  type="password"
                  placeholder="bn_live_xxxxxxxxxxxxx"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Found at app.bolna.dev → Settings → API Keys
                </span>
              </div>

              <div className="input-group">
                <label className="input-label">Agent ID</label>
                <input
                  className="input"
                  type="text"
                  placeholder="agent_xxxxxxxxxxxxxxxx"
                  value={agentId}
                  onChange={e => setAgentId(e.target.value)}
                />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Your Bolna agent ID (create it below using the prompt)
                </span>
              </div>

              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 13,
                color: '#1d4ed8',
              }}>
                ℹ️ To apply these, add them to your <code style={{ background: '#dbeafe', padding: '2px 6px', borderRadius: 4 }}>.env</code> file as <code style={{ background: '#dbeafe', padding: '2px 6px', borderRadius: 4 }}>BOLNA_API_KEY</code> and <code style={{ background: '#dbeafe', padding: '2px 6px', borderRadius: 4 }}>BOLNA_AGENT_ID</code>, then restart the server.
              </div>

              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Configuration</>}
              </button>
            </div>
          </div>

          {/* Webhook Config */}
          <div className="card">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Webhook size={18} color="#15803d" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Webhook URL</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Configure this in your Bolna agent settings</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                flex: 1,
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                padding: '10px 14px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: '#4ade80',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {webhookUrl || 'http://localhost:3000/api/webhooks/bolna'}
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  navigator.clipboard.writeText(webhookUrl)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>
              For production: use your Vercel deployment URL. For local testing: use ngrok to expose localhost.
            </p>

            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 10,
              padding: '12px 16px',
              fontSize: 13,
              color: '#b45309',
              marginTop: 12,
            }}>
              ⚡ <strong>Quick test:</strong> Install ngrok, run <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4 }}>ngrok http 3000</code>, and paste the HTTPS URL + <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4 }}>/api/webhooks/bolna</code> into your Bolna agent.
            </div>
          </div>

          {/* Agent Prompt */}
          <div className="card">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="#6d28d9" />
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700 }}>Agent Prompt</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Copy this into your Bolna agent configuration</p>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={copyPrompt}>
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>

            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 10,
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              maxHeight: 400,
              overflowY: 'auto',
            }}>
              {AGENT_PROMPT}
            </div>
          </div>

          {/* Integration Guide */}
          <div className="card">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={18} color="#1d4ed8" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Integration Steps</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>How to set up Bolna with RecruitAI</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { step: '01', title: 'Create Bolna Account', desc: 'Sign up at app.bolna.dev and create a new project.' },
                { step: '02', title: 'Create AI Agent', desc: 'Go to Agents → New Agent → paste the prompt above.' },
                { step: '03', title: 'Set Webhook URL', desc: 'In agent settings, set the webhook URL to your deployment URL + /api/webhooks/bolna.' },
                { step: '04', title: 'Get API Credentials', desc: 'Copy your API key from Settings → API Keys, and your Agent ID from the agent page.' },
                { step: '05', title: 'Add to .env', desc: 'Set BOLNA_API_KEY and BOLNA_AGENT_ID in your .env file and restart.' },
                { step: '06', title: 'Test the Flow', desc: 'Add a candidate, click "Screen", and watch the agent call them!' },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: '#f5f3ff',
                    border: '1px solid #ddd6fe',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: '#6d28d9', flexShrink: 0,
                  }}>
                    {step}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
