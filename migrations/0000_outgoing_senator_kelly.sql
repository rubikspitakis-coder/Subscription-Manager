CREATE TYPE "public"."billing_period" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'warning', 'urgent', 'critical');--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cost" real DEFAULT 0 NOT NULL,
	"billing_period" "billing_period" DEFAULT 'monthly' NOT NULL,
	"renewal_date" timestamp NOT NULL,
	"username" text,
	"password" text,
	"reminder_days" integer DEFAULT 30,
	"status" "status" DEFAULT 'active' NOT NULL,
	"category" text,
	"notes" text,
	"last_login" timestamp,
	"payment_method" text,
	"pros" text,
	"cons" text,
	"usage_description" text,
	"related_projects" text,
	"official_website" text,
	"recommendation_score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
