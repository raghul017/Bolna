import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')
  const status = searchParams.get('status')

  const where: Record<string, unknown> = {}
  if (jobId) where.jobId = jobId
  if (status) where.status = status

  const candidates = await prisma.candidate.findMany({
    where,
    include: { job: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(candidates)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, jobId, notes } = body

  if (!name || !email || !phone || !jobId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const candidate = await prisma.candidate.create({
    data: { name, email, phone, jobId, notes, status: 'PENDING' },
    include: { job: true },
  })

  return NextResponse.json(candidate, { status: 201 })
}
