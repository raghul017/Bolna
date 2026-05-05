'use client'

import { useState } from 'react'
import { X, Phone, User, Briefcase, Loader } from 'lucide-react'

interface Job {
  id: string
  title: string
  department: string
}

interface AddCandidateModalProps {
  jobs: Job[]
  onClose: () => void
  onSuccess: () => void
}

export default function AddCandidateModal({ jobs, onClose, onSuccess }: AddCandidateModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    jobId: jobs[0]?.id || '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add candidate')
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Add Candidate</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Add a candidate to trigger an AI screening call
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Name */}
          <div className="input-group">
            <label className="input-label">
              <User size={12} style={{ display: 'inline', marginRight: 4 }} />
              Full Name *
            </label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Sarah Mitchell"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label className="input-label">Email Address *</label>
            <input
              className="input"
              type="email"
              placeholder="e.g. sarah@gmail.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          {/* Phone */}
          <div className="input-group">
            <label className="input-label">
              <Phone size={12} style={{ display: 'inline', marginRight: 4 }} />
              Phone Number * (with country code)
            </label>
            <input
              className="input"
              type="tel"
              placeholder="e.g. +1-555-0101"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              required
            />
          </div>

          {/* Job */}
          <div className="input-group">
            <label className="input-label">
              <Briefcase size={12} style={{ display: 'inline', marginRight: 4 }} />
              Applying For *
            </label>
            <select
              className="input"
              value={form.jobId}
              onChange={e => setForm(p => ({ ...p, jobId: e.target.value }))}
              required
            >
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.department}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="input-group">
            <label className="input-label">Notes (optional)</label>
            <textarea
              className="input"
              placeholder="Any notes about this candidate..."
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#f87171',
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Candidate'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
