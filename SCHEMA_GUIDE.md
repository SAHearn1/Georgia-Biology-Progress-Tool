# Database Schema Guide

Comprehensive guide to the Georgia Biology Progress Tool database schema.

## Schema Overview

The database is organized into several functional domains:

1. **Core System** - Users, authentication, sessions
2. **Academic Structure** - Classes, students, enrollments
3. **Standards & Curriculum** - Biology standards, learning objectives
4. **Assessments** - Tests, items, results, scoring
5. **Analytics** - Mastery tracking, predictions
6. **Integrations** - External system sync, activity logs

---

## Entity Relationship Diagram

```
User (Teacher)
  ↓ (1:many)
Class ←→ Enrollment ←→ Student
  ↓           ↓            ↓
Assessment   (linkage)  AssessmentResult
  ↓                         ↓
AssessmentItem          StandardMastery
  ↓                         ↓
Standard ←────────────────┘
  ↓
LearningObjective

Student → PredictionData
User → ActivityLog
```

---

## Core Models

### User

Teachers and administrators.

**Key Fields:**
- `id` - Unique identifier (cuid)
- `email` - Unique email (login)
- `password` - bcrypt hashed
- `role` - TEACHER, ADMIN, DISTRICT_ADMIN, SCHOOL_ADMIN

**External IDs for SSO/Integration:**
- `cleverUserId`, `classlinkUserId`, `googleUserId`, `microsoftUserId`
- `canvasUserId`, `schoologyUserId`, `sisUserId`, `onerosterUserId`

**Profile:**
- `avatar` - Vercel Blob URL for profile picture
- `school`, `district`, `department`, `title`
- `timezone`, `language`, `theme`

**Relations:**
- `classes[]` - Classes taught by this user
- `assessments[]` - Assessments created by this user
- `activityLogs[]` - Activity history
- `sessions[]` - Active sessions (NextAuth)

**Use Cases:**
- Authentication & authorization
- Teacher profile management
- SSO integration
- Audit trails

---

### Session

NextAuth.js session management for authentication.

**Key Fields:**
- `sessionToken` - Unique session identifier
- `userId` - Links to User
- `expires` - Session expiration timestamp

**Relations:**
- `user` - The authenticated user

**Use Cases:**
- JWT session management
- "Remember me" functionality
- Security & session tracking

---

### Class

Biology classes with periods, semesters, and school years.

**Key Fields:**
- `name` - Class name (e.g., "Biology Period 3")
- `period` - Class period (optional)
- `subject` - Default: "Biology"
- `schoolYear` - e.g., "2024-2025"
- `semester` - "Fall", "Spring", "Full Year"

**External IDs:**
- `canvasId`, `schoologyId`, `googleClassroomId` - For LMS sync

**Settings:**
- `color` - UI color code (default: emerald green)
- `isArchived` - Hide from active view

**Relations:**
- `teacher` - User who owns this class
- `enrollments[]` - Students enrolled
- `assessments[]` - Assessments for this class

**Use Cases:**
- Class roster management
- Organizing assessments by class
- LMS grade passback
- Multi-period scheduling

**Indexes:**
- `teacherId` - Fast lookup of teacher's classes
- `schoolYear` - Filter by year
- LMS IDs - Sync performance

---

### Student

Student records with demographics and special populations.

**Key Fields:**
- `studentId` - School/district ID (unique)
- `firstName`, `lastName`, `email`
- `gradeLevel` - "9", "10", "11", "12"

**Demographics:**
- `dateOfBirth`, `gender`, `ethnicity`

**Special Populations:**
- `isELL` - English Language Learner
- `isIEP` - Individualized Education Program
- `is504` - Section 504 Plan
- `isGifted` - Gifted/talented

**External IDs:**
- SIS: `sisStudentId`, `onerosterStudentId`
- SSO: `cleverStudentId`, `classlinkStudentId`
- LMS: `canvasStudentId`, `schoologyStudentId`

**Relations:**
- `enrollments[]` - Classes enrolled in
- `assessmentResults[]` - All test results
- `standardMastery[]` - Progress on standards
- `predictions[]` - EOC predictions

