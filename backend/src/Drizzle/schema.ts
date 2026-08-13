import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  pgEnum,
  unique,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "large_org_admin",
  "large_org_member",
  "small_org_admin",
  "small_org_member",
  "church_admin",
  "church_member",
  "pastor",
  "elder",
  "treasurer",
  "secretary",
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
]);

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const maritalStatusEnum = pgEnum("marital_status", [
  "single",
  "married",
  "divorced",
  "widowed",
]);

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "starter",
  "growth",
  "enterprise",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
  "trial",
  "expired",
  "cancelled",
]);

export const attendanceTypeEnum = pgEnum("attendance_type", [
  "in_person",
  "online",
  "both",
]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "expired",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "warning",
  "success",
  "error",
]);

export const givingTypeEnum = pgEnum("giving_type", [
  "tithe",
  "offering",
  "pledge",
  "donation",
  "special",
]);

export const givingStatusEnum = pgEnum("giving_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const expenseStatusEnum = pgEnum("expense_status", [
  "pending",
  "approved",
  "rejected",
  "paid",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "cancelled",
  "completed",
]);

export const prayerRequestStatusEnum = pgEnum("prayer_request_status", [
  "pending",
  "praying",
  "answered",
  "closed",
]);

export const prayerRequestVisibilityEnum = pgEnum("prayer_request_visibility", [
  "public",
  "private",
  "confidential",
]);

export const documentVisibilityEnum = pgEnum("document_visibility", [
  "public",
  "members_only",
  "leadership_only",
  "private",
]);

export const announcementImagePositionEnum = pgEnum("announcement_image_position", [
  "top",
  "bottom",
  "left",
  "right",
  "cover",
]);

export const departmentTypeEnum = pgEnum("department_type", [
  "large_org_department",
  "org_department",
  "church_department",
]);

