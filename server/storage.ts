import { subscriptions, type Subscription, type InsertSubscription } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { differenceInDays } from "date-fns";

export interface IStorage {
  getSubscriptions(): Promise<Subscription[]>;
  getSubscription(id: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateReminderDays(id: number, reminderDays: number): Promise<void>;
  updateSubscription(id: number, data: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  deleteSubscription(id: number): Promise<void>;
}

function getStatus(renewalDate: Date): Subscription["status"] {
  const daysUntil = differenceInDays(renewalDate, new Date());
  if (daysUntil < 0) return "critical";
  if (daysUntil <= 5) return "critical";
  if (daysUntil <= 14) return "urgent";
  if (daysUntil <= 30) return "warning";
  return "active";
}

export class DatabaseStorage implements IStorage {
  async getSubscriptions(): Promise<Subscription[]> {
    const results = await db.select().from(subscriptions);
    
    return results.map(sub => ({
      ...sub,
      status: getStatus(sub.renewalDate),
    }));
  }

  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    if (!subscription) return undefined;
    
    return {
      ...subscription,
      status: getStatus(subscription.renewalDate),
    };
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const status = getStatus(new Date(insertSubscription.renewalDate));
    
    const [subscription] = await db
      .insert(subscriptions)
      .values({
        ...insertSubscription,
        status,
      })
      .returning();
    
    return {
      ...subscription,
      status: getStatus(subscription.renewalDate),
    };
  }

  async updateReminderDays(id: number, reminderDays: number): Promise<void> {
    await db
      .update(subscriptions)
      .set({ reminderDays })
      .where(eq(subscriptions.id, id));
  }

  async updateSubscription(id: number, data: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const status = data.renewalDate ? getStatus(new Date(data.renewalDate)) : undefined;
    
    const [subscription] = await db
      .update(subscriptions)
      .set({
        ...data,
        ...(status && { status }),
      })
      .where(eq(subscriptions.id, id))
      .returning();
    
    if (!subscription) {
      return undefined;
    }
    
    return {
      ...subscription,
      status: getStatus(subscription.renewalDate),
    };
  }

  async deleteSubscription(id: number): Promise<void> {
    await db.delete(subscriptions).where(eq(subscriptions.id, id));
  }
}

export const storage = new DatabaseStorage();
