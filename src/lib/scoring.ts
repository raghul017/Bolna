// Candidate scoring engine based on call transcript and structured data

export interface ScoreBreakdown {
  experience: number    // 0-30
  availability: number  // 0-20
  salaryFit: number     // 0-25
  communication: number // 0-25
  total: number         // 0-100
}

export interface CandidateAnswers {
  experience?: string
  noticePeriod?: string
  salaryExpectation?: string
  reasonForLeaving?: string
  skillMatch?: string
}

/**
 * Score a candidate based on their answers and job requirements
 */
export function scoreCandidate(
  answers: CandidateAnswers,
  jobMinSalary: number,
  jobMaxSalary: number,
  requiredSkills: string[],
  transcript?: string
): ScoreBreakdown {
  const experienceScore = scoreExperience(answers.experience, requiredSkills, transcript)
  const availabilityScore = scoreAvailability(answers.noticePeriod)
  const salaryScore = scoreSalary(answers.salaryExpectation, jobMinSalary, jobMaxSalary)
  const communicationScore = scoreCommunication(transcript)

  const total = experienceScore + availabilityScore + salaryScore + communicationScore

  return {
    experience: experienceScore,
    availability: availabilityScore,
    salaryFit: salaryScore,
    communication: communicationScore,
    total,
  }
}

function scoreExperience(
  experienceText?: string,
  requiredSkills?: string[],
  transcript?: string
): number {
  if (!experienceText && !transcript) return 15 // neutral

  const text = ((experienceText || '') + ' ' + (transcript || '')).toLowerCase()

  let score = 15 // base score

  // Years of experience keywords
  if (text.includes('10+') || text.includes('ten') || text.includes('decade')) score += 15
  else if (text.includes('7') || text.includes('8') || text.includes('9')) score += 12
  else if (text.includes('5') || text.includes('6')) score += 10
  else if (text.includes('3') || text.includes('4')) score += 7
  else if (text.includes('2')) score += 4
  else if (text.includes('1')) score += 2

  // Skill matches
  if (requiredSkills && requiredSkills.length > 0) {
    const skillMatches = requiredSkills.filter(skill =>
      text.includes(skill.toLowerCase())
    ).length
    const skillBonus = Math.min(5, Math.round((skillMatches / requiredSkills.length) * 5))
    score = Math.min(30, score + skillBonus)
  }

  return Math.min(30, score)
}

function scoreAvailability(noticePeriodText?: string): number {
  if (!noticePeriodText) return 10 // neutral

  const text = noticePeriodText.toLowerCase()

  if (text.includes('immediate') || text.includes('notice') === false) return 20
  if (text.includes('2 week') || text.includes('two week')) return 18
  if (text.includes('1 month') || text.includes('one month') || text.includes('30 day')) return 15
  if (text.includes('2 month') || text.includes('two month') || text.includes('60 day')) return 10
  if (text.includes('3 month') || text.includes('three month') || text.includes('90 day')) return 5
  return 8
}

function scoreSalary(
  salaryText?: string,
  minSalary?: number,
  maxSalary?: number
): number {
  if (!salaryText || !minSalary || !maxSalary) return 12 // neutral

  const text = salaryText.toLowerCase()

  // Extract numbers from salary text
  const numbers = text.match(/\d[\d,.]*/g)
  if (!numbers || numbers.length === 0) return 12

  const candidateSalary = parseFloat(numbers[0].replace(/,/g, ''))

  if (candidateSalary <= maxSalary && candidateSalary >= minSalary) return 25
  if (candidateSalary <= maxSalary * 1.1) return 20 // within 10% above max
  if (candidateSalary <= maxSalary * 1.2) return 15 // within 20% above max
  if (candidateSalary < minSalary) return 18 // below min (open to negotiation)
  return 5 // way above budget
}

function scoreCommunication(transcript?: string): number {
  if (!transcript) return 12 // neutral

  const text = transcript.toLowerCase()
  let score = 12

  // Positive communication markers
  const positiveMarkers = [
    'thank you', 'appreciate', 'absolutely', 'certainly', 'great question',
    'happy to', 'looking forward', 'excited', 'passionate'
  ]
  const posCount = positiveMarkers.filter(m => text.includes(m)).length
  score += Math.min(8, posCount * 2)

  // Length of transcript (more engagement = better)
  const wordCount = text.split(' ').length
  if (wordCount > 500) score += 5
  else if (wordCount > 300) score += 3
  else if (wordCount > 100) score += 1

  return Math.min(25, score)
}

export function getStatusFromScore(score: number): string {
  if (score >= 80) return 'SHORTLISTED'
  if (score >= 60) return 'COMPLETED'
  return 'REJECTED'
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Average'
  return 'Below Average'
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}