**Use Cases:**
- Student information management
- Enrollment tracking
- Differentiated instruction (IEP, ELL)
- SIS synchronization
- FERPA-compliant data storage

**Indexes:**
- `studentId` - Primary lookup
- `lastName, firstName` - Alphabetical sorting
- `gradeLevel` - Grade-level filtering
- External IDs - Sync performance

---

### Enrollment

Links students to classes (many-to-many relationship).

**Key Fields:**
- `studentId`, `classId` - Composite relationship
- `status` - ACTIVE, DROPPED, WITHDRAWN, COMPLETED
- `enrolledAt`, `droppedAt` - Timing

**Sync Tracking:**
- `syncSource` - "manual", "clever", "classlink", "sis"
- `lastSyncAt` - Last sync timestamp

**Relations:**
- `student` - The enrolled student
- `class` - The class

**Use Cases:**
- Roster management
- Schedule changes (add/drop)
- Historical enrollment records
- Automatic LMS/SIS sync

**Constraints:**
- Unique `[studentId, classId]` - Prevent duplicate enrollments

**Indexes:**
- `studentId` - Find student's classes
- `classId` - Find class roster
- `status` - Filter active enrollments

---

## Standards & Curriculum

### Standard

Georgia Biology Standards (EOC).

**Key Fields:**
- `code` - Standard code (e.g., "SB1", "SB2.a") - UNIQUE
- `domain` - Content domain (e.g., "Cells", "Ecology", "Evolution")
- `title`, `description`

**Hierarchy:**
- `parentId` - Self-referential for sub-standards
- `order` - Display order

**EOC Weighting:**
- `eocWeight` - Importance for EOC (default: 1.0)
- `difficulty` - "Basic", "Developing", "Proficient", "Distinguished"

**Metadata:**
- `version` - Standard version year (default: "2023")
- `isActive` - Show/hide standard

**Relations:**
- `parent` - Parent standard
- `children[]` - Sub-standards
- `assessmentItems[]` - Questions aligned to this standard
- `standardMastery[]` - Student progress
- `learningObjectives[]` - Granular objectives

**Use Cases:**
- Standards-based grading
- EOC alignment
- Progress tracking by standard
- Standard hierarchy visualization

**Example Data:**
```
SB1: The Nature of Science
  ↓
SB1.a: Scientific inquiry
    ↓
  SB1.a.1: Ask questions (Learning Objective)
  SB1.a.2: Form hypotheses (Learning Objective)
```

**Indexes:**
- `code` - Fast lookup by standard code
- `domain` - Filter by content area
- `parentId` - Hierarchy queries

---

### LearningObjective

Granular learning goals within standards.

**Key Fields:**
- `standardId` - Parent standard
- `code` - Objective code (e.g., "SB1.a.1")
- `title`, `description`
- `bloomLevel` - Bloom's Taxonomy level

**Metadata:**
- `order` - Display order
- `isActive` - Show/hide

**Relations:**
- `standard` - Parent standard

**Use Cases:**
- Granular progress tracking
- Lesson planning
- Differentiated instruction
- Learning pathways

**Bloom's Taxonomy Levels:**
- Remember, Understand, Apply, Analyze, Evaluate, Create

---

## Assessments

### Assessment

Tests, quizzes, and assignments.

**Key Fields:**
- `title` - Assessment name
- `type` - Assessment category (see AssessmentType enum)
- `description` - Instructions/details

**Scheduling:**
- `assignedAt` - When assigned
- `dueAt` - Due date
- `testDate` - When administered

**Grading:**
- `totalPoints` - Maximum possible score
- `passingScore` - Minimum to pass
- `weight` - Grade book weight

**LMS Integration:**
- `lmsId` - External assignment ID
- `lmsUrl` - Link to LMS

**Settings:**
- `isPublished` - Visible to students
- `allowRetake` - Multiple attempts allowed
- `showResults` - Show scores to students

**Relations:**
- `class` - Class this assessment belongs to
- `teacher` - Creator
- `items[]` - Questions
- `results[]` - Student submissions

**AssessmentType Enum:**
- `DIAGNOSTIC` - Pre-assessment
- `FORMATIVE` - In-progress check
- `SUMMATIVE` - Unit/chapter test
- `BENCHMARK` - Quarterly assessment
- `PRACTICE_EOC` - Practice test
- `MOCK_EOC` - Full-length simulation
- `QUIZ`, `TEST`, `PROJECT`, `HOMEWORK`

