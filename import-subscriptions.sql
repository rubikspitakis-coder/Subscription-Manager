-- Manual import of subscriptions
-- Run this on your Railway PostgreSQL database

INSERT INTO subscriptions (name, notes, category, cost, billing_period, renewal_date, reminder_days) VALUES
('Devin', 'Remote AI software engineer for shipping features, fixing bugs, and complex refactors ($1,350 value)', 'AI Tools', 1350, 'monthly', '2026-01-17', 30),
('Cursor', '', 'Development', 0, 'monthly', '2026-01-17', 30),
('Gemini', '', 'AI Tools', 0, 'monthly', '2026-01-17', 30),
('Google Studio', '', 'AI Tools', 0, 'monthly', '2026-01-17', 30),
('Notebook LM', '', 'AI Tools', 0, 'monthly', '2026-01-17', 30),
('Lovable', 'AI-powered app builder for turning ideas into production-ready apps ($252 value)', 'AI Tools', 252, 'monthly', '2026-01-17', 30),
('Replit', 'Code securely using natural language with built-in database, auth, and deployment ($240 value)', 'Development', 240, 'monthly', '2026-01-17', 30),
('Bolt', 'Build stunning apps and websites by prompting ($240 value)', 'Development', 240, 'monthly', '2026-01-17', 30),
('Warp', 'Agentic Development Environment with top coding agent ($200+ value)', 'Development', 200, 'monthly', '2026-01-17', 30),
('n8n', 'Workflow engine for AI automation, orchestrating AI, humans, code, and APIs ($240 value)', 'Automation', 240, 'monthly', '2026-01-17', 30),
('Descript', 'AI-powered video editing for polished videos without learning curve ($420 value)', 'Video', 420, 'monthly', '2026-01-17', 30),
('Gamma', 'Create AI-powered presentations and websites in minutes ($180 value)', 'Productivity', 180, 'monthly', '2026-01-17', 30),
('Wispr Flow', 'Voice dictation tool for Mac, Windows, and iOS ($180 value)', 'Productivity', 180, 'monthly', '2026-01-17', 30),
('Magic Patterns', 'AI prototyping tool for interactive designs and user feedback ($228 value)', 'Design', 228, 'monthly', '2026-01-17', 30),
('Mobbin', 'Comprehensive UI/UX design reference library ($120 value)', 'Design', 120, 'monthly', '2026-01-17', 30),
('Granola', 'AI notepad for back-to-back meetings ($5,000+ value)', 'Productivity', 5000, 'monthly', '2026-01-17', 30),
('Linear', 'Tool for planning and building products, managing issues and roadmaps ($840 value)', 'Project Management', 840, 'yearly', '2026-01-17', 30),
('Superhuman', 'AI-native email app for faster inbox management ($300 value)', 'Productivity', 300, 'monthly', '2026-01-17', 30),
('Raycast', 'Launch apps, ask AI, search anything from one place ($96 value)', 'Productivity', 96, 'monthly', '2026-01-17', 30),
('Perplexity', 'AI-powered search and research assistant with cited answers ($240 value)', 'AI Tools', 240, 'monthly', '2026-01-17', 30),
('ChatPRD', 'AI for drafting product docs and automating PM work ($180 value)', 'Productivity', 180, 'monthly', '2026-01-17', 30),
('Airtable', '', 'Productivity', 0, 'monthly', '2026-01-17', 30);
