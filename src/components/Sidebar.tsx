'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Phone,
  Settings,
  Zap,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/candidates', label: 'Candidates', icon: Users },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/calls', label: 'Call Logs', icon: Phone },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(124,58,237,0.5)',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#f0f0ff', lineHeight: 1.2 }}>
              RecruitAI
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1 }}>
              Powered by Bolna
            </div>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="divider" style={{ margin: '0 16px 16px' }} />

      {/* Nav */}
      <nav style={{ padding: '0 12px', flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: '0 12px 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Menu
        </div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#a78bfa' : 'var(--text-secondary)',
                background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(255,255,255,0.04)'
                  el.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.color = 'var(--text-secondary)'
                }
              }}
            >
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Bolt */}
      <div style={{ padding: '16px', margin: '16px', background: 'rgba(124,58,237,0.08)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.2)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', marginBottom: 4 }}>
          🤖 AI Voice Agent
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Bolna agent active. Ready to screen candidates 24/7.
        </div>
      </div>
    </aside>
  )
}
