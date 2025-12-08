import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/student/join
 * Join a student to a class using a code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code } = body;

    // Validate input
    if (!name?.trim() || !code?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name and code are required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual database logic to:
    // 1. Validate the class code exists
    // 2. Create or find the student by name
    // 3. Create an enrollment linking the student to the class
    
    // For now, return success (will be implemented with database integration)
    return NextResponse.json({
      success: true,
      message: 'Successfully joined the class',
    });
  } catch (error) {
    console.error('Error in join API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
