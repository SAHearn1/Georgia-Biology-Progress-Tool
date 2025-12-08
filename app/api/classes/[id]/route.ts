import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Class detail API' });
}

export async function PUT() {
  return NextResponse.json({ message: 'Update class' });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Delete class' });
}
