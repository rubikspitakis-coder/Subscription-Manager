import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, db, eq } from "./storage";
import { updateReminderDaysSchema, insertSubscriptionSchema, loginSchema, users } from "@shared/schema";
import bcrypt from "bcryptjs";
import { requireAuth } from "./auth";
import passport from "passport";
import multer from "multer";
import * as XLSX from "xlsx";

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({ id: user.id, username: user.username });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      res.json({ id: user.id, username: user.username });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user as any;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Get user from database
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (!dbUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, dbUser.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, user.id));

      res.json({ success: true, message: "Password updated successfully" });
    } catch (error: any) {
      console.error("Error changing password:", error);
      res.status(500).json({ 
        error: "Failed to change password",
        message: error.message 
      });
    }
  });

  // Protected subscription routes
  app.get("/api/subscriptions", requireAuth, async (req, res) => {
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

  app.get("/api/subscriptions/:id", requireAuth, async (req, res) => {
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

  app.post("/api/subscriptions", requireAuth, async (req, res) => {
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

  app.patch("/api/subscriptions/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertSubscriptionSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request body", details: result.error });
      }

      const subscription = await storage.updateSubscription(id, result.data);
      
      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      
      res.json(subscription);
    } catch (error: any) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ 
        error: "Failed to update subscription",
        message: error.message 
      });
    }
  });

  app.delete("/api/subscriptions/:id", requireAuth, async (req, res) => {
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

  app.patch("/api/subscriptions/:id/reminder-days", requireAuth, async (req, res) => {
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

  app.post("/api/subscriptions/:id/send-reminder", requireAuth, async (req, res) => {
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

  app.post("/api/subscriptions/import", requireAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log('Processing import file:', req.file.originalname, 'Size:', req.file.size);

      // Parse the Excel file
      let workbook, data;
      try {
        workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          return res.status(400).json({ 
            error: "Invalid Excel file",
            message: "The file does not contain any worksheets" 
          });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);

        if (!data || data.length === 0) {
          return res.status(400).json({ 
            error: "Empty file",
            message: "The Excel file does not contain any data rows" 
          });
        }

        console.log('Parsed', data.length, 'rows from Excel');
        console.log('First row columns:', Object.keys(data[0]));
      } catch (parseError: any) {
        console.error('Error parsing Excel file:', parseError);
        return res.status(400).json({ 
          error: "Failed to parse Excel file",
          message: "The file may be corrupted or not a valid Excel file. " + parseError.message
        });
      }

      const results = {
        success: 0,
        failed: 0,
        errors: [] as string[],
      };

      // Process each row
      for (let i = 0; i < data.length; i++) {
        const row = data[i] as any;
        try {
          // Skip completely empty rows
          const hasAnyData = Object.values(row).some(val => val !== null && val !== undefined && val !== '');
          if (!hasAnyData) {
            continue;
          }

          // Map Excel columns to subscription fields
          // Support both custom columns and standard columns
          const subscriptionData: any = {
            name: row['Tool Name'] || row.name || row.Name,
            renewalDate: row['Subscription Expiry Date'] || row.renewalDate || row.RenewalDate || row.renewal_date,
          };

          // Validate required fields first
          if (!subscriptionData.name || subscriptionData.name.toString().trim() === '') {
            results.failed++;
            results.errors.push(`Row ${i + 2}: Missing required field 'Tool Name'`);
            continue;
          }

          if (!subscriptionData.renewalDate) {
            results.failed++;
            results.errors.push(`Row ${i + 2}: Missing required field 'Subscription Expiry Date'`);
            continue;
          }

          // Parse the date if it's a string or Excel serial number
          try {
            if (typeof subscriptionData.renewalDate === 'number') {
              // Excel date serial number
              const date = XLSX.SSF.parse_date_code(subscriptionData.renewalDate);
              subscriptionData.renewalDate = new Date(date.y, date.m - 1, date.d);
            } else if (typeof subscriptionData.renewalDate === 'string') {
              subscriptionData.renewalDate = new Date(subscriptionData.renewalDate);
            }

            // Check if date is valid
            if (isNaN(subscriptionData.renewalDate.getTime())) {
              results.failed++;
              results.errors.push(`Row ${i + 2}: Invalid date format in 'Subscription Expiry Date'`);
              continue;
            }
          } catch (dateError: any) {
            results.failed++;
            results.errors.push(`Row ${i + 2}: Invalid date format - ${dateError.message}`);
            continue;
          }

          // Add optional fields only if they have values
          const costValue = row['Subscription Cost'] || row.cost || row.Cost;
          if (costValue !== null && costValue !== undefined && costValue !== '') {
            subscriptionData.cost = parseFloat(costValue);
            if (isNaN(subscriptionData.cost)) {
              subscriptionData.cost = 0;
            }
          } else {
            subscriptionData.cost = 0;
          }

          const billingPeriodValue = row.billingPeriod || row.BillingPeriod || row.billing_period || 'monthly';
          subscriptionData.billingPeriod = billingPeriodValue.toString().toLowerCase();
          if (!['monthly', 'yearly'].includes(subscriptionData.billingPeriod)) {
            subscriptionData.billingPeriod = 'monthly';
          }

          // Optional fields
          if (row.username || row.Username) {
            subscriptionData.username = row.username || row.Username;
          }
          if (row.password || row.Password) {
            subscriptionData.password = row.password || row.Password;
          }
          if (row.Type || row.category || row.Category) {
            subscriptionData.category = row.Type || row.category || row.Category;
          }
          if (row.paymentMethod || row.PaymentMethod || row.payment_method) {
            subscriptionData.paymentMethod = row.paymentMethod || row.PaymentMethod || row.payment_method;
          }

          // Build notes from multiple fields
          const notesArray = [
            row.Notes,
            row["Pro's"] ? `Pros: ${row["Pro's"]}` : null,
            row["Con's"] ? `Cons: ${row["Con's"]}` : null,
            row["How I'm Using It"] ? `Usage: ${row["How I'm Using It"]}` : null,
            row['Related Projects'] ? `Projects: ${row['Related Projects']}` : null,
            row['Official Website'] ? `Website: ${row['Official Website']}` : null,
            row['Recommendation Score'] ? `Score: ${row['Recommendation Score']}` : null,
            row['Status'] ? `Status: ${row['Status']}` : null,
          ].filter(val => val !== null && val !== undefined && val !== '');

          if (notesArray.length > 0) {
            subscriptionData.notes = notesArray.join('\n\n');
          }

          const reminderDaysValue = row.reminderDays || row.ReminderDays || row.reminder_days || 30;
          subscriptionData.reminderDays = parseInt(reminderDaysValue.toString());
          if (isNaN(subscriptionData.reminderDays) || subscriptionData.reminderDays < 1) {
            subscriptionData.reminderDays = 30;
          }

          // Validate the subscription data with schema
          const result = insertSubscriptionSchema.safeParse(subscriptionData);
          if (!result.success) {
            results.failed++;
            const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            results.errors.push(`Row ${i + 2}: ${errorMessages}`);
            console.log(`Row ${i + 2} validation failed:`, errorMessages);
            continue;
          }

          // Create the subscription
          await storage.createSubscription(result.data);
          results.success++;
          console.log(`Row ${i + 2}: Successfully imported '${subscriptionData.name}'`);
        } catch (error: any) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: ${error.message}`);
        }
      }

      console.log('Import completed:', results.success, 'successful,', results.failed, 'failed');
      res.json(results);
    } catch (error: any) {
      console.error("Error importing subscriptions:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ 
        error: "Failed to import subscriptions",
        message: error.message,
        details: error.stack 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
