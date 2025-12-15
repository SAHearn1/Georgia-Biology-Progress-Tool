import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock the entire Prisma client
const prismaMock = mockDeep<PrismaClient>();

// Reset the mock before each test
beforeEach(() => {
  mockReset(prismaMock);
});

export default prismaMock as unknown as DeepMockProxy<PrismaClient>;
