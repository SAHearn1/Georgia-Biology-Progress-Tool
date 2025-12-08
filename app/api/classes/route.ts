import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Classes API' });
}

export async function POST() {
  return NextResponse.json({ message: 'Create class' });
}
