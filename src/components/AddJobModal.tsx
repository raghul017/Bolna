'use client'

import { useState } from 'react'
import { X, Loader } from 'lucide-react'

interface AddJobModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddJobModal({ onClose, onSuccess }: AddJobModalProps) {
  const [form, setForm] = useState({
    title: '',
    department: '',
    minSalary: '',
    maxSalary: '',
    skills: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          minSalary: parseInt(form.minSalary) || 0,
          maxSalary: parseInt(form.maxSalary) || 0,
          skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create job')
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Create Job Posting</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              The AI agent will screen candidates for this role
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
              color: 'var(--text-secondary)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Job Title *</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Department *</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. Engineering"
                value={form.department}
                onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Min Salary (USD/yr)</label>
              <input
                className="input"
                type="number"
                placeholder="e.g. 120000"
                value={form.minSalary}
                onChange={e => setForm(p => ({ ...p, minSalary: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Max Salary (USD/yr)</label>
              <input
                className="input"
                type="number"
                placeholder="e.g. 180000"
                value={form.maxSalary}
                onChange={e => setForm(p => ({ ...p, maxSalary: e.target.value }))}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Required Skills (comma-separated)</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. React, TypeScript, Next.js, GraphQL"
              value={form.skills}
              onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Job Description</label>
            <textarea
              className="input"
              placeholder="Describe the role and responsibilities..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
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

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? (
                <><Loader size={14} className="animate-spin" />Creating...</>
              ) : (
                'Create Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
