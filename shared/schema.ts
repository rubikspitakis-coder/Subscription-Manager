import { z } from "zod";
import { pgTable, serial, text, real, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const billingPeriodEnum = pgEnum("billing_period", ["monthly", "yearly"]);
export const statusEnum = pgEnum("status", ["active", "warning", "urgent", "critical"]);

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cost: real("cost").notNull().default(0),
  billingPeriod: billingPeriodEnum("billing_period").notNull().default("monthly"),
  renewalDate: timestamp("renewal_date").notNull(),
  username: text("username"),
  password: text("password"),
  reminderDays: integer("reminder_days").default(30),
  status: statusEnum("status").notNull().default("active"),
  category: text("category"),
  notes: text("notes"),
  lastLogin: timestamp("last_login"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions, {
  renewalDate: z.union([z.string(), z.date()]).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
  lastLogin: z.union([z.string(), z.date(), z.undefined()]).transform((val) => 
    val ? (typeof val === 'string' ? new Date(val) : val) : undefined
  ).optional(),
}).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const updateReminderDaysSchema = z.object({
  reminderDays: z.number().min(1),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type UpdateReminderDays = z.infer<typeof updateReminderDaysSchema>;
