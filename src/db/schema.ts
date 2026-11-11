import { pgTable, uuid, varchar, text, date, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const reunionSubmissions = pgTable("reunion_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  mobileNumber: varchar("mobile_number", { length: 32 }).notNull().unique(),
  preferredDate: varchar("preferred_date", { length: 100 }).notNull(),
  customDate: date("custom_date"),
  preferredFood: varchar("preferred_food", { length: 100 }).notNull(),
  customFood: text("custom_food"),
  mealSchedule: varchar("meal_schedule", { length: 100 }).notNull(),
  preferredGift: varchar("preferred_gift", { length: 100 }).notNull(),
  customGift: text("custom_gift"),
  preferredActivities: jsonb("preferred_activities").$type<string[]>().notNull(),
  activitiesToAvoid: jsonb("activities_to_avoid").$type<string[]>().notNull(),
  additionalSuggestions: text("additional_suggestions"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ReunionSubmission = typeof reunionSubmissions.$inferSelect;
export type NewReunionSubmission = typeof reunionSubmissions.$inferInsert;

