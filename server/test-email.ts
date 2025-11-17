import { sendReminderEmail } from "./email";

// Test subscription data
const testSubscription = {
  id: 1,
  name: "ChatGPT Plus",
  cost: 20,
  billingPeriod: "monthly",
  renewalDate: new Date('2025-02-01'),
  officialWebsite: "https://openai.com",
};

async function testEmail() {
  console.log('Testing email reminder...\n');
  console.log('Sending to: tim@timhuggins.com.au');
  console.log('Subscription:', testSubscription.name);
  console.log('Renewal Date:', testSubscription.renewalDate.toDateString());
  console.log('\nAttempting to send email...\n');

  const result = await sendReminderEmail('tim@timhuggins.com.au', testSubscription);

  if (result.success) {
    console.log('✅ Email sent successfully!');
    console.log('\nCheck your inbox at tim@timhuggins.com.au');
    console.log('(Also check spam folder if you don\'t see it)');
  } else {
    console.log('❌ Failed to send email');
    console.log('Error:', result.error);
    
    if (result.error?.includes('not configured')) {
      console.log('\n📋 To enable emails, you need to:');
      console.log('1. Sign up for Resend at https://resend.com (free tier available)');
      console.log('2. Get your API key from the dashboard');
      console.log('3. Add to your .env file: RESEND_API_KEY=re_your_key_here');
      console.log('4. Restart your dev server');
    }
  }

  process.exit(result.success ? 0 : 1);
}

testEmail();
