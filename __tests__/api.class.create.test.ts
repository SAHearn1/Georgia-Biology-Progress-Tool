import { POST } from '../app/api/class/create/route';
import { NextRequest } from 'next/server';
import { auth } from '../lib/auth';
import { db } from '../lib/db';

// Mock the entire modules
jest.mock('../lib/auth');
jest.mock('../lib/db');

// Typecast the mocked functions for intellisense
const mockAuth = auth as any;
const mockDb = db as any;

// Mock the Next.js request object
const mockRequest = (body: any) => ({
  json: async () => body,
} as unknown as NextRequest);

describe('API Contract Test: /api/class/create', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockAuth.mockClear();
    // Deep reset of the db mock
    (mockDb as any).class = {
      findUnique: jest.fn(),
      create: jest.fn(),
    };
  });

  it('should return 401 Unauthorized if no session is found', async () => {
    mockAuth.mockResolvedValue(null);
    const req = mockRequest({});
    const response = await POST(req);

    expect(response.status).toBe(401);
    const text = await response.text();
    expect(text).toBe('Unauthorized');
  });

  it('should return 400 Bad Request if required fields are missing', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'teacher-id' } });
    const req = mockRequest({ name: 'Biology 101' }); // accessCode is missing
    const response = await POST(req);

    expect(response.status).toBe(400);
    const text = await response.text();
    expect(text).toBe('Missing required fields');
  });

  it('should return 409 Conflict if access code already exists', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'teacher-id' } });
    mockDb.class.findUnique.mockResolvedValue({ id: 'existing-class-id' });

    const req = mockRequest({ name: 'Biology 101', accessCode: 'BIO101' });
    const response = await POST(req);

    expect(response.status).toBe(409);
    const text = await response.text();
    expect(text).toContain('Access Code already taken');
  });

  it('should return 200 and the new class object on successful creation', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'teacher-id' } });
    mockDb.class.findUnique.mockResolvedValue(null);
    const newClass = {
      id: 'new-class-id',
      name: 'Biology 101',
      accessCode: 'BIO101',
      teacherId: 'teacher-id',
    };
    mockDb.class.create.mockResolvedValue(newClass);

    const req = mockRequest({
      name: 'Biology 101',
      accessCode: 'bio101',
      description: 'First period class',
    });
    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(newClass);
    expect(mockDb.class.create).toHaveBeenCalledWith({
      data: {
        name: 'Biology 101',
        accessCode: 'BIO101', // Should be uppercased
        description: 'First period class',
        teacherId: 'teacher-id',
      },
    });
  });
});
