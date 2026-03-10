import { jest } from '@jest/globals';

// 1. We mock the MODULE before anything else
// This prevents the 'new PrismaClient()' from ever running the real code
jest.unstable_mockModule('@prisma/client', () => {
  return {
    PrismaClient: class {
      constructor() {
        this.user = {
          findUnique: jest.fn(),
          create: jest.fn(),
        };
      }
    }
  };
});

// 2. Dynamic import is REQUIRED for unstable_mockModule to work in ESM
const { prisma } = await import('./client.js');
const { default: Uservar } = await import('./user.js');

describe("Uservar Safe Test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should work without __internal error", async () => {
        // Setup mock
        prisma.user.findUnique.mockResolvedValue({ id: 'suborna' });

        const result = await Uservar('suborna');

        expect(result.id).toBe('suborna');
    });
});