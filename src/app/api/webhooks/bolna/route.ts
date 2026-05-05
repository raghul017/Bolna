import { prisma } from '@/lib/db'
import { scoreCandidate, getStatusFromScore } from '@/lib/scoring'
import { BolnaWebhookPayload } from '@/lib/bolna'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body: BolnaWebhookPayload = await req.json()

  console.log('Bolna webhook received:', JSON.stringify(body, null, 2))

  const { call_id, status, duration, transcript, recording_url, user_data } = body

  const candidateId = user_data?.candidate_id
  if (!candidateId) {
    return NextResponse.json({ error: 'No candidate_id in user_data' }, { status: 400 })
  }

  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: { job: true },
  })

  if (!candidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
  }

  if (status === 'completed' || status === 'success') {
    // Parse answers from transcript (simplified extraction)
    const answers = extractAnswers(transcript || '')

    // Score the candidate
    const skills = JSON.parse(candidate.job.skills || '[]')
    const scoreBreakdown = scoreCandidate(
      answers,
      candidate.job.minSalary,
      candidate.job.maxSalary,
      skills,
      transcript
    )

    const newStatus = getStatusFromScore(scoreBreakdown.total)

    await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        status: newStatus,
        callId: call_id,
        callDuration: duration,
        transcript: transcript || null,
        recordingUrl: recording_url || null,
        score: scoreBreakdown.total,
        scoreBreakdown: JSON.stringify(scoreBreakdown),
        answers: JSON.stringify(answers),
      },
    })

    return NextResponse.json({
      success: true,
      score: scoreBreakdown.total,
      status: newStatus,
    })
  } else {
    // Call failed or no answer
    await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        status: 'PENDING',
        callId: call_id,
      },
    })

    return NextResponse.json({ success: true, status: 'call_failed' })
  }
}

function extractAnswers(transcript: string): Record<string, string> {
  const answers: Record<string, string> = {}

  // Simple regex extraction for common patterns
  const lines = transcript.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase()

    if (line.includes('experience') || line.includes('background') || line.includes('role')) {
      answers.experience = lines[i + 1] || ''
    }
    if (line.includes('notice') || line.includes('start')) {
      answers.noticePeriod = lines[i + 1] || ''
    }
    if (line.includes('salary') || line.includes('compensation') || line.includes('expect')) {
      answers.salaryExpectation = lines[i + 1] || ''
    }
    if (line.includes('leaving') || line.includes('looking') || line.includes('why')) {
      answers.reasonForLeaving = lines[i + 1] || ''
    }
  }

  return answers
}
