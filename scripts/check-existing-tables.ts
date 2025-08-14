/**
 * Check Existing Tables Script
 * 
 * This script checks what tables and functions already exist in your Supabase database
 * to understand your current setup before explaining ORM integration.
 */

import postgres from "postgres";

async function checkExistingTables() {
  console.log("🔍 Checking your current Supabase database setup...\n");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not found");
    process.exit(1);
  }

  const client = postgres(databaseUrl, { 
    max: 1,
    prepare: false,
    connect_timeout: 30,
    ssl: 'require',
  });

  try {
    console.log("📋 EXISTING TABLES:");
    console.log("==================");
    
    // Check what tables exist in public schema
    const tables = await client`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    if (tables.length === 0) {
      console.log("❌ No tables found in public schema");
    } else {
      tables.forEach(table => {
        console.log(`✅ ${table.table_name} (${table.table_type})`);
      });
    }

    console.log("\n🔧 EXISTING FUNCTIONS/TRIGGERS:");
    console.log("===============================");
    
    // Check for functions that might handle user sync
    const functions = await client`
      SELECT routine_name, routine_type 
      FROM information_schema.routines 
      WHERE routine_schema = 'public' 
      AND routine_name LIKE '%user%'
      ORDER BY routine_name
    `;
    
    if (functions.length === 0) {
      console.log("❌ No user-related functions found");
    } else {
      functions.forEach(func => {
        console.log(`⚡ ${func.routine_name} (${func.routine_type})`);
      });
    }

    console.log("\n📊 AUTH SCHEMA TABLES:");
    console.log("======================");
    
    // Check auth schema (Supabase auth tables)
    const authTables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'auth' 
      ORDER BY table_name
    `;
    
    authTables.forEach(table => {
      console.log(`🔐 auth.${table.table_name}`);
    });

    console.log("\n🎯 ANALYSIS:");
    console.log("=============");
    
    const hasUsersTable = tables.some(t => t.table_name === 'users');
    const hasClientsTable = tables.some(t => t.table_name === 'clients');
    const hasOpportunitiesTable = tables.some(t => t.table_name === 'opportunities');
    const hasActivitiesTable = tables.some(t => t.table_name === 'activities');
    
    if (hasUsersTable) {
      console.log("✅ You have a 'users' table - checking if it matches Drizzle schema...");
      
      // Check users table structure
      const userColumns = await client`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
        ORDER BY ordinal_position
      `;
      
      console.log("\n📋 Your current 'users' table structure:");
      userColumns.forEach(col => {
        console.log(`   • ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } else {
      console.log("❌ No 'users' table found - Drizzle created the CRM tables but you might need sync");
    }
    
    if (hasClientsTable && hasOpportunitiesTable && hasActivitiesTable) {
      console.log("✅ All CRM tables exist - Drizzle migration was successful!");
    } else {
      console.log("⚠️  Some CRM tables are missing - migration might have failed");
    }

  } catch (error: any) {
    console.error("❌ Error checking database:", error.message);
  } finally {
    await client.end();
  }
}

// Run the check
checkExistingTables().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
