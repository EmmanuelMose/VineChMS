CREATE TYPE "public"."department_type" AS ENUM('large_org_department', 'org_department', 'church_department');--> statement-breakpoint
CREATE TABLE "department_members" (
	"department_member_id" serial PRIMARY KEY NOT NULL,
	"department_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"position_id" integer,
	"role" varchar(50),
	"is_active" boolean DEFAULT true,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_dept_member" UNIQUE("department_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"department_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"type" "department_type" NOT NULL,
	"parent_department_id" integer,
	"large_organization_id" integer,
	"organization_id" integer,
	"church_id" integer,
	"leader_id" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "department_members" ADD CONSTRAINT "department_members_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("department_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "department_members" ADD CONSTRAINT "department_members_member_id_members_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("member_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "department_members" ADD CONSTRAINT "department_members_position_id_positions_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("position_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_department_id_departments_department_id_fk" FOREIGN KEY ("parent_department_id") REFERENCES "public"."departments"("department_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_large_organization_id_large_organizations_large_organization_id_fk" FOREIGN KEY ("large_organization_id") REFERENCES "public"."large_organizations"("large_organization_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("organization_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_church_id_churches_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("church_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_leader_id_members_member_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."members"("member_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dept_member_dept_idx" ON "department_members" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "dept_member_member_idx" ON "department_members" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "dept_large_org_idx" ON "departments" USING btree ("large_organization_id");--> statement-breakpoint
CREATE INDEX "dept_org_idx" ON "departments" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "dept_church_idx" ON "departments" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "dept_parent_idx" ON "departments" USING btree ("parent_department_id");