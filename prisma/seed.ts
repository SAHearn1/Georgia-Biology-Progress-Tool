import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create a Teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'hearn@school.edu' },
    update: {},
    create: {
      email: 'hearn@school.edu',
      name: 'Dr. Shawn Hearn',
      role: 'TEACHER',
      classes: {
        create: {
          name: 'Biology Period 1 (Honors)',
          accessCode: 'BIO-101',
          description: 'Fall 2025 - Living Learning Lab'
        }
      }
    },
    include: { classes: true }
  })

  console.log(`👨‍🏫 Created Teacher: ${teacher.name}`)
  console.log(`🏫 Created Class: ${teacher.classes[0].name} (Code: ${teacher.classes[0].accessCode})`)

  // 2. Create Biology Items (GSE Aligned)
  // We explicitly set a, b, c parameters for the 3-PL Model
  const biologyItems = [
    // SB1.a - Cell Structure (Easier items)
    {
      standard: 'SB1.a',
      content: 'Which organelle is primarily responsible for the synthesis of proteins in the cell?',
      options: JSON.stringify(['Golgi Apparatus', 'Mitochondria', 'Ribosome', 'Smooth ER']),
      correctAnswer: 'Ribosome',
      difficulty_b: -1.5, // Easy
      discrimination_a: 1.2,
      guessing_c: 0.25
    },
    {
      standard: 'SB1.a',
      content: 'Which structure is found in plant cells but NOT in animal cells?',
      options: JSON.stringify(['Ribosome', 'Cell Wall', 'Mitochondria', 'Cell Membrane']),
      correctAnswer: 'Cell Wall',
      difficulty_b: -0.8,
      discrimination_a: 1.5,
      guessing_c: 0.2
    },
    // SB1.b - Enzymes (Medium difficulty)
    {
      standard: 'SB1.b',
      content: 'Enzymes act as biological catalysts by lowering the activation energy. Which factor most directly affects an enzyme function?',
      options: JSON.stringify(['Container size', 'pH and temperature', 'Amount of product', 'ATP availability']),
      correctAnswer: 'pH and temperature',
      difficulty_b: 0.5, // Medium
      discrimination_a: 1.8,
      guessing_c: 0.25
    },
    // SB2.a - DNA (Harder items)
    {
      standard: 'SB2.a',
      content: 'During replication, which enzyme is responsible for "unzipping" the double helix?',
      options: JSON.stringify(['DNA Polymerase', 'Helicase', 'Ligase', 'Primase']),
      correctAnswer: 'Helicase',
      difficulty_b: 1.2, // Hard
      discrimination_a: 2.0, // High discrimination (good for separating high performers)
      guessing_c: 0.2
    },
    {
      standard: 'SB2.b',
      content: 'Which mutation would likely have the most significant effect on the resulting protein?',
      options: JSON.stringify(['Silent mutation', 'Frameshift mutation', 'Point mutation at end', 'Intron mutation']),
      correctAnswer: 'Frameshift mutation',
      difficulty_b: 1.8, // Very Hard
      discrimination_a: 1.6,
      guessing_c: 0.25
    }
  ]

  for (const item of biologyItems) {
    await prisma.item.create({ data: item })
  }

  console.log(`📚 Seeded ${biologyItems.length} Biology Items`)
  console.log('✅ Seeding complete.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
