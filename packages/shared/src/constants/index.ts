/**
 * Shared constants for Georgia Biology Progress Tool
 */

// ============================================================================
// Standards Constants
// ============================================================================

export const STANDARD_CATEGORIES = {
  CELLS_AND_CELLULAR_PROCESSES: 'Cells and Cellular Processes',
  GENETICS: 'Genetics',
  EVOLUTION: 'Evolution',
  ECOLOGY: 'Ecology',
} as const;

export const STANDARD_CODES = {
  // Domain 1: Cells and Cellular Processes
  SB1: 'Cell Structure and Function',
  'SB1.a': 'Cell Theory and Organelles',
  'SB1.b': 'Transport Across Cell Membrane',
  'SB1.c': 'Enzyme Function',
  SB2: 'Photosynthesis and Cellular Respiration',
  'SB2.a': 'Photosynthesis Process',
  'SB2.b': 'Cellular Respiration',

  // Domain 2: Genetics
  SB3: 'DNA, RNA, and Protein Synthesis',
  'SB3.a': 'DNA and Chromosome Structure',
  'SB3.b': 'Protein Synthesis',
  'SB3.c': 'Patterns of Inheritance',

  // Domain 3: Evolution
  SB4: 'Evidence for Evolution',
  'SB4.a': 'Evidence Supporting Evolution',
  'SB4.b': 'Natural Selection',
  'SB4.c': 'Speciation',
  SB5: 'Biological Classification',
  'SB5.a': 'Classification Systems',
  'SB5.b': 'Three Domains of Life',

  // Domain 4: Ecology
  SB6: 'Ecology and Interdependence',
  'SB6.a': 'Energy Flow in Ecosystems',
  'SB6.b': 'Biogeochemical Cycles',
  'SB6.c': 'Population Dynamics',
  'SB6.d': 'Symbiotic Relationships',
} as const;

// ============================================================================
// Mastery Level Constants
// ============================================================================

export const MASTERY_LEVELS = {
  NOT_STARTED: { value: 0, label: 'Not Started', color: '#9CA3AF' },
  BEGINNING: { value: 1, label: 'Beginning', color: '#EF4444' },
  DEVELOPING: { value: 2, label: 'Developing', color: '#F59E0B' },
  PROFICIENT: { value: 3, label: 'Proficient', color: '#10B981' },
  ADVANCED: { value: 4, label: 'Advanced', color: '#3B82F6' },
} as const;

// ============================================================================
// Assessment Constants
// ============================================================================

export const ASSESSMENT_TYPES = {
  PRACTICE_TEST: 'Practice Test',
  QUIZ: 'Quiz',
  FORMATIVE: 'Formative Assessment',
  SUMMATIVE: 'Summative Assessment',
  EOC_PRACTICE: 'EOC Practice',
} as const;

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'Multiple Choice',
  TRUE_FALSE: 'True/False',
  SHORT_ANSWER: 'Short Answer',
  ESSAY: 'Essay',
} as const;

// ============================================================================
// Grading Constants
// ============================================================================

export const GRADE_THRESHOLDS = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  F: 0,
} as const;

export const EOC_PASSING_SCORE = 70;

// ============================================================================
// User Role Constants
// ============================================================================

export const USER_ROLES = {
  TEACHER: 'Teacher',
  ADMIN: 'Administrator',
  PARENT: 'Parent',
} as const;

// ============================================================================
// Time Constants
// ============================================================================

export const SCHOOL_YEAR_START_MONTH = 7; // July (0-indexed)
export const SCHOOL_YEAR_END_MONTH = 5; // June (0-indexed)

export const TYPICAL_EOC_MONTH = 4; // May (0-indexed)

// ============================================================================
// Validation Constants
// ============================================================================

export const VALIDATION = {
  STUDENT_ID: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9-]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  CLASS: {
    NAME_MAX_LENGTH: 100,
    PERIOD_MAX_LENGTH: 20,
  },
  ASSESSMENT: {
    TITLE_MAX_LENGTH: 200,
    MAX_POINTS: 1000,
  },
} as const;

// ============================================================================
// Pagination Constants
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// ============================================================================
// API Constants
// ============================================================================

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/register',
  },
  USERS: '/api/users',
  CLASSES: '/api/classes',
  STUDENTS: '/api/students',
  ENROLLMENTS: '/api/enrollments',
  ASSESSMENTS: '/api/assessments',
  STANDARDS: '/api/standards',
  PROGRESS: '/api/progress',
  PREDICTIONS: '/api/predictions',
} as const;
