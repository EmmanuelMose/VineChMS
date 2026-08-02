CREATE TYPE "public"."announcement_image_position" AS ENUM('top', 'bottom', 'left', 'right', 'cover');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."attendance_type" AS ENUM('in_person', 'online', 'both');--> statement-breakpoint
CREATE TYPE "public"."document_visibility" AS ENUM('public', 'members_only', 'leadership_only', 'private');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."expense_status" AS ENUM('pending', 'approved', 'rejected', 'paid');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."giving_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."giving_type" AS ENUM('tithe', 'offering', 'pledge', 'donation', 'special');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'expired');--> statement-breakpoint
CREATE TYPE "public"."marital_status" AS ENUM('single', 'married', 'divorced', 'widowed');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('info', 'warning', 'success', 'error');--> statement-breakpoint
CREATE TYPE "public"."prayer_request_status" AS ENUM('pending', 'praying', 'answered', 'closed');--> statement-breakpoint
CREATE TYPE "public"."prayer_request_visibility" AS ENUM('public', 'private', 'confidential');--> statement-breakpoint
CREATE TYPE "public"."subscription_plan" AS ENUM('starter', 'growth', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'inactive', 'trial', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'large_org_admin', 'large_org_member', 'small_org_admin', 'small_org_member', 'church_admin', 'church_member', 'pastor', 'elder', 'treasurer', 'secretary');--> statement-breakpoint
CREATE TABLE "announcements" (
	"announcement_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"image_url" varchar(500),
	"image_public_id" varchar(255),
	"image_position" "announcement_image_position" DEFAULT 'top',
	"is_published" boolean DEFAULT false,
	"published_at" timestamp,
	"expires_at" timestamp,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"attendance_id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"service_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"attended" boolean DEFAULT true,
	"check_in_time" timestamp,
	"check_out_time" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_attendance" UNIQUE("member_id","service_id","date")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"audit_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" varchar(50) NOT NULL,
	"entity" varchar(50) NOT NULL,
	"entity_id" integer,
	"changes" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budgets" (
	"budget_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"year" integer NOT NULL,
	"month" integer,
	"is_annual" boolean DEFAULT false,
	"attachment" varchar(500),
	"attachment_public_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "churches" (
	"church_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"logo" varchar(500),
	"logo_public_id" varchar(255),
	"website" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"address" text,
	"country" varchar(100),
	"city" varchar(100),
	"state" varchar(100),
	"postal_code" varchar(20),
	"denomination" varchar(100),
	"founded_date" timestamp,
	"organization_id" integer NOT NULL,
	"max_members" integer DEFAULT 200,
	"created_by" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"document_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"file_name" varchar(255) NOT NULL,
	"file_url" varchar(500) NOT NULL,
	"file_public_id" varchar(255),
	"file_size" integer,
	"file_type" varchar(100),
	"document_type" varchar(50),
	"visibility" "document_visibility" DEFAULT 'members_only',
	"thumbnail" varchar(500),
	"thumbnail_public_id" varchar(255),
	"uploaded_by" integer,
	"version" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"registration_id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"attended" boolean DEFAULT false,
	"notes" text,
	"registration_image" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_event_registration" UNIQUE("event_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"location" varchar(255),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" "event_status" DEFAULT 'draft',
	"is_public" boolean DEFAULT true,
	"max_attendees" integer,
	"image_url" varchar(500),
	"image_public_id" varchar(255),
	"cover_image_url" varchar(500),
	"cover_image_public_id" varchar(255),
	"gallery" jsonb,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"image" varchar(500),
	"image_public_id" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"expense_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"category_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"description" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"status" "expense_status" DEFAULT 'pending',
	"approved_by" integer,
	"approved_at" timestamp,
	"receipt_url" varchar(500),
	"receipt_public_id" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_members" (
	"family_member_id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"relationship" varchar(50) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"date_of_birth" timestamp,
	"profile_picture" varchar(500),
	"is_member" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "giving" (
	"giving_id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"church_id" integer NOT NULL,
	"category_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"type" "giving_type" NOT NULL,
	"status" "giving_status" DEFAULT 'pending',
	"date" timestamp DEFAULT now() NOT NULL,
	"payment_method" varchar(50),
	"transaction_id" varchar(255),
	"notes" text,
	"is_anonymous" boolean DEFAULT false,
	"receipt_number" varchar(50),
	"receipt_file" varchar(500),
	"receipt_file_public_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "giving_categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"image" varchar(500),
	"image_public_id" varchar(255),
	"type" "giving_type" NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_members" (
	"group_member_id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true,
	"role" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_group_member" UNIQUE("group_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"group_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"type" varchar(50),
	"leader_id" integer,
	"meeting_day" integer,
	"meeting_time" timestamp,
	"location" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"invitation_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"status" "invitation_status" DEFAULT 'pending',
	"invited_by" integer,
	"large_organization_id" integer,
	"organization_id" integer,
	"church_id" integer,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "large_organizations" (
	"large_organization_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"logo" varchar(500),
	"logo_public_id" varchar(255),
	"website" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"address" text,
	"country" varchar(100),
	"city" varchar(100),
	"state" varchar(100),
	"postal_code" varchar(20),
	"subscription_plan" "subscription_plan" DEFAULT 'starter',
	"subscription_status" "subscription_status" DEFAULT 'trial',
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"max_organizations" integer DEFAULT 10,
	"max_churches" integer DEFAULT 50,
	"max_members" integer DEFAULT 1000,
	"created_by" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaders" (
	"leader_id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"position_id" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"is_active" boolean DEFAULT true,
	"is_approved" boolean DEFAULT false,
	"approved_by" integer,
	"approved_at" timestamp,
	"notes" text,
	"profile_picture" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"member_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"church_id" integer NOT NULL,
	"membership_number" varchar(50),
	"membership_date" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"is_baptized" boolean DEFAULT false,
	"baptism_date" timestamp,
	"is_confirmed" boolean DEFAULT false,
	"confirmation_date" timestamp,
	"is_leader" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "members_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "members_membership_number_unique" UNIQUE("membership_number")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"notification_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" DEFAULT 'info',
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"link" varchar(255),
	"notification_image" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"organization_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"logo" varchar(500),
	"logo_public_id" varchar(255),
	"website" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"address" text,
	"country" varchar(100),
	"city" varchar(100),
	"state" varchar(100),
	"postal_code" varchar(20),
	"large_organization_id" integer NOT NULL,
	"max_churches" integer DEFAULT 20,
	"max_members" integer DEFAULT 500,
	"created_by" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pledges" (
	"pledge_id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"church_id" integer NOT NULL,
	"category_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"frequency" varchar(20) DEFAULT 'monthly',
	"is_fulfilled" boolean DEFAULT false,
	"fulfilled_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"position_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"church_id" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prayer_interactions" (
	"interaction_id" serial PRIMARY KEY NOT NULL,
	"prayer_request_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"type" varchar(20) DEFAULT 'prayed',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_prayer_interaction" UNIQUE("prayer_request_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "prayer_requests" (
	"prayer_request_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"image" varchar(500),
	"image_public_id" varchar(255),
	"status" "prayer_request_status" DEFAULT 'pending',
	"visibility" "prayer_request_visibility" DEFAULT 'public',
	"answered_at" timestamp,
	"answer_description" text,
	"prayer_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sermons" (
	"sermon_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"speaker" varchar(100) NOT NULL,
	"topic" varchar(100),
	"scripture" varchar(255),
	"description" text,
	"video_url" varchar(500),
	"video_public_id" varchar(255),
	"audio_url" varchar(500),
	"audio_public_id" varchar(255),
	"notes" text,
	"preached_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"service_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"day_of_week" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"service_type" varchar(50) DEFAULT 'regular',
	"attendance_type" "attendance_type" DEFAULT 'in_person',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unregistered_users" (
	"unregistered_user_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"role" "user_role" NOT NULL,
	"invitation_token" varchar(255) NOT NULL,
	"token_expires_at" timestamp NOT NULL,
	"invited_by_id" integer,
	"organization_id" integer,
	"church_id" integer,
	"large_organization_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unregistered_users_email_unique" UNIQUE("email"),
	CONSTRAINT "unregistered_users_invitation_token_unique" UNIQUE("invitation_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"profile_picture" varchar(500),
	"profile_picture_public_id" varchar(255),
	"gender" "gender",
	"date_of_birth" timestamp,
	"marital_status" "marital_status",
	"occupation" varchar(100),
	"address" text,
	"role" "user_role" NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"verification_code" varchar(10),
	"last_login_at" timestamp,
	"organization_id" integer,
	"church_id" integer,
	"large_organization_id" integer,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "visitors" (
	"visitor_id" serial PRIMARY KEY NOT NULL,
	"church_id" integer NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"address" text,
	"profile_picture" varchar(500),
	"visited_date" timestamp DEFAULT now(),
	"service_id" integer,
	"is_member" boolean DEFAULT false,
	"member_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_service_id_services_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("service_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "churches" ADD CONSTRAINT "churches_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("organization_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "churches" ADD CONSTRAINT "churches_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_users_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_expense_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."expense_categories"("category_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_approved_by_users_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giving" ADD CONSTRAINT "giving_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giving" ADD CONSTRAINT "giving_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giving" ADD CONSTRAINT "giving_category_id_giving_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."giving_categories"("category_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giving_categories" ADD CONSTRAINT "giving_categories_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_leader_id_members_member_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."members"("member_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_large_organization_id_large_organizations_large_organization_id_fk" FOREIGN KEY ("large_organization_id") REFERENCES "public"."large_organizations"("large_organization_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("organization_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "large_organizations" ADD CONSTRAINT "large_organizations_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaders" ADD CONSTRAINT "leaders_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaders" ADD CONSTRAINT "leaders_position_id_positions_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("position_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaders" ADD CONSTRAINT "leaders_approved_by_users_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_large_organization_id_large_organizations_large_organization_id_fk" FOREIGN KEY ("large_organization_id") REFERENCES "public"."large_organizations"("large_organization_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_category_id_giving_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."giving_categories"("category_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayer_interactions" ADD CONSTRAINT "prayer_interactions_prayer_request_id_prayer_requests_prayer_request_id_fk" FOREIGN KEY ("prayer_request_id") REFERENCES "public"."prayer_requests"("prayer_request_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayer_interactions" ADD CONSTRAINT "prayer_interactions_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayer_requests" ADD CONSTRAINT "prayer_requests_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayer_requests" ADD CONSTRAINT "prayer_requests_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sermons" ADD CONSTRAINT "sermons_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unregistered_users" ADD CONSTRAINT "unregistered_users_invited_by_id_users_user_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_service_id_services_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("service_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "announcement_church_idx" ON "announcements" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "announcement_published_idx" ON "announcements" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "attendance_member_idx" ON "attendance" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "attendance_service_idx" ON "attendance" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "attendance_date_idx" ON "attendance" USING btree ("date");--> statement-breakpoint
CREATE INDEX "audit_user_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "audit_logs" USING btree ("entity");--> statement-breakpoint
CREATE INDEX "audit_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "budget_church_idx" ON "budgets" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "budget_year_idx" ON "budgets" USING btree ("year");--> statement-breakpoint
CREATE INDEX "church_name_idx" ON "churches" USING btree ("name");--> statement-breakpoint
CREATE INDEX "church_org_idx" ON "churches" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "document_church_idx" ON "documents" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "document_type_idx" ON "documents" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX "event_reg_event_idx" ON "event_registrations" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_reg_member_idx" ON "event_registrations" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "event_church_idx" ON "events" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "event_date_idx" ON "events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "expense_category_church_idx" ON "expense_categories" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "expense_church_idx" ON "expenses" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "expense_date_idx" ON "expenses" USING btree ("date");--> statement-breakpoint
CREATE INDEX "family_member_idx" ON "family_members" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "giving_member_idx" ON "giving" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "giving_church_idx" ON "giving" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "giving_date_idx" ON "giving" USING btree ("date");--> statement-breakpoint
CREATE INDEX "giving_category_church_idx" ON "giving_categories" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "group_member_group_idx" ON "group_members" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "group_member_member_idx" ON "group_members" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "group_church_idx" ON "groups" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "invitation_token_idx" ON "invitations" USING btree ("token");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "invitation_status_idx" ON "invitations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "large_org_name_idx" ON "large_organizations" USING btree ("name");--> statement-breakpoint
CREATE INDEX "large_org_email_idx" ON "large_organizations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leader_member_idx" ON "leaders" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "leader_position_idx" ON "leaders" USING btree ("position_id");--> statement-breakpoint
CREATE INDEX "member_user_idx" ON "members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_church_idx" ON "members" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "member_number_idx" ON "members" USING btree ("membership_number");--> statement-breakpoint
CREATE INDEX "notification_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_read_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "notification_created_idx" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "org_name_idx" ON "organizations" USING btree ("name");--> statement-breakpoint
CREATE INDEX "org_large_org_idx" ON "organizations" USING btree ("large_organization_id");--> statement-breakpoint
CREATE INDEX "pledge_member_idx" ON "pledges" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "pledge_church_idx" ON "pledges" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "position_church_idx" ON "positions" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "prayer_interaction_prayer_idx" ON "prayer_interactions" USING btree ("prayer_request_id");--> statement-breakpoint
CREATE INDEX "prayer_interaction_member_idx" ON "prayer_interactions" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "prayer_church_idx" ON "prayer_requests" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "prayer_member_idx" ON "prayer_requests" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "prayer_status_idx" ON "prayer_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sermon_church_idx" ON "sermons" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "sermon_date_idx" ON "sermons" USING btree ("preached_at");--> statement-breakpoint
CREATE INDEX "service_church_idx" ON "services" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "unregistered_email_idx" ON "unregistered_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "unregistered_token_idx" ON "unregistered_users" USING btree ("invitation_token");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_org_idx" ON "users" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "user_church_idx" ON "users" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "verification_code_idx" ON "users" USING btree ("verification_code");--> statement-breakpoint
CREATE INDEX "visitor_church_idx" ON "visitors" USING btree ("church_id");