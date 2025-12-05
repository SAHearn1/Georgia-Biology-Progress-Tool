/**
 * Database Seed Script
 * Georgia Biology Progress Tool
 *
 * Seeds the database with:
 * - Georgia Standards of Excellence (GSE) Biology Standards
 * - Demo teacher account
 * - Demo classes and students
 * - Sample assessments and progress data
 */

import { PrismaClient, StandardCategory, UserRole, MasteryLevel, AssessmentType, QuestionType, EnrollmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================================================
// GEORGIA BIOLOGY STANDARDS (GSE)
// ============================================================================

const GEORGIA_BIOLOGY_STANDARDS = [
  // SB1 - Cells and Cellular Processes (Domain 1)
  {
    code: 'SB1',
    title: 'Cell Structure and Function',
    description: 'Obtain, evaluate, and communicate information to analyze the nature of the relationships between structures and functions in living cells.',
    category: 'CELLS_AND_CELLULAR_PROCESSES' as StandardCategory,
    children: [
      {
        code: 'SB1.a',
        title: 'Cell Theory and Organelles',
        description: 'Construct an explanation of how cell structures and organelles (including nucleus, cytoplasm, cell membrane, cell wall, chloroplasts, lysosome, Golgi, endoplasmic reticulum, vacuoles, ribosomes, and mitochondria) interact as a system to maintain homeostasis.',
        category: 'CELLS_AND_CELLULAR_PROCESSES' as StandardCategory,
      },
      {
        code: 'SB1.b',
        title: 'Transport Across Cell Membrane',
        description: 'Develop and use models to explain how passive transport (diffusion, osmosis, facilitated diffusion) and active transport (protein pumps, exocytosis, endocytosis) occur.',
        category: 'CELLS_AND_CELLULAR_PROCESSES' as StandardCategory,
      },
      {
        code: 'SB1.c',
        title: 'Enzyme Function',
        description: 'Construct an argument that describes how enzymes regulate chemical reactions in the body (including enzyme specificity, active site, pH, and temperature).',
        category: 'CELLS_AND_CELLULAR_PROCESSES' as StandardCategory,
      },
    ],
  },

  // SB2 - Energy and Cellular Processes
  {
    code: 'SB2',
    title: 'Photosynthesis and Cellular Respiration',
    description: 'Obtain, evaluate, and communicate information to analyze how cells obtain and use energy.',
    category: 'CELLS_AND_CELLULAR_PROCESSES' as StandardCategory,
    children: [
      {
        code: 'SB2.a',
        title: 'Photosynthesis Process',
        description: 'Develop and use models to illustrate the structure of ATP, the processes of cellular respiration, and photosynthesis (inputs, outputs, and energy transformation).',
        category: 'CELLS_AND_CELLULAR_PROCESSES' as StandardCategory,
      },
      {
        code: 'SB2.b',
        title: 'Cellular Respiration',
        description: 'Construct an argument that supports or refutes the claim that photosynthesis and cellular respiration are interdependent processes.',
        category: 'CELLS_AND_CELLULAR_PROCESSES' as StandardCategory,
      },
    ],
  },

  // SB3 - Genetics
  {
    code: 'SB3',
    title: 'DNA, RNA, and Protein Synthesis',
    description: 'Obtain, evaluate, and communicate information to analyze how biological traits are passed on to successive generations.',
    category: 'GENETICS' as StandardCategory,
    children: [
      {
        code: 'SB3.a',
        title: 'DNA and Chromosome Structure',
        description: 'Use models to relate the structure of DNA to its function (including DNA replication, protein synthesis, and gene regulation).',
        category: 'GENETICS' as StandardCategory,
      },
      {
        code: 'SB3.b',
        title: 'Protein Synthesis',
        description: 'Construct an argument to support a claim that inheritable genetic variations occur through the processes of mutation and sexual reproduction.',
        category: 'GENETICS' as StandardCategory,
      },
      {
        code: 'SB3.c',
        title: 'Patterns of Inheritance',
        description: 'Use mathematical models to predict and explain patterns of inheritance (including simple dominance, codominance, incomplete dominance, multiple alleles, and sex-linked traits).',
        category: 'GENETICS' as StandardCategory,
      },
    ],
  },

  // SB4 - Biological Evolution
  {
    code: 'SB4',
    title: 'Evidence for Evolution',
    description: 'Obtain, evaluate, and communicate information to analyze the nature of the mechanisms of biological evolution.',
    category: 'EVOLUTION' as StandardCategory,
    children: [
      {
        code: 'SB4.a',
        title: 'Evidence Supporting Evolution',
        description: 'Construct an argument using multiple sources of evidence (fossil record, molecular evidence, comparative anatomy, embryology) to support the theory of biological evolution.',
        category: 'EVOLUTION' as StandardCategory,
      },
      {
        code: 'SB4.b',
        title: 'Natural Selection',
        description: 'Construct an explanation that describes how genetic variation, reproductive strategies, and environmental pressures lead to differential reproductive success.',
        category: 'EVOLUTION' as StandardCategory,
      },
      {
        code: 'SB4.c',
        title: 'Speciation',
        description: 'Analyze and interpret data to develop models that describe how changes in DNA sequences may lead to speciation.',
        category: 'EVOLUTION' as StandardCategory,
      },
    ],
  },

  // SB5 - Classification
  {
    code: 'SB5',
    title: 'Biological Classification',
    description: 'Obtain, evaluate, and communicate information to analyze how organisms are classified and organized.',
    category: 'EVOLUTION' as StandardCategory,
    children: [
      {
        code: 'SB5.a',
        title: 'Classification Systems',
        description: 'Develop and use models to classify organisms based on physical characteristics and evolutionary relationships (including dichotomous keys and cladograms).',
        category: 'EVOLUTION' as StandardCategory,
      },
      {
        code: 'SB5.b',
        title: 'Three Domains of Life',
        description: 'Analyze and interpret data related to the diversity of organisms in terms of the three domains: Bacteria, Archaea, and Eukarya.',
        category: 'EVOLUTION' as StandardCategory,
      },
    ],
  },

  // SB6 - Ecology
  {
    code: 'SB6',
    title: 'Ecology and Interdependence',
    description: 'Obtain, evaluate, and communicate information to analyze the interdependence of organisms with each other and their environment.',
    category: 'ECOLOGY' as StandardCategory,
    children: [
      {
        code: 'SB6.a',
        title: 'Energy Flow in Ecosystems',
        description: 'Develop and use models to analyze the cycling of matter and flow of energy in ecosystems through food webs, food chains, and food pyramids.',
        category: 'ECOLOGY' as StandardCategory,
      },
      {
        code: 'SB6.b',
        title: 'Biogeochemical Cycles',
        description: 'Construct an argument to support a claim about the impact of human activity on the environment and how technology can mitigate that impact.',
        category: 'ECOLOGY' as StandardCategory,
      },
      {
        code: 'SB6.c',
        title: 'Population Dynamics',
        description: 'Analyze and interpret data to construct an explanation of how population size is determined by births, deaths, immigration, emigration, and limiting factors (biotic and abiotic).',
        category: 'ECOLOGY' as StandardCategory,
      },
      {
        code: 'SB6.d',
        title: 'Symbiotic Relationships',
        description: 'Design and defend a model of a sustainable ecosystem that considers interrelationships among organisms and the components of the environment.',
        category: 'ECOLOGY' as StandardCategory,
      },
    ],
  },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedStandards() {
  console.log('🌱 Seeding Georgia Biology Standards...');

  for (const standard of GEORGIA_BIOLOGY_STANDARDS) {
    const { children, ...parentData } = standard;

    // Create parent standard
    const parent = await prisma.standard.upsert({
      where: { code: parentData.code },
      update: parentData,
      create: parentData,
    });

    // Create child standards
    if (children) {
      for (const child of children) {
        await prisma.standard.upsert({
          where: { code: child.code },
          update: { ...child, parentId: parent.id },
          create: { ...child, parentId: parent.id },
        });
      }
    }
  }

  const count = await prisma.standard.count();
  console.log(`✅ Seeded ${count} standards`);
}

async function seedDemoData() {
  console.log('🌱 Seeding demo data...');

  // Create demo teacher
  const hashedPassword = await bcrypt.hash('Demo123!', 10);
  const teacher = await prisma.user.upsert({
    where: { email: 'demo@teacher.com' },
    update: {},
    create: {
      email: 'demo@teacher.com',
      name: 'Ms. Sarah Johnson',
      passwordHash: hashedPassword,
      role: UserRole.TEACHER,
    },
  });
  console.log('✅ Created demo teacher: demo@teacher.com / Demo123!');

  // Create demo classes
  const class1 = await prisma.class.upsert({
    where: { id: 'demo-class-1' },
    update: {},
    create: {
      id: 'demo-class-1',
      name: 'Biology - Period 1',
      period: '1',
      schoolYear: '2024-2025',
      teacherId: teacher.id,
    },
  });

  const class2 = await prisma.class.upsert({
    where: { id: 'demo-class-2' },
    update: {},
    create: {
      id: 'demo-class-2',
      name: 'Biology - Period 3',
      period: '3',
      schoolYear: '2024-2025',
      teacherId: teacher.id,
    },
  });
  console.log('✅ Created 2 demo classes');

  // Create demo students
  const students = [
    { studentId: 'STU001', firstName: 'Emma', lastName: 'Williams', gradeLevel: 9 },
    { studentId: 'STU002', firstName: 'Liam', lastName: 'Brown', gradeLevel: 9 },
    { studentId: 'STU003', firstName: 'Olivia', lastName: 'Davis', gradeLevel: 10 },
    { studentId: 'STU004', firstName: 'Noah', lastName: 'Miller', gradeLevel: 9 },
    { studentId: 'STU005', firstName: 'Ava', lastName: 'Wilson', gradeLevel: 10 },
    { studentId: 'STU006', firstName: 'Ethan', lastName: 'Moore', gradeLevel: 9 },
    { studentId: 'STU007', firstName: 'Sophia', lastName: 'Taylor', gradeLevel: 9 },
    { studentId: 'STU008', firstName: 'Mason', lastName: 'Anderson', gradeLevel: 10 },
  ];

  const createdStudents = [];
  for (const studentData of students) {
    const student = await prisma.student.upsert({
      where: { studentId: studentData.studentId },
      update: {},
      create: {
        ...studentData,
        email: `${studentData.firstName.toLowerCase()}.${studentData.lastName.toLowerCase()}@school.edu`,
      },
    });
    createdStudents.push(student);
  }
  console.log(`✅ Created ${createdStudents.length} demo students`);

  // Enroll students in classes
  const enrollmentData = [
    // Period 1 students
    { studentId: createdStudents[0].id, classId: class1.id },
    { studentId: createdStudents[1].id, classId: class1.id },
    { studentId: createdStudents[2].id, classId: class1.id },
    { studentId: createdStudents[3].id, classId: class1.id },
    // Period 3 students
    { studentId: createdStudents[4].id, classId: class2.id },
    { studentId: createdStudents[5].id, classId: class2.id },
    { studentId: createdStudents[6].id, classId: class2.id },
    { studentId: createdStudents[7].id, classId: class2.id },
  ];

  for (const enrollment of enrollmentData) {
    await prisma.enrollment.upsert({
      where: {
        studentId_classId: {
          studentId: enrollment.studentId,
          classId: enrollment.classId,
        },
      },
      update: {},
      create: {
        ...enrollment,
        status: EnrollmentStatus.ACTIVE,
      },
    });
  }
  console.log('✅ Created enrollments');

  // Create sample assessment
  const cellsStandard = await prisma.standard.findFirst({
    where: { code: 'SB1.a' },
  });

  if (cellsStandard) {
    const assessment = await prisma.assessment.create({
      data: {
        title: 'Cell Structure Quiz',
        description: 'Assessment covering cell organelles and their functions',
        type: AssessmentType.QUIZ,
        totalPoints: 10,
        classId: class1.id,
        assignedDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        questions: {
          create: [
            {
              questionText: 'Which organelle is known as the "powerhouse of the cell"?',
              questionType: QuestionType.MULTIPLE_CHOICE,
              points: 1,
              order: 1,
              options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
              correctAnswer: 'Mitochondria',
              standardId: cellsStandard.id,
            },
            {
              questionText: 'The cell membrane is primarily composed of which molecules?',
              questionType: QuestionType.MULTIPLE_CHOICE,
              points: 1,
              order: 2,
              options: ['Carbohydrates', 'Proteins and phospholipids', 'Nucleic acids', 'Glucose'],
              correctAnswer: 'Proteins and phospholipids',
              standardId: cellsStandard.id,
            },
            {
              questionText: 'What is the function of ribosomes in a cell?',
              questionType: QuestionType.MULTIPLE_CHOICE,
              points: 1,
              order: 3,
              options: ['Energy production', 'Protein synthesis', 'Photosynthesis', 'Waste removal'],
              correctAnswer: 'Protein synthesis',
              standardId: cellsStandard.id,
            },
          ],
        },
      },
    });
    console.log('✅ Created sample assessment');

    // Add some progress records for students
    const masteryLevels = [
      MasteryLevel.PROFICIENT,
      MasteryLevel.DEVELOPING,
      MasteryLevel.ADVANCED,
      MasteryLevel.BEGINNING,
    ];

    for (let i = 0; i < 4; i++) {
      await prisma.progressRecord.create({
        data: {
          studentId: createdStudents[i].id,
          standardId: cellsStandard.id,
          masteryLevel: masteryLevels[i],
          confidence: 70 + Math.random() * 30,
          attempts: Math.floor(Math.random() * 3) + 1,
        },
      });
    }
    console.log('✅ Created progress records');
  }
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🚀 Starting database seed...\n');

  try {
    await seedStandards();
    console.log('');
    await seedDemoData();
    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📝 Demo Login Credentials:');
    console.log('   Email: demo@teacher.com');
    console.log('   Password: Demo123!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
