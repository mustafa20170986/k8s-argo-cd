import { jest } from "@jest/globals";
import { prisma } from "./client.js"; // Real Prisma instance
import Uservar from "./user.js";      // Real logic

describe("Uservar Integration Test (Real DB)", () => {
  
  // Set a longer timeout because real DB operations take time
  jest.setTimeout(10000);

  beforeAll(async () => {
    // Ensure the database is reachable before starting
    await prisma.$connect();
  });

  beforeEach(async () => {
    // CLEAN SLATE: Delete all users so every test starts fresh
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // IMPORTANT: Disconnect so Jest can exit properly
    await prisma.$disconnect();
  });

  test("should create a new user if they do not exist", async () => {
    const testId = "integration-user-1";

    // 1. Run the function (It will check DB, find nothing, then create)
    const result = await Uservar(testId);

    // 2. Assertions
    expect(result).toBeDefined();
    expect(result?.id).toBe(testId);

    // 3. Double check the database directly
    const dbUser = await prisma.user.findUnique({ where: { id: testId } });
    expect(dbUser).not.toBeNull();
  });

  test("should return existing user and NOT create a duplicate", async () => {
    const existingId = "existing-id";

    // 1. Manually seed a user into the real DB
    await prisma.user.create({ data: { id: existingId } });

    // 2. Run the function
    const result = await Uservar(existingId);

    // 3. Assertions
    expect(result.id).toBe(existingId);
    
    // 4. Verify count is still 1 (no duplicates created)
    const count = await prisma.user.count();
    expect(count).toBe(1);
  });
});