/**
 * Shared TypeScript types for Georgia Biology Progress Tool
 * Used across web app and other packages
 */

// ============================================================================
// User & Authentication Types
// ============================================================================

export type UserRole = 'TEACHER' | 'ADMIN' | 'PARENT';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Class & Student Types
// ============================================================================

export interface Class {
  id: string;
  name: string;
  period: string | null;
  schoolYear: string | null;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gradeLevel: number | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type EnrollmentStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED';

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  enrolledAt: Date;
  status: EnrollmentStatus;
}

// ============================================================================
// Standards Types
// ============================================================================

export type StandardCategory =
  | 'CELLS_AND_CELLULAR_PROCESSES'
  | 'GENETICS'
  | 'EVOLUTION'
  | 'ECOLOGY';

export interface Standard {
  id: string;
  code: string;
  title: string;
  description: string;
  category: StandardCategory;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Assessment Types
// ============================================================================

export type AssessmentType =
  | 'PRACTICE_TEST'
  | 'QUIZ'
  | 'FORMATIVE'
  | 'SUMMATIVE'
  | 'EOC_PRACTICE';

export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'ESSAY';

export interface Assessment {
  id: string;
  title: string;
  description: string | null;
  type: AssessmentType;
  totalPoints: number;
  assignedDate: Date | null;
  dueDate: Date | null;
  classId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  questionText: string;
  questionType: QuestionType;
  points: number;
  order: number;
  options: any; // JSON
  correctAnswer: string;
  assessmentId: string;
  standardId: string | null;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  startedAt: Date | null;
  completedAt: Date | null;
  timeSpent: number | null;
  responses: any; // JSON
  createdAt: Date;
}

// ============================================================================
// Progress Tracking Types
// ============================================================================

export type MasteryLevel =
  | 'NOT_STARTED'
  | 'BEGINNING'
  | 'DEVELOPING'
  | 'PROFICIENT'
  | 'ADVANCED';

export interface ProgressRecord {
  id: string;
  studentId: string;
  standardId: string;
  masteryLevel: MasteryLevel;
  confidence: number | null;
  attempts: number;
  lastAssessed: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// EOC Prediction Types
// ============================================================================

export interface EOCPrediction {
  id: string;
  studentId: string;
  predictedScore: number;
  confidenceInterval: number;
  cellsScore: number | null;
  geneticsScore: number | null;
  evolutionScore: number | null;
  ecologyScore: number | null;
  modelVersion: string;
  predictionDate: Date;
  factors: any; // JSON
  createdAt: Date;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
