ALTER TABLE "devices" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "mac_address" text;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "last_ping" timestamp with time zone;