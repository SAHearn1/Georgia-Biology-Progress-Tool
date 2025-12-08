/**
 * API functions for student operations
 */

export interface JoinStudentRequest {
  name: string;
  code: string;
}

export interface JoinStudentResponse {
  success: boolean;
  message?: string;
}

/**
 * Join a student to a class using a code
 */
export async function joinStudent(
  data: JoinStudentRequest
): Promise<JoinStudentResponse> {
  try {
    const response = await fetch('/api/student/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to join class');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error joining class:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
}
