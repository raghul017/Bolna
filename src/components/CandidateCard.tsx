'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, Clock, ChevronRight, PhoneCall, Loader } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  status: string
  score: number | null
  callDuration: number | null
  createdAt: string
  job: { title: string; department: string }
}

interface CandidateCardProps {
  candidate: Candidate
  onCallInitiated?: () => void
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'badge-gray' },
  CALLING: { label: 'Calling…', className: 'badge-blue' },
  COMPLETED: { label: 'Under Review', className: 'badge-yellow' },
  SHORTLISTED: { label: 'Shortlisted', className: 'badge-green' },
  REJECTED: { label: 'Rejected', className: 'badge-red' },
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'
  const circumference = 2 * Math.PI * 16
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="16" fill="none" stroke="#f3f4f6" strokeWidth="3" />
        <circle
          cx="22" cy="22" r="16"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color,
      }}>
        {score}
      </span>
    </div>
  )
}

export default function CandidateCard({ candidate, onCallInitiated }: CandidateCardProps) {
  const [calling, setCalling] = useState(false)
  const status = statusConfig[candidate.status] || statusConfig.PENDING
  const isCallingNow = candidate.status === 'CALLING'

  const handleCall = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCalling(true)

    try {
      const res = await fetch('/api/calls/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: candidate.id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      alert(`✅ Call initiated! Call ID: ${data.callId}`)
      onCallInitiated?.()
    } catch (err) {
      alert(`❌ ${err instanceof Error ? err.message : 'Failed to initiate call'}`)
    } finally {
      setCalling(false)
    }
  }

  return (
    <Link href={`/candidates/${candidate.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="card animate-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '16px 20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--accent-primary)',
          flexShrink: 0,
        }}>
          {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {candidate.name}
            </span>
            <span className={`badge ${status.className}`} style={{ flexShrink: 0 }}>
              {isCallingNow && <span className="animate-call-pulse" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#2563eb', marginRight: 4 }} />}
              {status.label}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Mail size={11} /> {candidate.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Phone size={11} /> {candidate.phone}
            </span>
          </div>
          <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
            {candidate.job.title} · {candidate.job.department}
          </div>
        </div>

        {/* Score / Duration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {candidate.score !== null ? (
            <ScoreCircle score={candidate.score} />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f9fafb', border: '1px dashed var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
              —
            </div>
          )}
          {candidate.callDuration && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Clock size={9} /> {Math.floor(candidate.callDuration / 60)}m {candidate.callDuration % 60}s
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {(candidate.status === 'PENDING' || candidate.status === 'COMPLETED') && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCall}
              disabled={calling}
              style={{ fontSize: 12 }}
            >
              {calling ? (
                <Loader size={12} className="animate-spin" />
              ) : (
                <PhoneCall size={12} />
              )}
              {calling ? 'Calling...' : 'Screen'}
            </button>
          )}
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>
      </div>
    </Link>
  )
}
