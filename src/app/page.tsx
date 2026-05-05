'use client'

import { useEffect, useState, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import StatsCard from '@/components/StatsCard'
import CandidateCard from '@/components/CandidateCard'
import AddCandidateModal from '@/components/AddCandidateModal'
import {
  Users, CheckCircle, XCircle, Briefcase,
  TrendingUp, PhoneCall, Plus, RefreshCw
} from 'lucide-react'

interface Stats {
  totalCandidates: number
  shortlisted: number
  rejected: number
  calling: number
  screened: number
  totalJobs: number
  conversionRate: number
  recentCandidates: Candidate[]
}

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

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const [statsRes, jobsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/jobs'),
      ])
      const [statsData, jobsData] = await Promise.all([
        statsRes.json(),
        jobsRes.json(),
      ])
      setStats(statsData)
      setJobs(jobsData)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    // Poll every 15s to catch webhook updates
    const interval = setInterval(() => loadData(true), 15000)
    return () => clearInterval(interval)
  }, [loadData])

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {/* Header */}
        <div style={{
          padding: '32px 40px 0',
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: 24,
          background: '#ffffff',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Dashboard
                </h1>
                {stats?.calling ? (
                  <span className="badge badge-blue animate-call-pulse">
                    <PhoneCall size={10} /> {stats.calling} live call{stats.calling > 1 ? 's' : ''}
                  </span>
                ) : null}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Welcome back! Here&apos;s your hiring overview.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => loadData(true)}
                disabled={refreshing}
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={16} />
                Add Candidate
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 40px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 120 }} />
              ))}
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
                <StatsCard
                  title="Total Candidates"
                  value={stats?.totalCandidates || 0}
                  subtitle="In pipeline"
                  icon={Users}
                  color="purple"
                  trend={12}
                />
                <StatsCard
                  title="Shortlisted"
                  value={stats?.shortlisted || 0}
                  subtitle="Ready for interview"
                  icon={CheckCircle}
                  color="green"
                  trend={8}
                />
                <StatsCard
                  title="Screened"
                  value={stats?.screened || 0}
                  subtitle="AI calls completed"
                  icon={PhoneCall}
                  color="blue"
                />
                <StatsCard
                  title="Conversion Rate"
                  value={stats?.conversionRate || 0}
                  subtitle="Screened → Shortlisted"
                  icon={TrendingUp}
                  color="yellow"
                  suffix="%"
                />
              </div>

              {/* Two Column Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                {/* Recent Activity */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Activity</h2>
                    <a href="/candidates" style={{ fontSize: 13, color: 'var(--accent-primary-light)', textDecoration: 'none', fontWeight: 500 }}>
                      View all →
                    </a>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {stats?.recentCandidates.length === 0 ? (
                      <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                        <Users size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <div>No screened candidates yet.</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>Add a candidate and start screening!</div>
                      </div>
                    ) : (
                      stats?.recentCandidates.map(c => (
                        <CandidateCard key={c.id} candidate={c} onCallInitiated={() => loadData(true)} />
                      ))
                    )}
                  </div>
                </div>

                {/* Right Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Pipeline Summary */}
                  <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Pipeline Status</h3>
                    {[
                      { label: 'Shortlisted', value: stats?.shortlisted || 0, color: '#22c55e', pct: Math.min(100, ((stats?.shortlisted || 0) / (stats?.totalCandidates || 1)) * 100) },
                      { label: 'Under Review', value: stats?.screened || 0, color: '#f59e0b', pct: Math.min(100, ((stats?.screened || 0) / (stats?.totalCandidates || 1)) * 100) },
                      { label: 'Rejected', value: stats?.rejected || 0, color: '#ef4444', pct: Math.min(100, ((stats?.rejected || 0) / (stats?.totalCandidates || 1)) * 100) },
                      { label: 'Pending', value: (stats?.totalCandidates || 0) - (stats?.screened || 0) - (stats?.shortlisted || 0), color: '#6b7280', pct: 0 },
                    ].map(item => (
                      <div key={item.label} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                          <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: '#f3f4f6', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 2, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active Jobs */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700 }}>Active Jobs</h3>
                      <span className="badge badge-purple">{stats?.totalJobs || 0} open</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {jobs.slice(0, 4).map(job => (
                        <div key={job.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          background: 'var(--bg-elevated)',
                          borderRadius: 8,
                          border: '1px solid var(--border-subtle)',
                        }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={14} color="var(--accent-primary)" />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{job.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{job.department}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <a href="/jobs" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--accent-primary-light)', textDecoration: 'none', fontWeight: 500 }}>
                      Manage Jobs →
                    </a>
                  </div>

                  {/* AI Agent CTA */}
                  <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: 16,
                    padding: 20,
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>🤖</div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>AI Screening Active</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                      Your Bolna voice agent is ready. Add candidates and start screening with one click.
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)} style={{ width: '100%', justifyContent: 'center' }}>
                      <Plus size={14} /> Screen Now
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {showAddModal && (
        <AddCandidateModal
          jobs={jobs}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => loadData(true)}
        />
      )}
    </div>
  )
}
