/**
 * Shared utility functions for Georgia Biology Progress Tool
 */

import { GRADE_THRESHOLDS, MASTERY_LEVELS } from '../constants';
import type { MasteryLevel } from '../types';

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format a student's full name
 */
export function formatStudentName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

/**
 * Format a percentage score
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date and time for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ============================================================================
// Calculation Utilities
// ============================================================================

/**
 * Calculate percentage from score and max score
 */
export function calculatePercentage(score: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  return (score / maxScore) * 100;
}

/**
 * Get letter grade from percentage
 */
export function getLetterGrade(percentage: number): string {
  if (percentage >= GRADE_THRESHOLDS.A) return 'A';
  if (percentage >= GRADE_THRESHOLDS.B) return 'B';
  if (percentage >= GRADE_THRESHOLDS.C) return 'C';
  if (percentage >= GRADE_THRESHOLDS.D) return 'D';
  return 'F';
}

/**
 * Calculate average of an array of numbers
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

/**
 * Calculate standard deviation
 */
export function calculateStandardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = calculateAverage(numbers);
  const squareDiffs = numbers.map((num) => Math.pow(num - avg, 2));
  const avgSquareDiff = calculateAverage(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

// ============================================================================
// Mastery Level Utilities
// ============================================================================

/**
 * Get mastery level metadata
 */
export function getMasteryLevelInfo(level: MasteryLevel) {
  return MASTERY_LEVELS[level];
}

/**
 * Calculate mastery percentage from level
 */
export function masteryLevelToPercentage(level: MasteryLevel): number {
  const info = getMasteryLevelInfo(level);
  return (info.value / 4) * 100; // 0-4 scale to 0-100
}

/**
 * Determine mastery level from percentage
 */
export function percentageToMasteryLevel(percentage: number): MasteryLevel {
  if (percentage < 20) return 'NOT_STARTED';
  if (percentage < 50) return 'BEGINNING';
  if (percentage < 70) return 'DEVELOPING';
  if (percentage < 90) return 'PROFICIENT';
  return 'ADVANCED';
}

// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Get current school year (e.g., "2024-2025")
 */
export function getCurrentSchoolYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // If before July, we're in the previous school year
  if (month < 6) {
    return `${year - 1}-${year}`;
  }
  return `${year}-${year + 1}`;
}

/**
 * Calculate days until a date
 */
export function daysUntil(targetDate: Date | string): number {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is past due
 */
export function isPastDue(dueDate: Date | string): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return due < new Date();
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate student ID format
 */
export function isValidStudentId(studentId: string): boolean {
  const regex = /^[A-Z0-9-]+$/;
  return regex.test(studentId) && studentId.length >= 3 && studentId.length <= 20;
}

// ============================================================================
// Array Utilities
// ============================================================================

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Group array items by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Truncate string to specified length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}
