import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const jobs = await prisma.job.findMany({
    include: {
      _count: { select: { candidates: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(jobs)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, department, minSalary, maxSalary, skills, description } = body

  if (!title || !department) {
    return NextResponse.json({ error: 'Title and department are required' }, { status: 400 })
  }

  const job = await prisma.job.create({
    data: {
      title,
      department,
      minSalary: minSalary || 0,
      maxSalary: maxSalary || 0,
      skills: JSON.stringify(skills || []),
      description: description || '',
    },
  })

  return NextResponse.json(job, { status: 201 })
}
