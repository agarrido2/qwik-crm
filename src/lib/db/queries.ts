/**
 * CRM Database Queries - Drizzle ORM
 * 
 * This file contains all database queries for the CRM system.
 * Uses both Drizzle's Query API (for relations) and SQL-like API (for complex queries).
 */

import { eq, desc, and, gte, lte, count, sql } from "drizzle-orm";
import { db, users, clients, opportunities, activities } from "./connection";

// ===== USER QUERIES =====

/**
 * Get or create user profile from Supabase Auth
 * This syncs Supabase auth.users with our CRM users table
 */
export const getUserProfile = async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  return user;
};

/**
 * Create or update user profile
 * Called when user first logs in or updates their profile
 */
export const upsertUserProfile = async (userData: {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}) => {
  return await db
    .insert(users)
    .values({
      ...userData,
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: userData.email,
        name: userData.name,
        avatar_url: userData.avatar_url,
        updated_at: new Date(),
      },
    })
    .returning();
};

// ===== CLIENT QUERIES =====

/**
 * Get all clients for a user with pagination
 * Uses Query API for clean relational data
 */
export const getUserClients = async (userId: string, limit = 50, offset = 0) => {
  return await db.query.clients.findMany({
    where: eq(clients.user_id, userId),
    orderBy: [desc(clients.created_at)],
    limit,
    offset,
    // Include related opportunities count
    extras: {
      opportunitiesCount: sql<number>`(
        SELECT COUNT(*) 
        FROM ${opportunities} 
        WHERE ${opportunities.client_id} = ${clients.id}
      )`.as("opportunities_count"),
    },
  });
};

/**
 * Get single client with all related data
 * Perfect for client detail page
 */
export const getClientWithDetails = async (clientId: string, userId: string) => {
  return await db.query.clients.findFirst({
    where: and(
      eq(clients.id, clientId),
      eq(clients.user_id, userId)
    ),
    with: {
      // Include all opportunities for this client
      opportunities: {
        orderBy: [desc(opportunities.created_at)],
        limit: 10,
      },
      // Include recent activities
      activities: {
        orderBy: [desc(activities.created_at)],
        limit: 5,
      },
    },
  });
};

/**
 * Create new client
 */
export const createClient = async (clientData: {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  user_id: string;
}) => {
  return await db.insert(clients).values(clientData).returning();
};

// ===== OPPORTUNITY QUERIES =====

/**
 * Get user's opportunities with client info
 * Great for sales pipeline dashboard
 */
export const getUserOpportunities = async (userId: string) => {
  return await db.query.opportunities.findMany({
    where: eq(opportunities.user_id, userId),
    orderBy: [desc(opportunities.created_at)],
    with: {
      // Include client information
      client: {
        columns: {
          id: true,
          name: true,
          company: true,
        },
      },
    },
  });
};

/**
 * Get opportunities by status (for pipeline view)
 */
export const getOpportunitiesByStatus = async (userId: string, status: string) => {
  return await db.query.opportunities.findMany({
    where: and(
      eq(opportunities.user_id, userId),
      eq(opportunities.status, status as any)
    ),
    with: {
      client: true,
    },
    orderBy: [desc(opportunities.value)],
  });
};

/**
 * Create new opportunity
 */
export const createOpportunity = async (opportunityData: {
  title: string;
  description?: string;
  value?: string;
  currency?: string;
  status?: string;
  expected_close_date?: Date;
  client_id: string;
  user_id: string;
}) => {
  return await db.insert(opportunities).values(opportunityData as any).returning();
};

// ===== ACTIVITY QUERIES =====

/**
 * Get recent activities for dashboard
 */
export const getRecentActivities = async (userId: string, limit = 10) => {
  return await db.query.activities.findMany({
    where: eq(activities.user_id, userId),
    orderBy: [desc(activities.created_at)],
    limit,
    with: {
      client: {
        columns: {
          id: true,
          name: true,
        },
      },
      opportunity: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
  });
};

/**
 * Get activities for specific client
 */
export const getClientActivities = async (clientId: string, userId: string) => {
  return await db.query.activities.findMany({
    where: and(
      eq(activities.client_id, clientId),
      eq(activities.user_id, userId)
    ),
    orderBy: [desc(activities.created_at)],
  });
};

/**
 * Create new activity
 */
export const createActivity = async (activityData: {
  title: string;
  description?: string;
  type: string;
  scheduled_at?: Date;
  client_id?: string;
  opportunity_id?: string;
  user_id: string;
}) => {
  return await db.insert(activities).values(activityData as any).returning();
};

// ===== DASHBOARD ANALYTICS =====

/**
 * Get dashboard stats for user
 * Uses SQL for efficient aggregation
 */
export const getDashboardStats = async (userId: string) => {
  // Get counts using Drizzle's count function
  const [clientsCount, opportunitiesCount, activitiesCount] = await Promise.all([
    db.select({ count: count() }).from(clients).where(eq(clients.user_id, userId)),
    db.select({ count: count() }).from(opportunities).where(eq(opportunities.user_id, userId)),
    db.select({ count: count() }).from(activities).where(eq(activities.user_id, userId)),
  ]);

  // Get total opportunity value
  const totalValue = await db
    .select({ 
      total: sql<string>`COALESCE(SUM(${opportunities.value}), 0)` 
    })
    .from(opportunities)
    .where(and(
      eq(opportunities.user_id, userId),
      eq(opportunities.status, 'closed_won')
    ));

  return {
    clients: clientsCount[0]?.count || 0,
    opportunities: opportunitiesCount[0]?.count || 0,
    activities: activitiesCount[0]?.count || 0,
    totalRevenue: totalValue[0]?.total || "0",
  };
};
