/**
 * Database Utilities - Helper functions for CRM
 * 
 * This file contains utility functions for common database operations,
 * type definitions, and validation helpers.
 */

import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, clients, opportunities, activities } from "./connection";

// ===== TYPE DEFINITIONS =====
// These types are automatically inferred from the Drizzle schema

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

export type Opportunity = InferSelectModel<typeof opportunities>;
export type NewOpportunity = InferInsertModel<typeof opportunities>;

export type Activity = InferSelectModel<typeof activities>;
export type NewActivity = InferInsertModel<typeof activities>;

// ===== ENUM VALUES =====
// Export enum values for use in forms and components

export const OPPORTUNITY_STATUSES = [
  { value: 'lead', label: 'Lead', color: 'bg-blue-100 text-blue-800' },
  { value: 'qualified', label: 'Qualified', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'proposal', label: 'Proposal', color: 'bg-purple-100 text-purple-800' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { value: 'closed_won', label: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'bg-red-100 text-red-800' },
] as const;

export const ACTIVITY_TYPES = [
  { value: 'call', label: 'Call', icon: '📞' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
  { value: 'task', label: 'Task', icon: '✅' },
  { value: 'note', label: 'Note', icon: '📝' },
] as const;

// ===== UTILITY FUNCTIONS =====

/**
 * Format currency value for display
 */
export const formatCurrency = (value: string | number, currency = 'EUR'): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '€0.00';
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
  }).format(numValue);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format datetime for display
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Get opportunity status configuration
 */
export const getOpportunityStatus = (status: string) => {
  return OPPORTUNITY_STATUSES.find(s => s.value === status) || OPPORTUNITY_STATUSES[0];
};

/**
 * Get activity type configuration
 */
export const getActivityType = (type: string) => {
  return ACTIVITY_TYPES.find(t => t.value === type) || ACTIVITY_TYPES[0];
};

/**
 * Calculate days until expected close date
 */
export const getDaysUntilClose = (expectedCloseDate: Date | string): number => {
  const closeDate = typeof expectedCloseDate === 'string' 
    ? new Date(expectedCloseDate) 
    : expectedCloseDate;
  
  const today = new Date();
  const diffTime = closeDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};