**Use Cases:**
- Creating assessments
- Standards-aligned testing
- EOC preparation
- Grade calculation
- LMS grade passback

---

### AssessmentItem

Individual questions within an assessment.

**Key Fields:**
- `assessmentId` - Parent assessment
- `standardId` - Aligned standard
- `itemNumber` - Question number
- `questionText` - The question
- `questionType` - Question format (see QuestionType enum)

**Answer Data:**
- `choices` - JSON array of answer options (for multiple choice)
- `correctAnswer` - JSON (format depends on question type)

**Scoring:**
- `points` - Point value
- `difficulty` - "Easy", "Medium", "Hard"

**Psychometrics:**
- `discrimination` - Item discrimination index (how well it differentiates)
- `pValue` - Proportion correct (item difficulty)

**Relations:**
- `assessment` - Parent assessment
- `standard` - Aligned standard

**QuestionType Enum:**
- `MULTIPLE_CHOICE` - Single correct answer
- `MULTIPLE_SELECT` - Multiple correct answers
- `TRUE_FALSE` - Boolean
- `SHORT_ANSWER` - Text response
- `ESSAY` - Long-form response
- `MATCHING` - Match pairs
- `FILL_IN_BLANK` - Complete the sentence

**Example JSON Structures:**

```json
// Multiple Choice - choices
[
  {"id": "a", "text": "Mitochondria", "isCorrect": false},
  {"id": "b", "text": "Chloroplast", "isCorrect": true},
  {"id": "c", "text": "Nucleus", "isCorrect": false},
  {"id": "d", "text": "Ribosome", "isCorrect": false}
]

// Multiple Choice - correctAnswer
{"answer": "b"}

// Multiple Select - correctAnswer
{"answers": ["a", "c"]}

// Short Answer - correctAnswer
{"answer": "photosynthesis", "alternatives": ["photosynthetic process"]}
```

**Use Cases:**
- Question bank management
- Item analysis (psychometrics)
- Standards alignment
- Adaptive testing (CAT)

---

### AssessmentResult

Student scores and submissions.

**Key Fields:**
- `assessmentId`, `studentId` - Composite key
- `attemptNumber` - For retakes (default: 1)

**Scoring:**
- `rawScore` - Points earned
- `percentScore` - Percentage (0-100)
- `totalPoints` - Total possible
- `isPassing` - Met passing threshold

**Timing:**
- `startedAt` - When student began
- `submittedAt` - When submitted
- `gradedAt` - When teacher graded

**Response Data:**
- `responses` - JSON array of item-level responses

**Flags:**
- `isLate` - Submitted after due date
- `isExcused` - Excused absence
- `isMakeup` - Makeup assessment

**LMS Sync:**
- `syncedToLMS` - Pushed to grade book
- `lmsGradeId` - External grade ID
- `lastSyncAt` - Last sync time

**Relations:**
- `assessment` - The assessment
- `student` - The student

**Response JSON Structure:**
```json
[
  {
    "itemId": "clx123",
    "itemNumber": 1,
    "studentAnswer": "b",
    "correctAnswer": "b",
    "isCorrect": true,
    "points": 1,
    "timeSpent": 45
  },
  // ...
]
```

**Use Cases:**
- Grade book
- Progress reports
- Item analysis
- Retake tracking
- LMS grade passback

**Constraints:**
- Unique `[assessmentId, studentId, attemptNumber]`

---

## Analytics

### StandardMastery

Tracks student progress on each standard.

**Key Fields:**
- `studentId`, `standardId` - Composite key
- `masteryLevel` - Current proficiency (see MasteryLevel enum)
- `confidence` - Statistical confidence (0-1, from IRT/CAT)

**Performance Metrics:**
- `attemptCount` - Total attempts
- `correctCount` - Correct attempts
- `lastScore`, `averageScore` - Performance
- `trendSlope` - Growth trajectory (positive = improving)

**Timing:**
- `firstAttempt`, `lastAttempt` - Date range
- `masteredAt` - When reached mastery

