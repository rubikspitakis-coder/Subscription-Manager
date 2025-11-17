import { Resend } from 'resend';
import { format } from 'date-fns';

// Initialize Resend with API key from environment
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface Subscription {
  id: number;
  name: string;
  cost: number;
  billingPeriod: string;
  renewalDate: Date;
  officialWebsite?: string;
}

export async function sendReminderEmail(
  toEmail: string,
  subscription: Subscription
): Promise<{ success: boolean; error?: string }> {
  // Check if email is configured
  if (!resend) {
    console.warn('Email not configured - RESEND_API_KEY not set');
    return { 
      success: false, 
      error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.' 
    };
  }

  try {
    const daysUntilRenewal = Math.ceil(
      (subscription.renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const websiteLink = subscription.officialWebsite 
      ? `<p><a href="${subscription.officialWebsite}" style="color: #0066cc;">Visit ${subscription.name} website →</a></p>`
      : '';

    const { data, error } = await resend.emails.send({
      from: 'Subscription Tracker <onboarding@resend.dev>', // You'll need to verify your domain for production
      to: [toEmail],
      subject: `⏰ Reminder: ${subscription.name} renewal in ${daysUntilRenewal} days`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Subscription Renewal Reminder</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Subscription Renewal Reminder</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
              <h2 style="color: #667eea; margin-top: 0;">${subscription.name}</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <p style="margin: 10px 0;"><strong>Renewal Date:</strong> ${format(subscription.renewalDate, 'MMMM d, yyyy')}</p>
                <p style="margin: 10px 0;"><strong>Days Until Renewal:</strong> ${daysUntilRenewal} days</p>
                <p style="margin: 10px 0;"><strong>Cost:</strong> $${subscription.cost}/${subscription.billingPeriod === 'yearly' ? 'year' : 'month'}</p>
              </div>

              ${websiteLink}

              <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                This is an automated reminder from your AI Subscription Manager. 
                <br>
                Manage your subscriptions at your dashboard.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
