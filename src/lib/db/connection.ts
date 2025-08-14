/**
 * Database Connection - Drizzle + Supabase PostgreSQL
 * 
 * This file creates the database connection using Drizzle ORM
 * with Supabase PostgreSQL. It handles both server and edge environments.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "../../../drizzle/schema";

// Create PostgreSQL connection using environment variables
// DATABASE_URL should be your Supabase PostgreSQL connection string
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is required. " +
    "Get it from your Supabase project settings > Database > Connection string"
  );
}

// Create postgres client with Supabase-optimized settings
// These settings work better with Supabase's connection pooling
const client = postgres(connectionString, { 
  max: 1,
  // Disable prepared statements for Supabase compatibility
  prepare: false,
  // Increase timeout for Supabase
  connect_timeout: 30,
  // Disable SSL verification issues
  ssl: 'require',
  // Transform undefined to null for better Supabase compatibility
  transform: {
    undefined: null,
  },
});

// Create Drizzle database instance with schema
// This gives us access to both SQL-like queries and the Query API
export const db = drizzle(client, { schema });

// Export types for TypeScript inference
export type Database = typeof db;

// Export individual tables for direct SQL queries
export { users, clients, opportunities, activities } from "../../../drizzle/schema";

// Export enums for type safety in forms and components
export { opportunityStatusEnum, activityTypeEnum } from "../../../drizzle/schema";
