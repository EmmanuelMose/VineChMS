ALTER TABLE "expenses" ALTER COLUMN "currency" SET DEFAULT 'KES';--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "member_id" integer;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "payment_method" varchar(50);--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "mpesa_checkout_request_id" varchar(255);--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "mpesa_merchant_request_id" varchar(255);--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "expense_member_idx" ON "expenses" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "expense_mpesa_checkout_idx" ON "expenses" USING btree ("mpesa_checkout_request_id");