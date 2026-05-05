import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: { job: true },
  })

  if (!candidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
  }

  return NextResponse.json(candidate)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const candidate = await prisma.candidate.update({
    where: { id },
    data: body,
    include: { job: true },
  })

  return NextResponse.json(candidate)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.candidate.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
