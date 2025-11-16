import Airtable from "airtable";
import { differenceInDays } from "date-fns";
import type { Subscription } from "@shared/schema";

// Extract base ID from URL if needed
function extractBaseId(baseIdOrUrl: string): string {
  if (baseIdOrUrl.startsWith("http")) {
    const match = baseIdOrUrl.match(/app[a-zA-Z0-9]+/);
    return match ? match[0] : baseIdOrUrl;
  }
  return baseIdOrUrl;
}

const baseId = extractBaseId(process.env.AIRTABLE_BASE_ID || "");
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(baseId);

const tableName = process.env.AIRTABLE_TABLE_NAME || "AI Tools";

console.log(`Airtable config - Base ID: ${baseId}, Table: ${tableName}`);

function getStatus(renewalDate: Date): Subscription["status"] {
  const daysUntil = differenceInDays(renewalDate, new Date());
  if (daysUntil < 0) return "critical";
  if (daysUntil <= 5) return "critical";
  if (daysUntil <= 14) return "urgent";
  if (daysUntil <= 30) return "warning";
  return "active";
}

export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    console.log(`Fetching from Airtable table: "${tableName}"`);
    const records = await base(tableName).select().all();
    console.log(`Retrieved ${records.length} records from Airtable`);

    return records.map((record) => {
      const fields = record.fields;
      
      // Parse renewal date - using "Subscription Expiry Date" field
      const renewalDateStr = fields["Subscription Expiry Date"] as string;
      const renewalDate = renewalDateStr ? new Date(renewalDateStr) : new Date();
      
      // Parse cost - using "Subscription Cost" field
      let cost = 0;
      const costField = fields["Subscription Cost"];
      if (typeof costField === "number") {
        cost = costField;
      } else if (typeof costField === "string") {
        const parsed = parseFloat(costField.replace(/[^0-9.]/g, ""));
        cost = isNaN(parsed) ? 0 : parsed;
      }

      return {
        id: record.id,
        name: (fields["Tool Name"] as string) || "Unnamed",
        cost,
        billingPeriod: (fields["Billing Period"] as "monthly" | "yearly") || "monthly",
        renewalDate: renewalDate.toISOString(),
        username: fields["Username"] as string | undefined,
        password: fields["Password"] as string | undefined,
        reminderDays: Number(fields["Reminder Days"] || 30),
        status: getStatus(renewalDate),
        category: fields["Type"] as string | undefined,
        notes: fields["Notes"] as string | undefined,
        lastLogin: fields["Last Login"] 
          ? new Date(fields["Last Login"] as string).toISOString() 
          : undefined,
        paymentMethod: fields["Payment Method"] as string | undefined,
      };
    });
  } catch (error: any) {
    console.error("Airtable error details:", {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error,
    });
    throw error;
  }
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
