import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const [
    totalCandidates,
    shortlisted,
    rejected,
    calling,
    completed,
    totalJobs,
    recentCandidates,
  ] = await Promise.all([
    prisma.candidate.count(),
    prisma.candidate.count({ where: { status: 'SHORTLISTED' } }),
    prisma.candidate.count({ where: { status: 'REJECTED' } }),
    prisma.candidate.count({ where: { status: 'CALLING' } }),
    prisma.candidate.count({ where: { status: 'COMPLETED' } }),
    prisma.job.count({ where: { isActive: true } }),
    prisma.candidate.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { job: true },
      where: {
        status: { not: 'PENDING' },
      },
    }),
  ])

  const screened = shortlisted + rejected + completed
  const conversionRate = totalCandidates > 0
    ? Math.round((shortlisted / totalCandidates) * 100)
    : 0

  return NextResponse.json({
    totalCandidates,
    shortlisted,
    rejected,
    calling,
    completed,
    totalJobs,
    screened,
    conversionRate,
    recentCandidates,
  })
}
