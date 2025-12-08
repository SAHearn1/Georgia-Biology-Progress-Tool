import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for student join request
const studentJoinSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  studentId: z.string().min(1).max(20),
  classCode: z.string().min(4).max(20),
});

/**
 * POST /api/student/join
 * 
 * Handles student join requests - Privacy-first approach without email
 * 
 * This endpoint will:
 * 1. Validate the request data
 * 2. Verify the class code exists
 * 3. Create or find the student record
 * 4. Create an enrollment linking the student to the class
 * 
 * Note: This is a placeholder implementation. Once PR #1 is merged with
 * the Prisma schema and database setup, this will be updated to:
 * - Use prisma client to query/create students
 * - Verify class codes against the Class table
 * - Create enrollments in the Enrollment table
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = studentJoinSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.issues },
        { status: 400 }
      );
    }
    
    const { firstName, lastName, studentId, classCode } = validationResult.data;
    
    // TODO: Once PR #1 is merged, implement the following:
    // 
    // 1. Import prisma client:
    //    import { prisma } from '@/lib/prisma';
    //
    // 2. Find class by code:
    //    const classRecord = await prisma.class.findFirst({
    //      where: { code: classCode }
    //    });
    //    if (!classRecord) {
    //      return NextResponse.json(
    //        { error: 'Invalid class code' },
    //        { status: 404 }
    //      );
    //    }
    //
    // 3. Create or find student:
    //    const student = await prisma.student.upsert({
    //      where: { studentId },
    //      update: {
    //        firstName,
    //        lastName,
    //      },
    //      create: {
    //        studentId,
    //        firstName,
    //        lastName,
    //      },
    //    });
    //
    // 4. Check if already enrolled:
    //    const existingEnrollment = await prisma.enrollment.findFirst({
    //      where: {
    //        studentId: student.id,
    //        classId: classRecord.id,
    //      },
    //    });
    //    if (existingEnrollment) {
    //      return NextResponse.json(
    //        { error: 'Student is already enrolled in this class' },
    //        { status: 409 }
    //      );
    //    }
    //
    // 5. Create enrollment:
    //    const enrollment = await prisma.enrollment.create({
    //      data: {
    //        studentId: student.id,
    //        classId: classRecord.id,
    //      },
    //    });
    //
    // 6. Return success with enrollment data
    
    // Placeholder response for now
    return NextResponse.json(
      {
        success: true,
        message: 'Student join endpoint is ready. Will be fully functional once database schema is available.',
        data: {
          firstName,
          lastName,
          studentId,
          classCode,
        },
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error in student join:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
