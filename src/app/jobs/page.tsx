'use client'

import { useEffect, useState, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import AddJobModal from '@/components/AddJobModal'
import { Plus, Briefcase, Users, DollarSign, Code } from 'lucide-react'

interface Job {
  id: string
  title: string
  department: string
  minSalary: number
  maxSalary: number
  skills: string
  description: string
  isActive: boolean
  createdAt: string
  _count: { candidates: number }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const loadJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/jobs')
      setJobs(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadJobs() }, [loadJobs])

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Job Postings</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Manage roles your AI agent screens candidates for
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Create Job
            </button>
          </div>
        </div>

        <div style={{ padding: '32px 40px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200 }} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <Briefcase size={40} style={{ margin: '0 auto 16px', opacity: 0.3, color: 'var(--text-muted)' }} />
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No jobs yet</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Create your first job posting to start screening candidates</div>
              <button className="btn btn-primary btn-sm" style={{ margin: '0 auto' }} onClick={() => setShowModal(true)}>
                <Plus size={14} /> Create Job
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {jobs.map(job => {
                const skills: string[] = JSON.parse(job.skills || '[]')
                return (
                  <div key={job.id} className="card animate-fade-in" style={{ position: 'relative' }}>
                    {/* Active badge */}
                    {job.isActive && (
                      <div style={{ position: 'absolute', top: 16, right: 16 }}>
                        <span className="badge badge-green" style={{ fontSize: 11 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', marginRight: 4 }} />
                          Active
                        </span>
                      </div>
                    )}

                    {/* Icon + Title */}
                    <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(139,92,246,0.1))',
                        border: '1px solid rgba(124,58,237,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Briefcase size={20} color="#a78bfa" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 3 }}>{job.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{job.department}</p>
                      </div>
                    </div>

                    {/* Description */}
                    {job.description && (
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                        {job.description.length > 120 ? job.description.slice(0, 120) + '...' : job.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <Users size={13} color="#a78bfa" />
                        <span>{job._count.candidates} candidates</span>
                      </div>
                      {job.minSalary > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                          <DollarSign size={13} color="#4ade80" />
                          <span>${(job.minSalary / 1000).toFixed(0)}k–${(job.maxSalary / 1000).toFixed(0)}k</span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                          <Code size={12} /> Required Skills
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {skills.map(skill => (
                            <span key={skill} className="badge badge-purple" style={{ fontSize: 11 }}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <AddJobModal onClose={() => setShowModal(false)} onSuccess={loadJobs} />
      )}
    </div>
  )
}
