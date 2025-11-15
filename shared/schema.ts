import { z } from "zod";

export const subscriptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  cost: z.number(),
  billingPeriod: z.enum(["monthly", "yearly"]),
  renewalDate: z.string(),
  username: z.string().optional(),
  password: z.string().optional(),
  reminderDays: z.number().optional(),
  status: z.enum(["active", "warning", "urgent", "critical"]),
  category: z.string().optional(),
  notes: z.string().optional(),
  lastLogin: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const updateReminderDaysSchema = z.object({
  reminderDays: z.number().min(1),
});

export type Subscription = z.infer<typeof subscriptionSchema>;
export type UpdateReminderDays = z.infer<typeof updateReminderDaysSchema>;
