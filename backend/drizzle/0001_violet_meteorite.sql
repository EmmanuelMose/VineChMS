ALTER TABLE "giving" ALTER COLUMN "currency" SET DEFAULT 'KES';--> statement-breakpoint
ALTER TABLE "giving" ADD COLUMN "mpesa_checkout_request_id" varchar(255);--> statement-breakpoint
ALTER TABLE "giving" ADD COLUMN "mpesa_merchant_request_id" varchar(255);--> statement-breakpoint
ALTER TABLE "giving" ADD COLUMN "approved_by" integer;--> statement-breakpoint
ALTER TABLE "giving" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "giving" ADD CONSTRAINT "giving_approved_by_users_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;