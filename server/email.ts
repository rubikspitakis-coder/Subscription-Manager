import sgMail from '@sendgrid/mail';
import { format } from 'date-fns';

// Initialize SendGrid with API key from environment
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('Email not configured - SENDGRID_API_KEY not set');
    return { 
      success: false, 
      error: 'Email service not configured. Please add SENDGRID_API_KEY to environment variables.' 
    };
  }

  try {
    const daysUntilRenewal = Math.ceil(
      (subscription.renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const websiteLink = subscription.officialWebsite 
      ? `<p><a href="${subscription.officialWebsite}" style="color: #0066cc;">Visit ${subscription.name} website →</a></p>`
      : '';

    // Use environment variable for from email or fallback to verified sender
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'tim@timhuggins.com.au';
    
    const msg = {
      to: toEmail,
      from: fromEmail,
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
    };

    const result = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid');
    console.log('Response:', result[0].statusCode);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    // Extract more detailed error info from SendGrid
    if (error.response) {
      console.error('SendGrid error body:', JSON.stringify(error.response.body, null, 2));
      const errorMsg = error.response.body?.errors?.[0]?.message || error.message;
      return { success: false, error: errorMsg };
    }
    
    return { success: false, error: error.message };
  }
}

export function isEmailConfigured(): boolean {
  return !!process.env.SENDGRID_API_KEY;
}
