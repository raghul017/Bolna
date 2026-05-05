'use client'

import { useEffect, useState, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import CandidateCard from '@/components/CandidateCard'
import AddCandidateModal from '@/components/AddCandidateModal'
import { Plus, Search, Filter, Users } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  status: string
  score: number | null
  callDuration: number | null
  createdAt: string
  job: { id: string; title: string; department: string }
}

interface Job {
  id: string
  title: string
  department: string
}

const STATUS_FILTERS = ['ALL', 'PENDING', 'CALLING', 'COMPLETED', 'SHORTLISTED', 'REJECTED']

const statusLabels: Record<string, string> = {
  ALL: 'All',
  PENDING: 'Pending',
  CALLING: 'In Call',
  COMPLETED: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  REJECTED: 'Rejected',
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [jobFilter, setJobFilter] = useState('ALL')

  const loadData = useCallback(async () => {
    try {
      const [cRes, jRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/jobs'),
      ])
      const [candidates, jobs] = await Promise.all([cRes.json(), jRes.json()])
      setCandidates(candidates)
      setJobs(jobs)
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

  const filtered = candidates.filter(c => {
    const matchStatus = filter === 'ALL' || c.status === filter
    const matchJob = jobFilter === 'ALL' || c.job.id === jobFilter
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchJob && matchSearch
  })

  const countByStatus = (s: string) => candidates.filter(c => s === 'ALL' ? true : c.status === s).length

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {/* Header */}
        <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Candidates</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {candidates.length} total · {candidates.filter(c => c.status === 'SHORTLISTED').length} shortlisted
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} />
              Add Candidate
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 40px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input"
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>

            {/* Job filter */}
            <select
              className="input"
              value={jobFilter}
              onChange={e => setJobFilter(e.target.value)}
              style={{ width: 'auto', minWidth: 180 }}
            >
              <option value="ALL">All Roles</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 100,
                  border: filter === s ? '1px solid #bfdbfe' : '1px solid var(--border-default)',
                  background: filter === s ? '#eff6ff' : 'var(--bg-card)',
                  color: filter === s ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {statusLabels[s]}
                <span style={{
                  background: filter === s ? '#dbeafe' : '#f3f4f6',
                  padding: '1px 7px',
                  borderRadius: 100,
                  fontSize: 11,
                  color: filter === s ? '#1d4ed8' : 'var(--text-muted)',
                }}>
                  {countByStatus(s)}
                </span>
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 88 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
              <Users size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No candidates found</div>
              <div style={{ fontSize: 13 }}>
                {filter !== 'ALL' ? `No ${statusLabels[filter].toLowerCase()} candidates.` : 'Add your first candidate to get started.'}
              </div>
              <button className="btn btn-primary btn-sm" style={{ margin: '16px auto 0' }} onClick={() => setShowModal(true)}>
                <Plus size={14} /> Add Candidate
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(c => (
                <CandidateCard key={c.id} candidate={c} onCallInitiated={loadData} />
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <AddCandidateModal
          jobs={jobs}
          onClose={() => setShowModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  )
}
