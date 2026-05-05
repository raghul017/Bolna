'use client'

import { useEffect, useState, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import { Phone, Clock, CheckCircle, XCircle, AlertCircle, PhoneOff } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  status: string
  score: number | null
  callId: string | null
  callDuration: number | null
  updatedAt: string
  job: { title: string }
}

export default function CallLogsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/candidates')
      const data = await res.json()
      // Only show candidates that have been called
      setCandidates(data.filter((c: Candidate) => c.status !== 'PENDING'))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [loadData])

  const statusIcon = (status: string) => {
    switch (status) {
      case 'SHORTLISTED': return <CheckCircle size={16} color="#22c55e" />
      case 'COMPLETED': return <AlertCircle size={16} color="#f59e0b" />
      case 'REJECTED': return <XCircle size={16} color="#ef4444" />
      case 'CALLING': return <Phone size={16} color="#60a5fa" />
      default: return <PhoneOff size={16} color="#6b7280" />
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Call Logs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            All AI screening calls made by the Bolna agent
          </p>
        </div>

        <div style={{ padding: '24px 40px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 64 }} />)}
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
                padding: '14px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                <span>Candidate</span>
                <span>Role</span>
                <span>Status</span>
                <span>Score</span>
                <span>Duration</span>
                <span>Date</span>
              </div>

              {candidates.length === 0 ? (
                <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Phone size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <div>No calls yet. Start screening candidates!</div>
                </div>
              ) : (
                candidates.map((c, i) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
                      padding: '16px 20px',
                      borderBottom: i < candidates.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      alignItems: 'center',
                      transition: 'background 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    onClick={() => window.location.href = `/candidates/${c.id}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(124,58,237,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#a78bfa',
                      }}>
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                        {c.callId && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{c.callId.slice(0, 16)}...</div>}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.job.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      {statusIcon(c.status)}
                      <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{c.status === 'CALLING' ? 'Live' : c.status.charAt(0) + c.status.slice(1).toLowerCase()}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.score ? (c.score >= 80 ? '#22c55e' : c.score >= 60 ? '#f59e0b' : '#ef4444') : 'var(--text-muted)' }}>
                      {c.score ?? '—'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <Clock size={12} />
                      {c.callDuration ? `${Math.floor(c.callDuration / 60)}m ${c.callDuration % 60}s` : '—'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
