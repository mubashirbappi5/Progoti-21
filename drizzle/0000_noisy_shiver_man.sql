CREATE TABLE "reunion_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"mobile_number" varchar(32) NOT NULL,
	"preferred_date" varchar(100) NOT NULL,
	"custom_date" date,
	"preferred_food" varchar(100) NOT NULL,
	"custom_food" text,
	"meal_schedule" varchar(100) NOT NULL,
	"preferred_gift" varchar(100) NOT NULL,
	"custom_gift" text,
	"preferred_activities" jsonb NOT NULL,
	"activities_to_avoid" jsonb NOT NULL,
	"additional_suggestions" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reunion_submissions_mobile_number_unique" UNIQUE("mobile_number")
);
