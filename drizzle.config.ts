import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // PostgreSQL dialect for Supabase
  dialect: "postgresql",
  
  // Schema definition file
  schema: "./drizzle/schema.ts",
  
  // Migration files output directory
  out: "./drizzle/migrations/",
  
  // Supabase PostgreSQL connection
  dbCredentials: {
    // Uses DATABASE_URL environment variable from Supabase
    url: process.env.DATABASE_URL!,
  },
  
  // Enable verbose logging for development
  verbose: true,
  
  // Enable strict mode for better type safety
  strict: true,
});
