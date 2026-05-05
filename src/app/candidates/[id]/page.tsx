'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import {
  ArrowLeft, Phone, Mail, Clock, PhoneCall, Loader,
  CheckCircle, XCircle, Download, Play, Star, User,
  Briefcase, Calendar, MessageSquare
} from 'lucide-react'

interface ScoreBreakdown {
  experience: number
  availability: number
  salaryFit: number
  communication: number
  total: number
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  status: string
  score: number | null
  scoreBreakdown: string | null
  transcript: string | null
  recordingUrl: string | null
  callId: string | null
  callDuration: number | null
  answers: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  job: {
    id: string
    title: string
    department: string
    minSalary: number
    maxSalary: number
    skills: string
  }
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PENDING: { label: 'Pending Screen', color: '#9898b0', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
  CALLING: { label: 'Calling…', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
  COMPLETED: { label: 'Under Review', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  SHORTLISTED: { label: 'Shortlisted ✓', color: '#4ade80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  REJECTED: { label: 'Rejected', color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100
  const color = pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontWeight: 700, color }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: 3,
          transition: 'width 1s ease',
          boxShadow: `0 0 8px ${color}50`,
        }} />
      </div>
    </div>
  )
}

export default function CandidateDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [calling, setCalling] = useState(false)
  const [updating, setUpdating] = useState(false)

  const loadCandidate = useCallback(async () => {
    try {
      const res = await fetch(`/api/candidates/${id}`)
      if (!res.ok) throw new Error('Not found')
      setCandidate(await res.json())
    } catch {
      router.push('/candidates')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    loadCandidate()
  }, [loadCandidate])

  const handleCall = async () => {
    setCalling(true)
    try {
      const res = await fetch('/api/calls/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: candidate?.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      alert(`✅ Call initiated! ID: ${data.callId}`)
      await loadCandidate()
    } catch (err) {
      alert(`❌ ${err instanceof Error ? err.message : 'Failed'}`)
    } finally {
      setCalling(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true)
    try {
      await fetch(`/api/candidates/${candidate?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      await loadCandidate()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size={32} className="animate-spin" color="var(--accent-primary)" />
        </main>
      </div>
    )
  }

  if (!candidate) return null

  const status = statusConfig[candidate.status] || statusConfig.PENDING
  const scoreBreakdown: ScoreBreakdown | null = candidate.scoreBreakdown
    ? JSON.parse(candidate.scoreBreakdown)
    : null
  const answers = candidate.answers ? JSON.parse(candidate.answers) : {}
  const skills = candidate.job.skills ? JSON.parse(candidate.job.skills) : []

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {/* Header */}
        <div style={{ padding: '24px 40px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={16} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800 }}>{candidate.name}</h1>
              <span style={{
                padding: '3px 12px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                color: status.color,
                background: status.bg,
                border: `1px solid ${status.border}`,
              }}>
                {status.label}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
              {candidate.job.title} · {candidate.job.department}
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            {candidate.status !== 'SHORTLISTED' && (
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleStatusUpdate('SHORTLISTED')}
                disabled={updating}
              >
                <CheckCircle size={14} />
                Shortlist
              </button>
            )}
            {candidate.status !== 'REJECTED' && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleStatusUpdate('REJECTED')}
                disabled={updating}
              >
                <XCircle size={14} />
                Reject
              </button>
            )}
            {(candidate.status === 'PENDING' || candidate.status === 'COMPLETED') && (
              <button className="btn btn-primary btn-sm" onClick={handleCall} disabled={calling}>
                {calling ? <Loader size={14} className="animate-spin" /> : <PhoneCall size={14} />}
                {calling ? 'Calling...' : 'Screen Again'}
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Candidate Info */}
            <div className="card">
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Candidate Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { icon: User, label: 'Full Name', value: candidate.name },
                  { icon: Mail, label: 'Email', value: candidate.email },
                  { icon: Phone, label: 'Phone', value: candidate.phone },
                  { icon: Briefcase, label: 'Applied Role', value: `${candidate.job.title}` },
                  { icon: Calendar, label: 'Added', value: new Date(candidate.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                  { icon: Clock, label: 'Call Duration', value: candidate.callDuration ? formatDuration(candidate.callDuration) : 'Not screened yet' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color="var(--text-muted)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Answers */}
            {Object.keys(answers).length > 0 && (
              <div className="card">
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
                  <MessageSquare size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                  Screening Answers
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { key: 'experience', label: '💼 Experience' },
                    { key: 'noticePeriod', label: '📅 Notice Period' },
                    { key: 'salaryExpectation', label: '💰 Salary Expectation' },
                    { key: 'reasonForLeaving', label: '🔄 Reason for Leaving' },
                  ].filter(({ key }) => answers[key]).map(({ key, label }) => (
                    <div key={key} style={{ padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>{answers[key]}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transcript */}
            {candidate.transcript && (
              <div className="card">
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
                  <MessageSquare size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                  Call Transcript
                </h2>
                <div style={{
                  background: 'var(--bg-primary)',
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)',
                  padding: '16px',
                  maxHeight: 400,
                  overflowY: 'auto',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  lineHeight: 1.8,
                }}>
                  {candidate.transcript.split('\n').map((line, i) => {
                    const isAria = line.startsWith('Aria:')
                    const isSpeaker = line.includes(':')
                    return (
                      <div key={i} style={{
                        marginBottom: 4,
                        color: isAria ? '#a78bfa' : isSpeaker ? '#60a5fa' : 'var(--text-secondary)',
                        paddingLeft: isSpeaker ? 0 : 16,
                      }}>
                        {line}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Score Card */}
            {candidate.score !== null && (
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>AI Screen Score</div>
                  <div style={{
                    fontSize: 56,
                    fontWeight: 900,
                    color: candidate.score >= 80 ? '#22c55e' : candidate.score >= 60 ? '#f59e0b' : '#ef4444',
                    lineHeight: 1,
                    textShadow: `0 0 40px ${candidate.score >= 80 ? 'rgba(34,197,94,0.4)' : candidate.score >= 60 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'}`,
                  }}>
                    {candidate.score}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>/ 100</div>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 16px',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 20,
                  background: candidate.score >= 80 ? 'rgba(34,197,94,0.1)' : candidate.score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                  color: candidate.score >= 80 ? '#4ade80' : candidate.score >= 60 ? '#fbbf24' : '#f87171',
                  border: `1px solid ${candidate.score >= 80 ? 'rgba(34,197,94,0.3)' : candidate.score >= 60 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
                }}>
                  <Star size={13} fill="currentColor" />
                  {candidate.score >= 80 ? 'Excellent Candidate' : candidate.score >= 60 ? 'Good Candidate' : 'Below Threshold'}
                </div>

                {scoreBreakdown && (
                  <div style={{ textAlign: 'left' }}>
                    <ScoreBar label="Experience Match" value={scoreBreakdown.experience} max={30} />
                    <ScoreBar label="Availability" value={scoreBreakdown.availability} max={20} />
                    <ScoreBar label="Salary Fit" value={scoreBreakdown.salaryFit} max={25} />
                    <ScoreBar label="Communication" value={scoreBreakdown.communication} max={25} />
                  </div>
                )}
              </div>
            )}

            {/* Job Details */}
            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Job Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Role</span>
                  <span style={{ fontWeight: 600 }}>{candidate.job.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Department</span>
                  <span style={{ fontWeight: 600 }}>{candidate.job.department}</span>
                </div>
                {candidate.job.minSalary > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Budget</span>
                    <span style={{ fontWeight: 600 }}>
                      ${(candidate.job.minSalary / 1000).toFixed(0)}k – ${(candidate.job.maxSalary / 1000).toFixed(0)}k
                    </span>
                  </div>
                )}
                {skills.length > 0 && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Required Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {skills.map((skill: string) => (
                        <span key={skill} className="badge badge-purple" style={{ fontSize: 11 }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recording */}
            {candidate.recordingUrl && (
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Call Recording</h3>
                <a
                  href={candidate.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Play size={14} />
                  Play Recording
                </a>
                <a
                  href={candidate.recordingUrl}
                  download
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                >
                  <Download size={12} />
                  Download
                </a>
              </div>
            )}

            {/* Bolna Call Info */}
            {candidate.callId && (
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Call Details</h3>
                <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', wordBreak: 'break-all' }}>
                  Call ID: {candidate.callId}
                </div>
              </div>
            )}

            {/* No screening yet CTA */}
            {!candidate.transcript && candidate.status === 'PENDING' && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.08))',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 16,
                padding: 24,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📞</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Not Screened Yet</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                  Start an AI phone screening to evaluate this candidate.
                </p>
                <button className="btn btn-primary" onClick={handleCall} disabled={calling} style={{ width: '100%', justifyContent: 'center' }}>
                  {calling ? <Loader size={14} className="animate-spin" /> : <PhoneCall size={14} />}
                  {calling ? 'Initiating Call...' : 'Start AI Screen'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
