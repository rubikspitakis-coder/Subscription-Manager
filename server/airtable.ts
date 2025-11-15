import Airtable from "airtable";
import { differenceInDays } from "date-fns";
import type { Subscription } from "@shared/schema";
import bcrypt from "bcryptjs";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

const tableName = process.env.AIRTABLE_TABLE_NAME || "Subscriptions";

function getStatus(renewalDate: Date): Subscription["status"] {
  const daysUntil = differenceInDays(renewalDate, new Date());
  if (daysUntil < 0) return "critical";
  if (daysUntil <= 5) return "critical";
  if (daysUntil <= 14) return "urgent";
  if (daysUntil <= 30) return "warning";
  return "active";
}

async function encryptPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const records = await base(tableName).select().all();

  return records.map((record) => {
    const renewalDate = new Date(record.get("Renewal Date") as string);
    return {
      id: record.id,
      name: record.get("Name") as string,
      cost: Number(record.get("Cost") || 0),
      billingPeriod: (record.get("Billing Period") as "monthly" | "yearly") || "monthly",
      renewalDate: renewalDate.toISOString(),
      username: record.get("Username") as string | undefined,
      password: record.get("Password") as string | undefined,
      reminderDays: Number(record.get("Reminder Days") || 30),
      status: getStatus(renewalDate),
      category: record.get("Category") as string | undefined,
      notes: record.get("Notes") as string | undefined,
      lastLogin: record.get("Last Login") ? new Date(record.get("Last Login") as string).toISOString() : undefined,
      paymentMethod: record.get("Payment Method") as string | undefined,
    };
  });
}

export async function updateReminderDays(
  subscriptionId: string,
  reminderDays: number
): Promise<void> {
  await base(tableName).update(subscriptionId, {
    "Reminder Days": reminderDays,
  });
}

export async function getSubscriptionsDueForReminder(): Promise<Subscription[]> {
  const subscriptions = await getSubscriptions();
  
  return subscriptions.filter((sub) => {
    const renewalDate = new Date(sub.renewalDate);
    const daysUntil = differenceInDays(renewalDate, new Date());
    const reminderDays = sub.reminderDays || 30;
    
    return daysUntil <= reminderDays && daysUntil >= 0;
  });
}

export async function getSubscriptionsForAutoReminder(): Promise<Subscription[]> {
  const subscriptions = await getSubscriptions();
  
  return subscriptions.filter((sub) => {
    const renewalDate = new Date(sub.renewalDate);
    const daysUntil = differenceInDays(renewalDate, new Date());
    
    return daysUntil <= 5 && daysUntil >= 0;
  });
}
