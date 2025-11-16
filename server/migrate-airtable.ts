import { db } from "./db";
import { subscriptions } from "@shared/schema";
import { differenceInDays } from "date-fns";

const airtableData = [
  {"id":"rec056ni6mWCMymxU","createdTime":"2025-10-12T06:11:44.000Z","fields":{"Tool Name":"Google Studio"}},
  {"id":"rec3QUOStWx3g8w4k","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"n8n","Notes":"Workflow engine for AI automation, orchestrating AI, humans, code, and APIs ($240 value)","Official Website":"https://n8n.io/"}},
  {"id":"rec66PdimOBgybKi2","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Bolt","Notes":"Build stunning apps and websites by prompting ($240 value)","Official Website":"https://www.bolt.chat/"}},
  {"id":"rec6Cn6BsW7MyAvdB","createdTime":"2025-10-12T06:11:44.000Z","fields":{"Tool Name":"Devin","Official Website":"https://devin.ai/"}},
  {"id":"recA5ren7d5eAHnLE","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Lovable","Notes":"AI-powered app builder for turning ideas into production-ready apps ($252 value)","Official Website":"https://www.lovable.so/"}},
  {"id":"recCOlNNQ6HbH9VaE","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"ChatPRD","Notes":"AI for drafting product docs and automating PM work ($180 value)","Official Website":"https://www.chatprd.com/"}},
  {"id":"recGFIKSEzkcr2BF8","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Replit","Notes":"Code securely using natural language with built-in database, auth, and deployment ($240 value)","Official Website":"https://replit.com/"}},
  {"id":"recGTFA8ypDmddRyK","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Warp","Notes":"Agentic Development Environment with top coding agent ($200+ value)","Official Website":"https://www.warp.dev/"}},
  {"id":"recGqdiptGCFjZMxN","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Descript","Notes":"AI-powered video editing for polished videos without learning curve ($420 value)","Official Website":"https://www.descript.com/"}},
  {"id":"recLlnRLYU4cHsgf4","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Mobbin","Notes":"Comprehensive UI/UX design reference library ($120 value)","Official Website":"https://mobbin.com/"}},
  {"id":"recMJrHp5lou2HGRQ","createdTime":"2025-10-12T05:59:43.000Z","fields":{"Status":"Wishlist","Related Projects":["recHav3tlvCGQY2r3"],"Type":"Creative"}},
  {"id":"recRg4ljApNhSrchM","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Linear","Notes":"Tool for planning and building products, managing issues and roadmaps ($840 value)","Official Website":"https://linear.app/"}},
  {"id":"recX2PUp0AMh6WHfq","createdTime":"2025-10-12T06:11:44.000Z","fields":{"Tool Name":"Gemini"}},
  {"id":"recaxI0PPBNUhk2nU","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Gamma","Notes":"Create AI-powered presentations and websites in minutes ($180 value)","Official Website":"https://gamma.app/"}},
  {"id":"recfObYZZC4xmAhO2","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Superhuman","Notes":"AI-native email app for faster inbox management ($300 value)","Official Website":"https://superhuman.com/"}},
  {"id":"recgouoB77ZTS6eCZ","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Raycast","Notes":"Launch apps, ask AI, search anything from one place ($96 value)","Official Website":"https://www.raycast.com/"}},
  {"id":"recgyCBtNaTqLQSOt","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Granola","Notes":"AI notepad for back-to-back meetings ($5,000+ value)","Official Website":"https://www.granola.so/"}},
  {"id":"recii6W9vT8cZsMlM","createdTime":"2025-10-12T06:11:44.000Z","fields":{"Tool Name":"Notebook LM"}},
  {"id":"recnVJr3GTigbAZZM","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Devin","Notes":"Remote AI software engineer for shipping features, fixing bugs, and complex refactors ($1,350 value)"}},
  {"id":"recp7Tn92qqm0ASWw","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Magic Patterns","Notes":"AI prototyping tool for interactive designs and user feedback ($228 value)","Official Website":"https://magicpatterns.com/"}},
  {"id":"recqTGodrG0ZtFFqc","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Perplexity","Notes":"AI-powered search and research assistant with cited answers ($240 value)","Official Website":"https://www.perplexity.ai/"}},
  {"id":"recqdWn8uuiQpBy9z","createdTime":"2025-10-12T06:12:59.000Z","fields":{"Tool Name":"Wispr Flow","Notes":"Voice dictation tool for Mac, Windows, and iOS ($180 value)","Official Website":"https://wispr.ai/"}},
  {"id":"recsFeNWNpAmshb2U","createdTime":"2025-10-12T06:11:44.000Z","fields":{"Tool Name":"Cursor","Official Website":"https://cursor.com"}},
  {"id":"recvZFvLaZRroanQL","createdTime":"2025-10-12T06:17:03.000Z","fields":{"Tool Name":"Airtable","Official Website":"https://airtable.com/"}}
];

function extractCost(notes?: string): number {
  if (!notes) return 0;
  const match = notes.match(/\$(\d+(?:,\d+)?)/);
  if (match) {
    return parseInt(match[1].replace(',', ''));
  }
  return 0;
}

function getStatus(renewalDate: Date): "active" | "warning" | "urgent" | "critical" {
  const daysUntil = differenceInDays(renewalDate, new Date());
  if (daysUntil < 0) return "critical";
  if (daysUntil <= 5) return "critical";
  if (daysUntil <= 14) return "urgent";
  if (daysUntil <= 30) return "warning";
  return "active";
}

async function migrateData() {
  console.log("Starting Airtable data migration...");
  
  for (const record of airtableData) {
    const fields = record.fields;
    const toolName = fields["Tool Name"];
    
    if (!toolName) {
      console.log(`Skipping record ${record.id} - no tool name`);
      continue;
    }
    
    const cost = extractCost(fields["Notes"]);
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);
    
    try {
      await db.insert(subscriptions).values({
        name: toolName,
        cost,
        billingPeriod: "monthly",
        renewalDate,
        notes: fields["Notes"],
        category: fields["Type"],
        reminderDays: 30,
        status: getStatus(renewalDate),
      });
      
      console.log(`✓ Migrated: ${toolName}`);
    } catch (error) {
      console.error(`Error migrating ${toolName}:`, error);
    }
  }
  
  console.log("Migration complete!");
  process.exit(0);
}

migrateData();
