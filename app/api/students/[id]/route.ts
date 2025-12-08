import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Student detail API' });
}

export async function PUT() {
  return NextResponse.json({ message: 'Update student' });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Delete student' });
}
