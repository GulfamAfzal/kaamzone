// lib/db.js
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis;

// 1. Safely parse the connection string from .env
const dbUrl = new URL(process.env.DATABASE_URL);

// 2. Configure the Driver Adapter
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username,
  // decodeURIComponent safely translates special characters (like @ or #) in passwords
  password: decodeURIComponent(dbUrl.password), 
  database: dbUrl.pathname.substring(1) // Removes the leading slash from the db name
});

// 3. You must pass the adapter property inside the options object
export const db = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;