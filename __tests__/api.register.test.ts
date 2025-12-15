import { POST } from '../app/api/register/route';
import { NextRequest, NextResponse } from 'next/server';

// Mock the Next.js request/response objects
const mockRequest = (body: any) => ({
  json: async () => body,
} as unknown as NextRequest);

describe('API Contract Test: /api/register', () => {
  it('should return a success message for a POST request', async () => {
    const req = mockRequest({});
    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ message: 'Register API' });
  });
});