export const unregisteredUsers = pgTable(
  "unregistered_users",
  {
    unregisteredUserId: serial("unregistered_user_id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    role: userRoleEnum("role").notNull(),
    invitationToken: varchar("invitation_token", { length: 255 }).notNull().unique(),
    tokenExpiresAt: timestamp("token_expires_at").notNull(),
    invitedById: integer("invited_by_id").references(() => users.userId, {
      onDelete: "set null",
    }),
    organizationId: integer("organization_id"),
    churchId: integer("church_id"),
    largeOrganizationId: integer("large_organization_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("unregistered_email_idx").on(table.email),
    tokenIdx: index("unregistered_token_idx").on(table.invitationToken),
  })
);

export const users = pgTable(
  "users",
  {
    userId: serial("user_id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    profilePicture: varchar("profile_picture", { length: 500 }),
    profilePicturePublicId: varchar("profile_picture_public_id", { length: 255 }),
    gender: genderEnum("gender"),
    dateOfBirth: timestamp("date_of_birth"),
    maritalStatus: maritalStatusEnum("marital_status"),
    occupation: varchar("occupation", { length: 100 }),
    address: text("address"),
    role: userRoleEnum("role").notNull(),
    isActive: boolean("is_active").default(true),
    isVerified: boolean("is_verified").default(false),
    verificationCode: varchar("verification_code", { length: 10 }),
    lastLoginAt: timestamp("last_login_at"),
    organizationId: integer("organization_id"),
    churchId: integer("church_id"),
    largeOrganizationId: integer("large_organization_id"),
    createdBy: integer("created_by").references((): any => (users as any).userId, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    roleIdx: index("user_role_idx").on(table.role),
    orgIdx: index("user_org_idx").on(table.organizationId),
    churchIdx: index("user_church_idx").on(table.churchId),
    verificationCodeIdx: index("verification_code_idx").on(table.verificationCode),
  })
);

export const largeOrganizations = pgTable(
  "large_organizations",
  {
    largeOrganizationId: serial("large_organization_id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    logo: varchar("logo", { length: 500 }),
    logoPublicId: varchar("logo_public_id", { length: 255 }),
    website: varchar("website", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    address: text("address"),
    country: varchar("country", { length: 100 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    subscriptionPlan: subscriptionPlanEnum("subscription_plan").default("starter"),
    subscriptionStatus: subscriptionStatusEnum("subscription_status").default("trial"),
    subscriptionStartDate: timestamp("subscription_start_date"),
    subscriptionEndDate: timestamp("subscription_end_date"),
    maxOrganizations: integer("max_organizations").default(10),
    maxChurches: integer("max_churches").default(50),
    maxMembers: integer("max_members").default(1000),
    createdBy: integer("created_by").references(() => users.userId, {
      onDelete: "set null",
    }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("large_org_name_idx").on(table.name),
    emailIdx: index("large_org_email_idx").on(table.email),
  })
);

export const organizations = pgTable(
  "organizations",
  {
    organizationId: serial("organization_id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    logo: varchar("logo", { length: 500 }),
    logoPublicId: varchar("logo_public_id", { length: 255 }),
    website: varchar("website", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    address: text("address"),
    country: varchar("country", { length: 100 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    largeOrganizationId: integer("large_organization_id")
      .references(() => largeOrganizations.largeOrganizationId, {
        onDelete: "cascade",
      })
      .notNull(),
    maxChurches: integer("max_churches").default(20),
    maxMembers: integer("max_members").default(500),
    createdBy: integer("created_by").references(() => users.userId, {
      onDelete: "set null",
    }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("org_name_idx").on(table.name),
    largeOrgIdx: index("org_large_org_idx").on(table.largeOrganizationId),
  })
);

export const churches = pgTable(
  "churches",
  {
    churchId: serial("church_id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    logo: varchar("logo", { length: 500 }),
    logoPublicId: varchar("logo_public_id", { length: 255 }),
    website: varchar("website", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    address: text("address"),
    country: varchar("country", { length: 100 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    denomination: varchar("denomination", { length: 100 }),
    foundedDate: timestamp("founded_date"),
    organizationId: integer("organization_id")
      .references(() => organizations.organizationId, {
        onDelete: "cascade",
      })
      .notNull(),
    maxMembers: integer("max_members").default(200),
    createdBy: integer("created_by").references(() => users.userId, {
      onDelete: "set null",
    }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("church_name_idx").on(table.name),
    orgIdx: index("church_org_idx").on(table.organizationId),
  })
);

export const members = pgTable(
  "members",
  {
    memberId: serial("member_id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.userId, { onDelete: "set null" }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" }),
    organizationId: integer("organization_id")
      .references(() => organizations.organizationId, { onDelete: "cascade" }),
    largeOrganizationId: integer("large_organization_id")
      .references(() => largeOrganizations.largeOrganizationId, { onDelete: "cascade" }),
    membershipNumber: varchar("membership_number", { length: 50 }),
    membershipDate: timestamp("membership_date"),
    role: userRoleEnum("role").notNull(),
    isActive: boolean("is_active").default(false),
    isBaptized: boolean("is_baptized").default(false),
    baptismDate: timestamp("baptism_date"),
    isConfirmed: boolean("is_confirmed").default(false),
    confirmationDate: timestamp("confirmation_date"),
    isLeader: boolean("is_leader").default(false),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("member_user_idx").on(table.userId),
    emailIdx: index("member_email_idx").on(table.email),
    churchIdIdx: index("member_church_idx").on(table.churchId),
    membershipNumberIdx: index("member_number_idx").on(table.membershipNumber),
  })
);

export const positions = pgTable(
  "positions",
  {
    positionId: serial("position_id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" }),
    organizationId: integer("organization_id")
      .references(() => organizations.organizationId, { onDelete: "cascade" }),
    largeOrganizationId: integer("large_organization_id")
      .references(() => largeOrganizations.largeOrganizationId, { onDelete: "cascade" }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("position_church_idx").on(table.churchId),
    orgIdx: index("position_org_idx").on(table.organizationId),
    largeOrgIdx: index("position_large_org_idx").on(table.largeOrganizationId),
  })
);

export const leaders = pgTable(
  "leaders",
  {
    leaderId: serial("leader_id").primaryKey(),
    memberId: integer("member_id")
      .references(() => members.memberId, { onDelete: "cascade" })
      .notNull(),
    positionId: integer("position_id")
      .references(() => positions.positionId, { onDelete: "cascade" })
      .notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    isActive: boolean("is_active").default(true),
    isApproved: boolean("is_approved").default(false),
    approvedBy: integer("approved_by").references(() => users.userId, {
      onDelete: "set null",
    }),
    approvedAt: timestamp("approved_at"),
    notes: text("notes"),
    profilePicture: varchar("profile_picture", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    memberIdx: index("leader_member_idx").on(table.memberId),
    positionIdx: index("leader_position_idx").on(table.positionId),
  })
);

export const departments = pgTable(
  "departments",
  {
    departmentId: serial("department_id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    type: departmentTypeEnum("type").notNull(),
    parentDepartmentId: integer("parent_department_id")
      .references((): any => departments.departmentId, { onDelete: "set null" }),
    largeOrganizationId: integer("large_organization_id")
      .references(() => largeOrganizations.largeOrganizationId, { onDelete: "cascade" }),
    organizationId: integer("organization_id")
      .references(() => organizations.organizationId, { onDelete: "cascade" }),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" }),
    leaderId: integer("leader_id")
      .references(() => members.memberId, { onDelete: "set null" }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    largeOrgIdx: index("dept_large_org_idx").on(table.largeOrganizationId),
    orgIdx: index("dept_org_idx").on(table.organizationId),
    churchIdx: index("dept_church_idx").on(table.churchId),
    parentIdx: index("dept_parent_idx").on(table.parentDepartmentId),
  })
);

export const departmentMembers = pgTable(
  "department_members",
  {
    departmentMemberId: serial("department_member_id").primaryKey(),
    departmentId: integer("department_id")
      .references(() => departments.departmentId, { onDelete: "cascade" })
      .notNull(),
    memberId: integer("member_id")
      .references(() => members.memberId, { onDelete: "cascade" })
      .notNull(),
    positionId: integer("position_id")
      .references(() => positions.positionId, { onDelete: "set null" }),
    role: varchar("role", { length: 50 }),
    isActive: boolean("is_active").default(true),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    unique: unique("unique_dept_member").on(table.departmentId, table.memberId),
    deptIdx: index("dept_member_dept_idx").on(table.departmentId),
    memberIdx: index("dept_member_member_idx").on(table.memberId),
  })
);

export const services = pgTable(
  "services",
  {
    serviceId: serial("service_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    dayOfWeek: integer("day_of_week").notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time"),
    serviceType: varchar("service_type", { length: 50 }).default("regular"),
    attendanceType: attendanceTypeEnum("attendance_type").default("in_person"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("service_church_idx").on(table.churchId),
  })
);

export const attendance = pgTable(
  "attendance",
  {
    attendanceId: serial("attendance_id").primaryKey(),
    memberId: integer("member_id")
      .references(() => members.memberId, { onDelete: "cascade" })
      .notNull(),
    serviceId: integer("service_id")
      .references(() => services.serviceId, { onDelete: "cascade" })
      .notNull(),
    date: timestamp("date").notNull(),
    attended: boolean("attended").default(true),
    checkInTime: timestamp("check_in_time"),
    checkOutTime: timestamp("check_out_time"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    memberIdx: index("attendance_member_idx").on(table.memberId),
    serviceIdx: index("attendance_service_idx").on(table.serviceId),
    dateIdx: index("attendance_date_idx").on(table.date),
    unique: unique("unique_attendance").on(table.memberId, table.serviceId, table.date),
  })
);

export const visitors = pgTable(
  "visitors",
  {
    visitorId: serial("visitor_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    address: text("address"),
    profilePicture: varchar("profile_picture", { length: 500 }),
    visitedDate: timestamp("visited_date").defaultNow(),
    serviceId: integer("service_id").references(() => services.serviceId, {
      onDelete: "set null",
    }),
    isMember: boolean("is_member").default(false),
    memberId: integer("member_id").references(() => members.memberId, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("visitor_church_idx").on(table.churchId),
  })
);

export const givingCategories = pgTable(
  "giving_categories",
  {
    categoryId: serial("category_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    image: varchar("image", { length: 500 }),
    imagePublicId: varchar("image_public_id", { length: 255 }),
    type: givingTypeEnum("type").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("giving_category_church_idx").on(table.churchId),
  })
);

export const giving = pgTable(
  "giving",
  {
    givingId: serial("giving_id").primaryKey(),
    memberId: integer("member_id")
      .references(() => members.memberId, { onDelete: "cascade" })
      .notNull(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    categoryId: integer("category_id").references(
      () => givingCategories.categoryId,
      { onDelete: "set null" }
    ),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("KES"),
    type: givingTypeEnum("type").notNull(),
    status: givingStatusEnum("status").default("pending"),
    date: timestamp("date").defaultNow().notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }),
    transactionId: varchar("transaction_id", { length: 255 }),
    notes: text("notes"),
    isAnonymous: boolean("is_anonymous").default(false),
    receiptNumber: varchar("receipt_number", { length: 50 }),
    receiptFile: varchar("receipt_file", { length: 500 }),
    receiptFilePublicId: varchar("receipt_file_public_id", { length: 255 }),
    mpesaCheckoutRequestID: varchar("mpesa_checkout_request_id", { length: 255 }),
    mpesaMerchantRequestID: varchar("mpesa_merchant_request_id", { length: 255 }),
    approvedBy: integer("approved_by").references(() => users.userId, {
      onDelete: "set null",
    }),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    memberIdx: index("giving_member_idx").on(table.memberId),
    churchIdx: index("giving_church_idx").on(table.churchId),
    dateIdx: index("giving_date_idx").on(table.date),
  })
);

export const pledges = pgTable(
  "pledges",
  {
    pledgeId: serial("pledge_id").primaryKey(),
    memberId: integer("member_id")
      .references(() => members.memberId, { onDelete: "cascade" })
      .notNull(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    categoryId: integer("category_id").references(
      () => givingCategories.categoryId,
      { onDelete: "set null" }
    ),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    frequency: varchar("frequency", { length: 20 }).default("monthly"),
    isFulfilled: boolean("is_fulfilled").default(false),
    fulfilledAt: timestamp("fulfilled_at"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    memberIdx: index("pledge_member_idx").on(table.memberId),
    churchIdx: index("pledge_church_idx").on(table.churchId),
  })
);

export const expenseCategories = pgTable(
  "expense_categories",
  {
    categoryId: serial("category_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    image: varchar("image", { length: 500 }),
    imagePublicId: varchar("image_public_id", { length: 255 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("expense_category_church_idx").on(table.churchId),
  })
);

export const expenses = pgTable(
  "expenses",
  {
    expenseId: serial("expense_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    categoryId: integer("category_id").references(
      () => expenseCategories.categoryId,
      { onDelete: "set null" }
    ),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    description: text("description").notNull(),
    date: timestamp("date").defaultNow().notNull(),
    status: expenseStatusEnum("status").default("pending"),
    approvedBy: integer("approved_by").references(() => users.userId, {
      onDelete: "set null",
    }),
    approvedAt: timestamp("approved_at"),
    receiptUrl: varchar("receipt_url", { length: 500 }),
    receiptPublicId: varchar("receipt_public_id", { length: 255 }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("expense_church_idx").on(table.churchId),
    dateIdx: index("expense_date_idx").on(table.date),
  })
);

export const budgets = pgTable(
  "budgets",
  {
    budgetId: serial("budget_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    year: integer("year").notNull(),
    month: integer("month"),
    isAnnual: boolean("is_annual").default(false),
    attachment: varchar("attachment", { length: 500 }),
    attachmentPublicId: varchar("attachment_public_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("budget_church_idx").on(table.churchId),
    yearIdx: index("budget_year_idx").on(table.year),
  })
);

export const events = pgTable(
  "events",
  {
    eventId: serial("event_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    location: varchar("location", { length: 255 }),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    status: eventStatusEnum("status").default("draft"),
    isPublic: boolean("is_public").default(true),
    maxAttendees: integer("max_attendees"),
    imageUrl: varchar("image_url", { length: 500 }),
    imagePublicId: varchar("image_public_id", { length: 255 }),
    coverImageUrl: varchar("cover_image_url", { length: 500 }),
    coverImagePublicId: varchar("cover_image_public_id", { length: 255 }),
    gallery: jsonb("gallery"),
    createdBy: integer("created_by").references(() => users.userId, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("event_church_idx").on(table.churchId),
    dateIdx: index("event_date_idx").on(table.startDate),
  })
);

export const eventRegistrations = pgTable(
  "event_registrations",
  {
    registrationId: serial("registration_id").primaryKey(),
    eventId: integer("event_id")
      .references(() => events.eventId, { onDelete: "cascade" })
      .notNull(),
    memberId: integer("member_id")
      .references(() => members.memberId, { onDelete: "cascade" })
      .notNull(),
    attended: boolean("attended").default(false),
    notes: text("notes"),
    registrationImage: varchar("registration_image", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    unique: unique("unique_event_registration").on(table.eventId, table.memberId),
    eventIdx: index("event_reg_event_idx").on(table.eventId),
    memberIdx: index("event_reg_member_idx").on(table.memberId),
  })
);

export const prayerRequests = pgTable(
  "prayer_requests",
  {
    prayerRequestId: serial("prayer_request_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    memberId: integer("member_id")
      .references(() => members.memberId, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    image: varchar("image", { length: 500 }),
    imagePublicId: varchar("image_public_id", { length: 255 }),
    status: prayerRequestStatusEnum("status").default("pending"),
    visibility: prayerRequestVisibilityEnum("visibility").default("public"),
    answeredAt: timestamp("answered_at"),
    answerDescription: text("answer_description"),
    prayerCount: integer("prayer_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("prayer_church_idx").on(table.churchId),
    memberIdx: index("prayer_member_idx").on(table.memberId),
    statusIdx: index("prayer_status_idx").on(table.status),
  })
);

export const prayerInteractions = pgTable(
  "prayer_interactions",
  {
    interactionId: serial("interaction_id").primaryKey(),
    prayerRequestId: integer("prayer_request_id")
      .references(() => prayerRequests.prayerRequestId, { onDelete: "cascade" })
      .notNull(),
    memberId: integer("member_id")
      .references(() => members.memberId, { onDelete: "cascade" })
      .notNull(),
    type: varchar("type", { length: 20 }).default("prayed"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    unique: unique("unique_prayer_interaction").on(
      table.prayerRequestId,
      table.memberId
    ),
    prayerIdx: index("prayer_interaction_prayer_idx").on(table.prayerRequestId),
    memberIdx: index("prayer_interaction_member_idx").on(table.memberId),
  })
);

export const announcements = pgTable(
  "announcements",
  {
    announcementId: serial("announcement_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    imagePublicId: varchar("image_public_id", { length: 255 }),
    imagePosition: announcementImagePositionEnum("image_position").default("top"),
    isPublished: boolean("is_published").default(false),
    publishedAt: timestamp("published_at"),
    expiresAt: timestamp("expires_at"),
    createdBy: integer("created_by").references(() => users.userId, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("announcement_church_idx").on(table.churchId),
    publishedIdx: index("announcement_published_idx").on(table.publishedAt),
  })
);

export const notifications = pgTable(
  "notifications",
  {
    notificationId: serial("notification_id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    message: text("message").notNull(),
    type: notificationTypeEnum("type").default("info"),
    isRead: boolean("is_read").default(false),
    readAt: timestamp("read_at"),
    link: varchar("link", { length: 255 }),
    notificationImage: varchar("notification_image", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("notification_user_idx").on(table.userId),
    readIdx: index("notification_read_idx").on(table.isRead),
    createdIdx: index("notification_created_idx").on(table.createdAt),
  })
);

export const documents = pgTable(
  "documents",
  {
    documentId: serial("document_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileUrl: varchar("file_url", { length: 500 }).notNull(),
    filePublicId: varchar("file_public_id", { length: 255 }),
    fileSize: integer("file_size"),
    fileType: varchar("file_type", { length: 100 }),
    documentType: varchar("document_type", { length: 50 }),
    visibility: documentVisibilityEnum("visibility").default("members_only"),
    thumbnail: varchar("thumbnail", { length: 500 }),
    thumbnailPublicId: varchar("thumbnail_public_id", { length: 255 }),
    uploadedBy: integer("uploaded_by").references(() => users.userId, {
      onDelete: "set null",
    }),
    version: integer("version").default(1),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("document_church_idx").on(table.churchId),
    typeIdx: index("document_type_idx").on(table.documentType),
  })
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    auditId: serial("audit_id").primaryKey(),
    userId: integer("user_id").references(() => users.userId, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 50 }).notNull(),
    entity: varchar("entity", { length: 50 }).notNull(),
    entityId: integer("entity_id"),
    changes: jsonb("changes"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("audit_user_idx").on(table.userId),
    entityIdx: index("audit_entity_idx").on(table.entity),
    createdIdx: index("audit_created_idx").on(table.createdAt),
  })
);

export const invitations = pgTable(
  "invitations",
  {
    invitationId: serial("invitation_id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    role: userRoleEnum("role").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    status: invitationStatusEnum("status").default("pending"),
    invitedBy: integer("invited_by").references(() => users.userId, {
      onDelete: "set null",
    }),
    largeOrganizationId: integer("large_organization_id").references(
      () => largeOrganizations.largeOrganizationId,
      { onDelete: "cascade" }
    ),
    organizationId: integer("organization_id").references(
      () => organizations.organizationId,
      { onDelete: "cascade" }
    ),
    churchId: integer("church_id").references(() => churches.churchId, {
      onDelete: "cascade",
    }),
    acceptedAt: timestamp("accepted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: index("invitation_token_idx").on(table.token),
    emailIdx: index("invitation_email_idx").on(table.email),
    statusIdx: index("invitation_status_idx").on(table.status),
  })
);

export const groups = pgTable(
  "groups",
  {
    groupId: serial("group_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 50 }),
    leaderId: integer("leader_id").references(() => members.memberId, {
      onDelete: "set null",
    }),
    meetingDay: integer("meeting_day"),
    meetingTime: timestamp("meeting_time"),
    location: varchar("location", { length: 255 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("group_church_idx").on(table.churchId),
  })
);

export const groupJoinRequests = pgTable(
  "group_join_requests",
  {
    requestId: serial("request_id").primaryKey(),
    groupId: integer("group_id")
      .references(() => groups.groupId, { onDelete: "cascade" })
      .notNull(),
    memberId: integer("member_id")
      .references(() => members.memberId, { onDelete: "cascade" })
      .notNull(),
    message: text("message"),
    status: varchar("status", { length: 20 }).default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    groupIdx: index("join_req_group_idx").on(table.groupId),
    memberIdx: index("join_req_member_idx").on(table.memberId),
    statusIdx: index("join_req_status_idx").on(table.status),
  })
);

export const groupMembers = pgTable(
  "group_members",
  {
    groupMemberId: serial("group_member_id").primaryKey(),
    groupId: integer("group_id")
      .references(() => groups.groupId, { onDelete: "cascade" })
      .notNull(),
    memberId: integer("member_id")
      .references(() => members.memberId, { onDelete: "cascade" })
      .notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    isActive: boolean("is_active").default(true),
    role: varchar("role", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    unique: unique("unique_group_member").on(table.groupId, table.memberId),
    groupIdx: index("group_member_group_idx").on(table.groupId),
    memberIdx: index("group_member_member_idx").on(table.memberId),
  })
);

export const sermons = pgTable(
  "sermons",
  {
    sermonId: serial("sermon_id").primaryKey(),
    churchId: integer("church_id")
      .references(() => churches.churchId, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    speaker: varchar("speaker", { length: 100 }).notNull(),
    topic: varchar("topic", { length: 100 }),
    scripture: varchar("scripture", { length: 255 }),
    description: text("description"),
    videoUrl: varchar("video_url", { length: 500 }),
    videoPublicId: varchar("video_public_id", { length: 255 }),
    audioUrl: varchar("audio_url", { length: 500 }),
    audioPublicId: varchar("audio_public_id", { length: 255 }),
    notes: text("notes"),
    preachedAt: timestamp("preached_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    churchIdx: index("sermon_church_idx").on(table.churchId),
    dateIdx: index("sermon_date_idx").on(table.preachedAt),
  })
);

export const usersRelations = relations(users, ({ one, many }) => ({
  unregisteredUsers: many(unregisteredUsers),
  createdBy: one(users, {
    fields: [users.createdBy],
    references: [users.userId],
  }),
  largeOrganizations: many(largeOrganizations),
  organizations: many(organizations),
  churches: many(churches),
  members: many(members),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  invitations: many(invitations),
}));

export const largeOrganizationsRelations = relations(
  largeOrganizations,
  ({ one, many }) => ({
    organizations: many(organizations),
    createdBy: one(users, {
      fields: [largeOrganizations.createdBy],
      references: [users.userId],
    }),
  })
);

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    largeOrganization: one(largeOrganizations, {
      fields: [organizations.largeOrganizationId],
      references: [largeOrganizations.largeOrganizationId],
    }),
    churches: many(churches),
    createdBy: one(users, {
      fields: [organizations.createdBy],
      references: [users.userId],
    }),
  })
);

export const churchesRelations = relations(churches, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [churches.organizationId],
    references: [organizations.organizationId],
  }),
  members: many(members),
  positions: many(positions),
  services: many(services),
  visitors: many(visitors),
  giving: many(giving),
  givingCategories: many(givingCategories),
  expenses: many(expenses),
  expenseCategories: many(expenseCategories),
  budgets: many(budgets),
  events: many(events),
  prayerRequests: many(prayerRequests),
  announcements: many(announcements),
  documents: many(documents),
  groups: many(groups),
  sermons: many(sermons),
  departments: many(departments),
  createdBy: one(users, {
    fields: [churches.createdBy],
    references: [users.userId],
  }),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.userId],
  }),
  church: one(churches, {
    fields: [members.churchId],
    references: [churches.churchId],
  }),
  leaders: many(leaders),
  attendance: many(attendance),
  giving: many(giving),
  pledges: many(pledges),
  eventRegistrations: many(eventRegistrations),
  prayerRequests: many(prayerRequests),
  prayerInteractions: many(prayerInteractions),
  groupMembers: many(groupMembers),
  departmentMembers: many(departmentMembers),
}));

export const positionsRelations = relations(positions, ({ one, many }) => ({
  church: one(churches, {
    fields: [positions.churchId],
    references: [churches.churchId],
  }),
  organization: one(organizations, {
    fields: [positions.organizationId],
    references: [organizations.organizationId],
  }),
  largeOrganization: one(largeOrganizations, {
    fields: [positions.largeOrganizationId],
    references: [largeOrganizations.largeOrganizationId],
  }),
  leaders: many(leaders),
  departmentMembers: many(departmentMembers),
}));

export const leadersRelations = relations(leaders, ({ one }) => ({
  member: one(members, {
    fields: [leaders.memberId],
    references: [members.memberId],
  }),
  position: one(positions, {
    fields: [leaders.positionId],
    references: [positions.positionId],
  }),
  approvedBy: one(users, {
    fields: [leaders.approvedBy],
    references: [users.userId],
  }),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  largeOrganization: one(largeOrganizations, {
    fields: [departments.largeOrganizationId],
    references: [largeOrganizations.largeOrganizationId],
  }),
  organization: one(organizations, {
    fields: [departments.organizationId],
    references: [organizations.organizationId],
  }),
  church: one(churches, {
    fields: [departments.churchId],
    references: [churches.churchId],
  }),
  parent: one(departments, {
    fields: [departments.parentDepartmentId],
    references: [departments.departmentId],
  }),
  children: many(departments, { relationName: "children" }),
  leader: one(members, {
    fields: [departments.leaderId],
    references: [members.memberId],
  }),
  departmentMembers: many(departmentMembers),
}));

export const departmentMembersRelations = relations(departmentMembers, ({ one }) => ({
  department: one(departments, {
    fields: [departmentMembers.departmentId],
    references: [departments.departmentId],
  }),
  member: one(members, {
    fields: [departmentMembers.memberId],
    references: [members.memberId],
  }),
  position: one(positions, {
    fields: [departmentMembers.positionId],
    references: [positions.positionId],
  }),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  church: one(churches, {
    fields: [services.churchId],
    references: [churches.churchId],
  }),
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  member: one(members, {
    fields: [attendance.memberId],
    references: [members.memberId],
  }),
  service: one(services, {
    fields: [attendance.serviceId],
    references: [services.serviceId],
  }),
}));

export const givingRelations = relations(giving, ({ one }) => ({
  member: one(members, {
    fields: [giving.memberId],
    references: [members.memberId],
  }),
  church: one(churches, {
    fields: [giving.churchId],
    references: [churches.churchId],
  }),
  category: one(givingCategories, {
    fields: [giving.categoryId],
    references: [givingCategories.categoryId],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  church: one(churches, {
    fields: [expenses.churchId],
    references: [churches.churchId],
  }),
  category: one(expenseCategories, {
    fields: [expenses.categoryId],
    references: [expenseCategories.categoryId],
  }),
  approvedBy: one(users, {
    fields: [expenses.approvedBy],
    references: [users.userId],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  church: one(churches, {
    fields: [events.churchId],
    references: [churches.churchId],
  }),
  createdBy: one(users, {
    fields: [events.createdBy],
    references: [users.userId],
  }),
  registrations: many(eventRegistrations),
}));

export const prayerRequestsRelations = relations(
  prayerRequests,
  ({ one, many }) => ({
    church: one(churches, {
      fields: [prayerRequests.churchId],
      references: [churches.churchId],
    }),
    member: one(members, {
      fields: [prayerRequests.memberId],
      references: [members.memberId],
    }),
    interactions: many(prayerInteractions),
  })
);

export const announcementsRelations = relations(announcements, ({ one }) => ({
  church: one(churches, {
    fields: [announcements.churchId],
    references: [churches.churchId],
  }),
  createdBy: one(users, {
    fields: [announcements.createdBy],
    references: [users.userId],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.userId],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  church: one(churches, {
    fields: [documents.churchId],
    references: [churches.churchId],
  }),
  uploadedBy: one(users, {
    fields: [documents.uploadedBy],
    references: [users.userId],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.userId],
  }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  church: one(churches, {
    fields: [groups.churchId],
    references: [churches.churchId],
  }),
  leader: one(members, {
    fields: [groups.leaderId],
    references: [members.memberId],
  }),
  groupMembers: many(groupMembers),
  joinRequests: many(groupJoinRequests),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.groupId],
  }),
  member: one(members, {
    fields: [groupMembers.memberId],
    references: [members.memberId],
  }),
}));

export const groupJoinRequestsRelations = relations(groupJoinRequests, ({ one }) => ({
  group: one(groups, {
    fields: [groupJoinRequests.groupId],
    references: [groups.groupId],
  }),
  member: one(members, {
    fields: [groupJoinRequests.memberId],
    references: [members.memberId],
  }),
}));

export const sermonsRelations = relations(sermons, ({ one }) => ({
  church: one(churches, {
    fields: [sermons.churchId],
    references: [churches.churchId],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UnregisteredUser = typeof unregisteredUsers.$inferSelect;
export type NewUnregisteredUser = typeof unregisteredUsers.$inferInsert;
export type LargeOrganization = typeof largeOrganizations.$inferSelect;
export type NewLargeOrganization = typeof largeOrganizations.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type Church = typeof churches.$inferSelect;
export type NewChurch = typeof churches.$inferInsert;
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Position = typeof positions.$inferSelect;
export type NewPosition = typeof positions.$inferInsert;
export type Leader = typeof leaders.$inferSelect;
export type NewLeader = typeof leaders.$inferInsert;
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
export type DepartmentMember = typeof departmentMembers.$inferSelect;
export type NewDepartmentMember = typeof departmentMembers.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
export type Giving = typeof giving.$inferSelect;
export type NewGiving = typeof giving.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type NewPrayerRequest = typeof prayerRequests.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type GroupJoinRequest = typeof groupJoinRequests.$inferSelect;
export type NewGroupJoinRequest = typeof groupJoinRequests.$inferInsert;
export type Sermon = typeof sermons.$inferSelect;
export type NewSermon = typeof sermons.$inferInsert;
export type Visitor = typeof visitors.$inferSelect;
export type NewVisitor = typeof visitors.$inferInsert;
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
export type Pledge = typeof pledges.$inferSelect;
export type NewPledge = typeof pledges.$inferInsert;
export type GivingCategory = typeof givingCategories.$inferSelect;
export type NewGivingCategory = typeof givingCategories.$inferInsert;
export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type NewExpenseCategory = typeof expenseCategories.$inferInsert;