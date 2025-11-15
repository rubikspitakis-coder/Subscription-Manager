import type { Express } from "express";
import { createServer, type Server } from "http";
import { getSubscriptions, updateReminderDays } from "./airtable";
import { updateReminderDaysSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const subscriptions = await getSubscriptions();
      res.json(subscriptions);
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ 
        error: "Failed to fetch subscriptions",
        message: error.message 
      });
    }
  });

  app.patch("/api/subscriptions/:id/reminder-days", async (req, res) => {
    try {
      const { id } = req.params;
      const result = updateReminderDaysSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request body", details: result.error });
      }

      await updateReminderDays(id, result.data.reminderDays);
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
