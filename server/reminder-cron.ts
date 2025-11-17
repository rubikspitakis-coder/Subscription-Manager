import cron from 'node-cron';
import { storage } from './storage';
import { sendReminderEmail, isEmailConfigured } from './email';
import { differenceInDays } from 'date-fns';

// Email address to send reminders to
const REMINDER_EMAIL = 'tim@timhuggins.com.au';

export function startReminderCron() {
  // Check if email is configured
  if (!isEmailConfigured()) {
    console.log('⚠️  Email reminders disabled - SENDGRID_API_KEY not configured');
    return;
  }

  console.log('✅ Starting automatic email reminder cron job...');
  
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('🔔 Running daily subscription reminder check...');
    
    try {
      // Get all subscriptions
      const subscriptions = await storage.getSubscriptions();
      
      let emailsSent = 0;
      let errors = 0;
      
      for (const subscription of subscriptions) {
        try {
          const daysUntilRenewal = differenceInDays(subscription.renewalDate, new Date());
          
          // Send reminder if within the reminderDays threshold (or default 5 days)
          const reminderThreshold = subscription.reminderDays || 5;
          
          if (daysUntilRenewal <= reminderThreshold && daysUntilRenewal >= 0) {
            // Check if reminder needs to be sent
            const shouldSendReminder = (
              // Never sent before
              !subscription.lastReminderSent ||
              // Sent but not acknowledged, and it's been 5+ days
              (!subscription.reminderAcknowledged && 
               differenceInDays(new Date(), subscription.lastReminderSent) >= 5) ||
              // Acknowledged, but renewal date passed the acknowledgment (reset for next cycle)
              (subscription.reminderAcknowledged && 
               subscription.renewalDate > subscription.reminderAcknowledged)
            );
            
            if (shouldSendReminder) {
              console.log(`  📧 Sending reminder for ${subscription.name} (${daysUntilRenewal} days until renewal)`);
              
              const result = await sendReminderEmail(REMINDER_EMAIL, subscription);
              
              if (result.success) {
                // Update last reminder sent timestamp
                await storage.updateLastReminderSent(subscription.id);
                emailsSent++;
              } else {
                console.error(`  ❌ Failed to send reminder for ${subscription.name}: ${result.error}`);
                errors++;
              }
            } else {
              console.log(`  ⏭️  Skipping ${subscription.name} - reminder already acknowledged or sent recently`);
            }
          }
        } catch (error: any) {
          console.error(`  ❌ Error processing ${subscription.name}:`, error.message);
          errors++;
        }
      }
      
      console.log(`✅ Reminder check complete: ${emailsSent} emails sent, ${errors} errors`);
    } catch (error: any) {
      console.error('❌ Error in reminder cron job:', error.message);
    }
  });
  
  console.log('✅ Reminder cron job scheduled (daily at 9:00 AM)');
}
