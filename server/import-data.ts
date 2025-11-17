import { db } from "./db";
import { subscriptions } from "@shared/schema";

const subscriptionsData = [
  { name: 'Devin', notes: 'Remote AI software engineer for shipping features, fixing bugs, and complex refactors ($1,350 value)', category: 'AI Tools', cost: 1350, renewalDate: new Date('2026-01-17') },
  { name: 'Cursor', notes: '', category: 'Development', cost: 0, renewalDate: new Date('2026-01-17') },
  { name: 'Gemini', notes: '', category: 'AI Tools', cost: 0, renewalDate: new Date('2026-01-17') },
  { name: 'Google Studio', notes: '', category: 'AI Tools', cost: 0, renewalDate: new Date('2026-01-17') },
  { name: 'Notebook LM', notes: '', category: 'AI Tools', cost: 0, renewalDate: new Date('2026-01-17') },
  { name: 'Lovable', notes: 'AI-powered app builder for turning ideas into production-ready apps ($252 value)', category: 'AI Tools', cost: 252, renewalDate: new Date('2026-01-17') },
  { name: 'Replit', notes: 'Code securely using natural language with built-in database, auth, and deployment ($240 value)', category: 'Development', cost: 240, renewalDate: new Date('2026-01-17') },
  { name: 'Bolt', notes: 'Build stunning apps and websites by prompting ($240 value)', category: 'Development', cost: 240, renewalDate: new Date('2026-01-17') },
  { name: 'Warp', notes: 'Agentic Development Environment with top coding agent ($200+ value)', category: 'Development', cost: 200, renewalDate: new Date('2026-01-17') },
  { name: 'n8n', notes: 'Workflow engine for AI automation, orchestrating AI, humans, code, and APIs ($240 value)', category: 'Automation', cost: 240, renewalDate: new Date('2026-01-17') },
  { name: 'Descript', notes: 'AI-powered video editing for polished videos without learning curve ($420 value)', category: 'Video', cost: 420, renewalDate: new Date('2026-01-17') },
  { name: 'Gamma', notes: 'Create AI-powered presentations and websites in minutes ($180 value)', category: 'Productivity', cost: 180, renewalDate: new Date('2026-01-17') },
  { name: 'Wispr Flow', notes: 'Voice dictation tool for Mac, Windows, and iOS ($180 value)', category: 'Productivity', cost: 180, renewalDate: new Date('2026-01-17') },
  { name: 'Magic Patterns', notes: 'AI prototyping tool for interactive designs and user feedback ($228 value)', category: 'Design', cost: 228, renewalDate: new Date('2026-01-17') },
  { name: 'Mobbin', notes: 'Comprehensive UI/UX design reference library ($120 value)', category: 'Design', cost: 120, renewalDate: new Date('2026-01-17') },
  { name: 'Granola', notes: 'AI notepad for back-to-back meetings ($5,000+ value)', category: 'Productivity', cost: 5000, renewalDate: new Date('2026-01-17') },
  { name: 'Linear', notes: 'Tool for planning and building products, managing issues and roadmaps ($840 value)', category: 'Project Management', cost: 840, renewalDate: new Date('2026-01-17') },
  { name: 'Superhuman', notes: 'AI-native email app for faster inbox management ($300 value)', category: 'Productivity', cost: 300, renewalDate: new Date('2026-01-17') },
  { name: 'Raycast', notes: 'Launch apps, ask AI, search anything from one place ($96 value)', category: 'Productivity', cost: 96, renewalDate: new Date('2026-01-17') },
  { name: 'Perplexity', notes: 'AI-powered search and research assistant with cited answers ($240 value)', category: 'AI Tools', cost: 240, renewalDate: new Date('2026-01-17') },
  { name: 'ChatPRD', notes: 'AI for drafting product docs and automating PM work ($180 value)', category: 'Productivity', cost: 180, renewalDate: new Date('2026-01-17') },
  { name: 'Airtable', notes: '', category: 'Productivity', cost: 0, renewalDate: new Date('2026-01-17') },
];

async function importSubscriptions() {
  try {
    console.log('Starting import...');
    
    for (const sub of subscriptionsData) {
      await db.insert(subscriptions).values({
        ...sub,
        billingPeriod: 'monthly',
        reminderDays: 30,
      });
      console.log(`✓ Imported: ${sub.name}`);
    }
    
    console.log('\n✅ Import complete! All subscriptions imported successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing subscriptions:', error);
    process.exit(1);
  }
}

importSubscriptions();
