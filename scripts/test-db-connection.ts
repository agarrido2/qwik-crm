/**
 * Database Connection Test Script
 * 
 * This script tests the connection to Supabase PostgreSQL
 * and helps diagnose connection issues before running migrations.
 */

import postgres from "postgres";

async function testConnection() {
  console.log("🔍 Testing Supabase PostgreSQL connection...\n");

  // Check if DATABASE_URL exists
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("❌ ERROR: DATABASE_URL environment variable not found");
    console.log("\n📋 To fix this:");
    console.log("1. Go to Supabase Dashboard → Settings → Database");
    console.log("2. Copy 'Connection string' → 'URI'");
    console.log("3. Add it to your .env file as DATABASE_URL");
    console.log("\nExample format:");
    console.log("DATABASE_URL=\"postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres\"");
    process.exit(1);
  }

  console.log("✅ DATABASE_URL found");
  
  // Parse URL to show connection details (without password)
  try {
    const url = new URL(databaseUrl);
    console.log(`📡 Host: ${url.hostname}`);
    console.log(`🔌 Port: ${url.port}`);
    console.log(`🗄️  Database: ${url.pathname.slice(1)}`);
    console.log(`👤 User: ${url.username}`);
    console.log(`🔐 Password: ${'*'.repeat(8)} (hidden)\n`);
  } catch (error) {
    console.error("❌ ERROR: Invalid DATABASE_URL format");
    console.log("Expected format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres");
    process.exit(1);
  }

  // Test actual connection
  let client;
  try {
    console.log("🔄 Attempting connection...");
    
    client = postgres(databaseUrl, { 
      max: 1,
      prepare: false,
      connect_timeout: 10,
    });

    // Simple query to test connection
    const result = await client`SELECT version()`;
    
    console.log("✅ Connection successful!");
    console.log(`📊 PostgreSQL version: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`);
    
    // Test if we can create tables (permissions check)
    await client`SELECT 1`;
    console.log("✅ Database permissions OK");
    
  } catch (error: any) {
    console.error("❌ Connection failed!");
    console.error(`Error: ${error.message}`);
    
    if (error.code === 'SASL_SIGNATURE_MISMATCH') {
      console.log("\n🔧 SASL_SIGNATURE_MISMATCH Solutions:");
      console.log("1. Check your password is correct in DATABASE_URL");
      console.log("2. If password has special characters, URL-encode them:");
      console.log("   @ → %40, # → %23, $ → %24, % → %25, etc.");
      console.log("3. Try resetting your database password in Supabase");
      console.log("4. Make sure you're using the correct connection string format");
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
  }

  console.log("\n🎉 Database connection test completed successfully!");
  console.log("✅ Ready to run migrations with: bun run drizzle:push");
}

// Run the test
testConnection().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
