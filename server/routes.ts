import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateReminderDaysSchema, insertSubscriptionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const subscriptions = await storage.getSubscriptions();
      res.json(subscriptions);
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ 
        error: "Failed to fetch subscriptions",
        message: error.message 
      });
    }
  });

  app.get("/api/subscriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subscription = await storage.getSubscription(id);
      
      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      
      res.json(subscription);
    } catch (error: any) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ 
        error: "Failed to fetch subscription",
        message: error.message 
      });
    }
  });

  app.post("/api/subscriptions", async (req, res) => {
    try {
      const result = insertSubscriptionSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request body", details: result.error });
      }

      const subscription = await storage.createSubscription(result.data);
      res.status(201).json(subscription);
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ 
        error: "Failed to create subscription",
        message: error.message 
      });
    }
  });

  app.patch("/api/subscriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertSubscriptionSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request body", details: result.error });
      }

      const subscription = await storage.updateSubscription(id, result.data);
      res.json(subscription);
    } catch (error: any) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ 
        error: "Failed to update subscription",
        message: error.message 
      });
    }
  });

  app.delete("/api/subscriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSubscription(id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting subscription:", error);
      res.status(500).json({ 
        error: "Failed to delete subscription",
        message: error.message 
      });
    }
  });

  app.patch("/api/subscriptions/:id/reminder-days", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = updateReminderDaysSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request body", details: result.error });
      }

      await storage.updateReminderDays(id, result.data.reminderDays);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error updating reminder days:", error);
      res.status(500).json({ 
        error: "Failed to update reminder days",
        message: error.message 
      });
    }
  });

  app.post("/api/subscriptions/:id/send-reminder", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Sending reminder for subscription ${id}`);
      res.json({ success: true, message: "Reminder sent" });
    } catch (error: any) {
      console.error("Error sending reminder:", error);
      res.status(500).json({ 
        error: "Failed to send reminder",
        message: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
