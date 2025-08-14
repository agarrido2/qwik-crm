/**
 * CRM Database Schema - PostgreSQL + Supabase
 * 
 * This file defines the complete database structure for the CRM system.
 * Uses Drizzle ORM with PostgreSQL types for Supabase integration.
 */

import { pgTable, uuid, text, timestamp, integer, decimal, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums for better type safety and data consistency
export const opportunityStatusEnum = pgEnum('opportunity_status', [
  'lead',           // Initial contact
  'qualified',      // Qualified prospect
  'proposal',       // Proposal sent
  'negotiation',    // In negotiation
  'closed_won',     // Deal won
  'closed_lost'     // Deal lost
]);

export const activityTypeEnum = pgEnum('activity_type', [
  'call',           // Phone call
  'email',          // Email communication
  'meeting',        // In-person or virtual meeting
  'task',           // General task
  'note'            // Simple note/comment
]);

// Users table - Integrates with Supabase Auth
export const users = pgTable("users", {
  // UUID primary key (matches Supabase auth.users.id)
  id: uuid("id").primaryKey(),
  
  // User profile information
  email: text("email").notNull().unique(),
  name: text("name"),
  avatar_url: text("avatar_url"),
  
  // Timestamps for auditing
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Clients table - Core CRM entity
export const clients = pgTable("clients", {
  // UUID primary key
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Client information
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  
  // Address information
  address: text("address"),
  city: text("city"),
  country: text("country"),
  postal_code: text("postal_code"),
  
  // Relationship to user (who manages this client)
  user_id: uuid("user_id").references(() => users.id).notNull(),
  
  // Timestamps
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Opportunities table - Sales pipeline
export const opportunities = pgTable("opportunities", {
  // UUID primary key
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Opportunity details
  title: text("title").notNull(),
  description: text("description"),
  
  // Financial information
  value: decimal("value", { precision: 10, scale: 2 }),
  currency: text("currency").default("EUR"),
  
  // Pipeline status
  status: opportunityStatusEnum("status").default("lead").notNull(),
  
  // Expected close date
  expected_close_date: timestamp("expected_close_date"),
  
  // Relationships
  client_id: uuid("client_id").references(() => clients.id).notNull(),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  
  // Timestamps
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Activities table - Track interactions and tasks
export const activities = pgTable("activities", {
  // UUID primary key
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Activity details
  title: text("title").notNull(),
  description: text("description"),
  type: activityTypeEnum("type").notNull(),
  
  // Scheduling
  scheduled_at: timestamp("scheduled_at"),
  completed_at: timestamp("completed_at"),
  is_completed: boolean("is_completed").default(false).notNull(),
  
  // Relationships (activity can be linked to client and/or opportunity)
  client_id: uuid("client_id").references(() => clients.id),
  opportunity_id: uuid("opportunity_id").references(() => opportunities.id),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  
  // Timestamps
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Define relationships for Drizzle's Query API
// This enables nested queries like: db.query.users.findMany({ with: { clients: true } })

export const usersRelations = relations(users, ({ many }) => ({
  // One user can have many clients
  clients: many(clients),
  // One user can have many opportunities
  opportunities: many(opportunities),
  // One user can have many activities
  activities: many(activities),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  // Each client belongs to one user
  user: one(users, {
    fields: [clients.user_id],
    references: [users.id],
  }),
  // One client can have many opportunities
  opportunities: many(opportunities),
  // One client can have many activities
  activities: many(activities),
}));

export const opportunitiesRelations = relations(opportunities, ({ one, many }) => ({
  // Each opportunity belongs to one client
  client: one(clients, {
    fields: [opportunities.client_id],
    references: [clients.id],
  }),
  // Each opportunity belongs to one user
  user: one(users, {
    fields: [opportunities.user_id],
    references: [users.id],
  }),
  // One opportunity can have many activities
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  // Each activity belongs to one user
  user: one(users, {
    fields: [activities.user_id],
    references: [users.id],
  }),
  // Each activity can belong to one client (optional)
  client: one(clients, {
    fields: [activities.client_id],
    references: [clients.id],
  }),
  // Each activity can belong to one opportunity (optional)
  opportunity: one(opportunities, {
    fields: [activities.opportunity_id],
    references: [opportunities.id],
  }),
}));

// Export schema object for Drizzle connection
export const schema = {
  users,
  clients,
  opportunities,
  activities,
  usersRelations,
  clientsRelations,
  opportunitiesRelations,
  activitiesRelations,
};
