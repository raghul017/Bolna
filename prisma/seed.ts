import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'prisma/dev.db')
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Seeding database...')

  // Create Jobs
  const jobs = await Promise.all([
    prisma.job.upsert({
      where: { id: 'job-sfe-01' },
      update: {},
      create: {
        id: 'job-sfe-01',
        title: 'Senior Frontend Engineer',
        department: 'Engineering',
        minSalary: 120000,
        maxSalary: 180000,
        skills: JSON.stringify(['React', 'TypeScript', 'Next.js', 'CSS', 'GraphQL']),
        description: 'Build world-class user interfaces for our core product. Work closely with design and backend teams.',
      },
    }),
    prisma.job.upsert({
      where: { id: 'job-pm-02' },
      update: {},
      create: {
        id: 'job-pm-02',
        title: 'Product Manager',
        department: 'Product',
        minSalary: 100000,
        maxSalary: 150000,
        skills: JSON.stringify(['Roadmapping', 'User Research', 'Agile', 'Analytics', 'SQL']),
        description: 'Own the product roadmap and drive cross-functional alignment to ship features users love.',
      },
    }),
    prisma.job.upsert({
      where: { id: 'job-dse-03' },
      update: {},
      create: {
        id: 'job-dse-03',
        title: 'Data Science Engineer',
        department: 'Data',
        minSalary: 130000,
        maxSalary: 190000,
        skills: JSON.stringify(['Python', 'ML', 'PyTorch', 'SQL', 'Spark']),
        description: 'Build and deploy ML models that power our AI-driven product features at scale.',
      },
    }),
    prisma.job.upsert({
      where: { id: 'job-devrel-04' },
      update: {},
      create: {
        id: 'job-devrel-04',
        title: 'Developer Relations Engineer',
        department: 'Growth',
        minSalary: 90000,
        maxSalary: 130000,
        skills: JSON.stringify(['Public Speaking', 'API Design', 'Documentation', 'Community']),
        description: 'Evangelize our developer platform, create content, and build our technical community.',
      },
    }),
  ])

  console.log(`✅ Created ${jobs.length} jobs`)

  // Create Candidates
  const candidates = [
    {
      id: 'cand-01',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@gmail.com',
      phone: '+1-555-0101',
      jobId: 'job-sfe-01',
      status: 'SHORTLISTED',
      score: 87,
      scoreBreakdown: JSON.stringify({ experience: 26, availability: 18, salaryFit: 22, communication: 21, total: 87 }),
      transcript: `Aria: Hi, is this Sarah Mitchell?\nSarah: Yes, speaking!\nAria: Great! I'm Aria, an AI recruiter from TechCorp. I'm calling about the Senior Frontend Engineer position. Do you have a few minutes?\nSarah: Absolutely, I've been looking forward to this!\nAria: Wonderful. Can you briefly walk me through your current role and experience?\nSarah: Sure! I've been a frontend engineer for 7 years. Currently at Stripe, where I lead the dashboard team. I work primarily with React, TypeScript, and Next.js. Before that I was at Airbnb.\nAria: That's impressive. What's your notice period?\nSarah: I have a 2-week notice period. I could start fairly quickly.\nAria: Great. What are your salary expectations for this role?\nSarah: I'm looking at around 155,000 base. Open to discussing equity as well.\nAria: And why are you interested in leaving your current position?\nSarah: I love my team at Stripe, but I'm looking for a role with more product ownership and architectural decision-making. The scope here sounds like a better fit.\nAria: That makes sense. Do you have experience with GraphQL?\nSarah: Yes, extensively. We migrated our entire dashboard to GraphQL at Stripe last year. I also have experience with Apollo Client.\nAria: Excellent! Thank you so much, Sarah. Our team will review and be in touch within 2 business days.\nSarah: Thank you! Looking forward to it.`,
      callDuration: 312,
      answers: JSON.stringify({ experience: '7 years, Stripe and Airbnb, React TypeScript Next.js', noticePeriod: '2 weeks', salaryExpectation: '155000', reasonForLeaving: 'More product ownership and architectural decisions' }),
    },
    {
      id: 'cand-02',
      name: 'James Okonkwo',
      email: 'james.okonkwo@outlook.com',
      phone: '+1-555-0102',
      jobId: 'job-sfe-01',
      status: 'COMPLETED',
      score: 68,
      scoreBreakdown: JSON.stringify({ experience: 18, availability: 15, salaryFit: 18, communication: 17, total: 68 }),
      transcript: `Aria: Hi, may I speak with James Okonkwo?\nJames: Yes, that's me.\nAria: I'm Aria from TechCorp calling about the Frontend Engineer position. Got a moment?\nJames: Sure.\nAria: Can you walk me through your experience?\nJames: I've been doing frontend for about 3 years. Mostly React. I worked at a startup and then a mid-size company.\nAria: What's your notice period?\nJames: 1 month notice period.\nAria: And salary expectations?\nJames: I'm thinking around 145k. Maybe a bit more.\nAria: Why are you looking to move?\nJames: Looking for better opportunities and compensation mostly.\nAria: Any experience with TypeScript or Next.js?\nJames: Some TypeScript experience. Next.js I've used a bit on side projects.\nAria: Thank you James. We'll be in touch within 2 business days.\nJames: Okay, thanks.`,
      callDuration: 198,
      answers: JSON.stringify({ experience: '3 years, React, startup and mid-size', noticePeriod: '1 month', salaryExpectation: '145000', reasonForLeaving: 'Better opportunities and compensation' }),
    },
    {
      id: 'cand-03',
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '+1-555-0103',
      jobId: 'job-pm-02',
      status: 'SHORTLISTED',
      score: 91,
      scoreBreakdown: JSON.stringify({ experience: 28, availability: 20, salaryFit: 23, communication: 20, total: 91 }),
      transcript: `Aria: Hello, is this Priya Sharma?\nPriya: Yes! Hi!\nAria: I'm Aria calling from TechCorp about the Product Manager role. Is now a good time?\nPriya: Perfect timing, I was just thinking about this!\nAria: Could you walk me through your experience?\nPriya: Absolutely. I have 8 years in product management. I'm currently a Senior PM at Google, leading the Maps data quality team. Before that, I was at Uber for 3 years building the driver experience product.\nAria: That's fantastic. What's your availability?\nPriya: I actually have immediate availability. I finished my last day last week, so no notice period needed.\nAria: Wonderful! And salary expectations?\nPriya: Around 140,000 base. I understand that might be flexible based on the total comp package.\nAria: What's driving your job search?\nPriya: I want to join an earlier-stage company where I can have a bigger impact. At Google, everything is already scaled. I'm excited to build something from the ground up.\nAria: How comfortable are you with SQL and data analytics?\nPriya: Very comfortable. I run my own queries daily and we use Looker and Amplitude on my current team.\nAria: Priya, this has been great. Thank you so much!\nPriya: Thank you, I'm really excited about this opportunity!`,
      callDuration: 356,
      answers: JSON.stringify({ experience: '8 years, Google and Uber, Senior PM', noticePeriod: 'Immediate', salaryExpectation: '140000', reasonForLeaving: 'Bigger impact at earlier stage' }),
    },
    {
      id: 'cand-04',
      name: 'Marcus Webb',
      email: 'marcus.webb@proton.me',
      phone: '+1-555-0104',
      jobId: 'job-dse-03',
      status: 'REJECTED',
      score: 42,
      scoreBreakdown: JSON.stringify({ experience: 10, availability: 8, salaryFit: 12, communication: 12, total: 42 }),
      transcript: `Aria: Hi, is this Marcus Webb?\nMarcus: Yeah.\nAria: I'm Aria calling from TechCorp about the Data Science Engineer role.\nMarcus: Oh right. Yeah.\nAria: Can you walk me through your experience?\nMarcus: I did some data science in college. Did an internship. Been working as a data analyst for about a year.\nAria: What's your notice period?\nMarcus: 3 months. It's in my contract.\nAria: Salary expectations?\nMarcus: 200k minimum. I know the market.\nAria: Any experience with PyTorch or Spark?\nMarcus: A little from courses. Not professionally.\nAria: Thank you Marcus, we'll review and be in touch.\nMarcus: Sure.`,
      callDuration: 145,
      answers: JSON.stringify({ experience: '1 year data analyst, internship', noticePeriod: '3 months', salaryExpectation: '200000', reasonForLeaving: '' }),
    },
    {
      id: 'cand-05',
      name: 'Elena Vasquez',
      email: 'elena.v@gmail.com',
      phone: '+1-555-0105',
      jobId: 'job-dse-03',
      status: 'CALLING',
      score: null,
      callId: 'bolna-call-in-progress',
    },
    {
      id: 'cand-06',
      name: 'David Chen',
      email: 'david.chen@yahoo.com',
      phone: '+1-555-0106',
      jobId: 'job-devrel-04',
      status: 'PENDING',
      score: null,
    },
    {
      id: 'cand-07',
      name: 'Aisha Johnson',
      email: 'aisha.j@gmail.com',
      phone: '+1-555-0107',
      jobId: 'job-sfe-01',
      status: 'SHORTLISTED',
      score: 83,
      scoreBreakdown: JSON.stringify({ experience: 24, availability: 18, salaryFit: 20, communication: 21, total: 83 }),
      callDuration: 278,
    },
  ]

  for (const candidate of candidates) {
    await prisma.candidate.upsert({
      where: { id: candidate.id },
      update: {},
      create: candidate as Parameters<typeof prisma.candidate.create>[0]['data'],
    })
  }

  console.log(`✅ Created ${candidates.length} candidates`)
  console.log('✅ Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