**MasteryLevel Enum:**
- `NOT_STARTED` - No attempts
- `BEGINNING` - < 40% correct
- `DEVELOPING` - 40-69% correct
- `PROFICIENT` - 70-89% correct
- `DISTINGUISHED` - 90-100% correct
- `MASTERED` - Consistently proficient

**Relations:**
- `student` - The student
- `standard` - The standard

**Use Cases:**
- Standards-based grading
- Progress monitoring
- Differentiated instruction
- Intervention targeting
- Progress reports

**Calculation Logic:**
```javascript
// Updated after each assessment result
masteryLevel = calculateMasteryLevel(averageScore);
confidence = calculateIRTConfidence(attemptCount, consistency);
trendSlope = linearRegression(recentScores);
```

**Constraints:**
- Unique `[studentId, standardId]`

---

### PredictionData

EOC score predictions using machine learning.

**Key Fields:**
- `studentId` - The student
- `predictedScore` - Predicted EOC scale score
- `predictedLevel` - Performance band
- `confidence` - Prediction confidence (0-1)

**Model Info:**
- `modelVersion` - Which ML model was used
- `featuresUsed` - JSON of contributing factors

**Confidence Interval:**
- `lowerBound`, `upperBound` - 95% CI

**Contributing Factors:**
- `currentAverage` - Current class average
- `growthRate` - Rate of improvement
- `attendanceRate` - Attendance percentage
- `assessmentCount` - Data points available

**Timing:**
- `predictionDate` - When prediction was made
- `targetTestDate` - EOC test date

**Relations:**
- `student` - The student

**Use Cases:**
- Early warning system
- Intervention planning
- Parent communication
- School reporting
- Resource allocation

**Example Prediction:**
```json
{
  "predictedScore": 512,
  "predictedLevel": "Proficient",
  "confidence": 0.82,
  "lowerBound": 495,
  "upperBound": 529,
  "featuresUsed": {
    "currentAverage": 85,
    "growthRate": 1.2,
    "attendanceRate": 0.94,
    "standardsMastery": 0.73,
    "practiceEOCScore": 78
  }
}
```

**Georgia EOC Performance Levels:**
- Beginning: < 400
- Developing: 400-474
- Proficient: 475-549
- Distinguished: 550+

---

## System Models

### ActivityLog

Audit trail of all system activities.

**Key Fields:**
- `userId` - Who performed the action (nullable)
- `action` - Action type (e.g., "create", "update", "delete", "login")
- `entity` - Entity type (e.g., "student", "assessment")
- `entityId` - ID of affected entity

**Context:**
- `description` - Human-readable description
- `metadata` - JSON with additional data
- `ipAddress`, `userAgent` - Request info

**Timing:**
- `timestamp` - When action occurred

**Relations:**
- `user` - The user (if authenticated)

**Use Cases:**
- Security auditing
- Compliance (FERPA)
- Debugging
- User activity reports
- Rollback assistance

**Example Entries:**
```
Action: login
Entity: user
Description: "User logged in successfully"

Action: create
Entity: assessment
EntityId: clx123
Description: "Created assessment 'Unit 2 Test'"
```

**Indexes:**
- `userId` - User activity history
- `action` - Filter by action type
- `entity` - Entity-specific logs
- `timestamp` - Time-based queries

---

### SyncStatus

Tracks external system synchronization.

**Key Fields:**
- `source` - Integration source (e.g., "clever", "canvas", "sis")
- `entity` - What's being synced (e.g., "students", "classes", "grades")

**Sync Info:**
- `lastSyncAt` - Last successful sync
- `nextSyncAt` - Scheduled next sync
- `status` - Current status (see SyncStatusType enum)

**Results:**
- `recordsSynced` - Successful count
- `recordsFailed` - Failed count
- `errorMessage` - Last error
- `errorDetails` - JSON with details

**SyncStatusType Enum:**
- `PENDING` - Not started
- `IN_PROGRESS` - Currently syncing
- `SUCCESS` - Completed successfully
- `FAILED` - Sync failed
- `PARTIAL` - Some records failed

**Use Cases:**
- Integration monitoring
- Error tracking
- Sync scheduling
- Admin dashboard
- Troubleshooting

