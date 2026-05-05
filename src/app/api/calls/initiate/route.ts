import { prisma } from '@/lib/db'
import { initiateCall } from '@/lib/bolna'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { candidateId } = body

  if (!candidateId) {
    return NextResponse.json({ error: 'candidateId is required' }, { status: 400 })
  }

  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: { job: true },
  })

  if (!candidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
  }

  if (candidate.status === 'CALLING') {
    return NextResponse.json({ error: 'Call already in progress' }, { status: 409 })
  }

  // Mark as calling
  await prisma.candidate.update({
    where: { id: candidateId },
    data: { status: 'CALLING' },
  })

  try {
    // Build webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Initiate Bolna call
    const callResult = await initiateCall(candidate.phone, {
      candidate_id: candidate.id,
      candidate_name: candidate.name,
      job_title: candidate.job.title,
      job_id: candidate.jobId,
      webhook_url: `${baseUrl}/api/webhooks/bolna`,
    })

    // Store call ID
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { callId: callResult.call_id },
    })

    return NextResponse.json({
      success: true,
      callId: callResult.call_id,
      message: 'Call initiated successfully',
    })
  } catch (error) {
    // Reset status on failure
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { status: 'PENDING' },
    })

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to initiate call: ${errorMessage}` },
      { status: 500 }
    )
  }
}
