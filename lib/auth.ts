import { NextResponse } from 'next/server';

// Placeholder auth handlers - to be implemented with NextAuth
export const handlers = {
  GET: async () => {
    return NextResponse.json({ message: 'Auth GET - To be implemented' });
  },
  POST: async () => {
    return NextResponse.json({ message: 'Auth POST - To be implemented' });
  },
};