**Constraints:**
- Unique `[source, entity]`

**Example:**
```javascript
{
  source: "clever",
  entity: "students",
  status: "SUCCESS",
  recordsSynced: 247,
  recordsFailed: 3,
  lastSyncAt: "2025-12-05T10:30:00Z",
  nextSyncAt: "2025-12-06T10:30:00Z"
}
```

---

## Indexes & Performance

### Index Strategy

**Primary Keys:** All tables use `cuid()` for distributed systems

**Foreign Keys:** Indexed automatically by Prisma

**Custom Indexes:**
- Search fields (email, studentId, code)
- Filter fields (role, status, domain)
- Sort fields (lastName, firstName, date)
- External IDs (for integrations)

### Query Optimization

**Use Connection Pooling:**
```typescript
// Use POSTGRES_PRISMA_URL for queries
datasource db {
  url = env("POSTGRES_PRISMA_URL")
}
```

**Use Direct Connection for Migrations:**
```typescript
// Use POSTGRES_URL_NON_POOLING
datasource db {
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

**Efficient Queries:**
```typescript
// Good - uses index
prisma.student.findMany({
  where: { studentId: "12345" }
});

// Good - composite index
prisma.student.findMany({
  orderBy: [
    { lastName: 'asc' },
    { firstName: 'asc' }
  ]
});

// Bad - no index
prisma.student.findMany({
  where: { notes: { contains: "IEP" } }
});
```

---

## Data Privacy & Security

### FERPA Compliance

Student records are protected under FERPA:
- Limit access by user role
- Activity logging for audits
- Secure authentication
- Encrypted connections (SSL)

### PII Fields

**Personally Identifiable Information:**
- Student: `firstName`, `lastName`, `email`, `dateOfBirth`, `studentId`
- User: `email`, `name`, `phone`

**Best Practices:**
- Never log PII fields
- Redact PII in error messages
- Use `ActivityLog` for audit trails
- Implement role-based access control (RBAC)

### Soft Deletes

Consider soft deletes for compliance:
```typescript
// Instead of delete
model Student {
  deletedAt DateTime?
}

// Mark as deleted
prisma.student.update({
  where: { id },
  data: { deletedAt: new Date(), isActive: false }
});
```

---

## Migration Strategy

### Development

Use `db:push` for rapid iteration:
```bash
npm run db:push
```

### Production

Use migrations for versioned schema changes:
```bash
# Create migration
npm run db:migrate

# Deploy to production
npm run db:migrate:deploy
```

### Schema Changes

When modifying schema:

1. **Update `schema.prisma`**
2. **Generate client:** `npm run db:generate`
3. **Test locally:** `npm run db:push`
4. **Create migration:** `npm run db:migrate`
5. **Commit migration** files
6. **Deploy:** Auto-deploys on Vercel

---

## Example Queries

### Common Operations

```typescript
// Get teacher's classes with enrollment count
const classes = await prisma.class.findMany({
  where: { teacherId: userId },
  include: {
    _count: {
      select: { enrollments: true }
    }
  }
});

// Get student with all assessments
const student = await prisma.student.findUnique({
  where: { id: studentId },
  include: {
    assessmentResults: {
      include: { assessment: true }
    },
    standardMastery: {
      include: { standard: true }
    }
  }
});

// Get class roster
const roster = await prisma.enrollment.findMany({
  where: {
    classId: classId,
    status: 'ACTIVE'
  },
  include: { student: true },
  orderBy: {
    student: {
      lastName: 'asc'
    }
  }
});

// Calculate standard mastery
const mastery = await prisma.standardMastery.groupBy({
  by: ['masteryLevel'],
  where: { studentId },
  _count: true
});

// Get recent predictions
const predictions = await prisma.predictionData.findMany({
  where: { studentId },
  orderBy: { predictionDate: 'desc' },
  take: 5
});
```

---

## Schema Version

**Version:** 1.0.0
**Date:** 2025-12-05
**Prisma:** 5.22.0
**Database:** PostgreSQL 15+ (Vercel Postgres)

---

## Additional Resources

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Georgia Standards of Excellence](https://www.georgiastandards.org/)
- [FERPA Guidelines](https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html)
