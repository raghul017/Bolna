'use client'

import { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  trend?: number
  color?: 'purple' | 'green' | 'yellow' | 'red' | 'blue'
  suffix?: string
}

const colorMap = {
  purple: { bg: '#f5f3ff', icon: '#6d28d9', border: '#ddd6fe' },
  green: { bg: '#f0fdf4', icon: '#15803d', border: '#bbf7d0' },
  yellow: { bg: '#fffbeb', icon: '#b45309', border: '#fde68a' },
  red: { bg: '#fef2f2', icon: '#b91c1c', border: '#fecaca' },
  blue: { bg: '#eff6ff', icon: '#1d4ed8', border: '#bfdbfe' },
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'purple',
  suffix = '',
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const numValue = typeof value === 'number' ? value : parseInt(String(value)) || 0
  const colors = colorMap[color]

  // Count-up animation
  useEffect(() => {
    if (typeof value !== 'number') return
    let start = 0
    const duration = 1000
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.floor(eased * numValue))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [numValue, value])

  return (
    <div
      className="card animate-fade-in"
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8 }}>
            {title}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {typeof value === 'number' ? displayValue : value}
            </h2>
            {suffix && (
              <span style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 600 }}>{suffix}</span>
            )}
          </div>
          {subtitle && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{subtitle}</p>
          )}
          {trend !== undefined && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 8,
              fontSize: 12,
              fontWeight: 600,
              color: trend >= 0 ? '#15803d' : '#b91c1c',
              background: trend >= 0 ? '#f0fdf4' : '#fef2f2',
              padding: '2px 8px',
              borderRadius: 100,
            }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </div>
          )}
        </div>

        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={22} color={colors.icon} />
        </div>
      </div>
    </div>
  )
}
