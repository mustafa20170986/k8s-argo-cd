import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL
// 1. Create the connection pool using your connection string
const pool = new Pool({ connectionString:connectionString });

// 2. Create the adapter
const adapter = new PrismaPg(pool);

// 3. PASS the adapter to the PrismaClient constructor
export const prisma = new PrismaClient({
  adapter: adapter, // <--- This was missing!
  log: ['query', 'error', 'warn'],
});