import { db } from "./db";
import { subscriptions } from "@shared/schema";
import { eq } from "drizzle-orm";

const websiteUpdates = [
  { name: 'Devin', website: 'https://devin.ai/' },
  { name: 'Cursor', website: 'https://cursor.com/' },
  { name: 'Gemini', website: 'https://gemini.google.com/' },
  { name: 'Google Studio', website: 'https://aistudio.google.com/' },
  { name: 'Notebook LM', website: 'https://notebooklm.google.com/' },
  { name: 'Lovable', website: 'https://lovable.dev/' },
  { name: 'Replit', website: 'https://replit.com/' },
  { name: 'Bolt', website: 'https://bolt.new/' },
  { name: 'Warp', website: 'https://www.warp.dev/' },
  { name: 'n8n', website: 'https://n8n.io/' },
  { name: 'Descript', website: 'https://www.descript.com/' },
  { name: 'Gamma', website: 'https://gamma.app/' },
  { name: 'Wispr Flow', website: 'https://wispr.ai/' },
  { name: 'Magic Patterns', website: 'https://magicpatterns.com/' },
  { name: 'Mobbin', website: 'https://mobbin.com/' },
  { name: 'Granola', website: 'https://www.granola.so/' },
  { name: 'Linear', website: 'https://linear.app/' },
  { name: 'Superhuman', website: 'https://superhuman.com/' },
  { name: 'Raycast', website: 'https://www.raycast.com/' },
  { name: 'Perplexity', website: 'https://www.perplexity.ai/' },
  { name: 'ChatPRD', website: 'https://www.chatprd.ai/' },
  { name: 'Airtable', website: 'https://www.airtable.com/' },
];

async function updateWebsites() {
  try {
    console.log('Starting website updates...\n');
    
    for (const update of websiteUpdates) {
      // Find the subscription by name
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.name, update.name))
        .limit(1);
      
      if (subscription) {
        // Update the website
        await db
          .update(subscriptions)
          .set({ officialWebsite: update.website })
          .where(eq(subscriptions.id, subscription.id));
        
        console.log(`✓ Updated ${update.name}: ${update.website}`);
      } else {
        console.log(`⚠ Not found: ${update.name}`);
      }
    }
    
    console.log('\n✅ Website updates complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating websites:', error);
    process.exit(1);
  }
}

updateWebsites();
