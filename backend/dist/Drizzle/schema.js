"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sermons = exports.groupMembers = exports.groupJoinRequests = exports.groups = exports.invitations = exports.auditLogs = exports.documents = exports.notifications = exports.announcements = exports.prayerInteractions = exports.prayerRequests = exports.eventRegistrations = exports.events = exports.budgets = exports.expenses = exports.expenseCategories = exports.pledges = exports.giving = exports.givingCategories = exports.visitors = exports.attendance = exports.services = exports.departmentMembers = exports.departments = exports.leaders = exports.positions = exports.members = exports.churches = exports.organizations = exports.largeOrganizations = exports.users = exports.unregisteredUsers = exports.departmentTypeEnum = exports.announcementImagePositionEnum = exports.documentVisibilityEnum = exports.prayerRequestVisibilityEnum = exports.prayerRequestStatusEnum = exports.eventStatusEnum = exports.expenseStatusEnum = exports.givingStatusEnum = exports.givingTypeEnum = exports.notificationTypeEnum = exports.invitationStatusEnum = exports.attendanceTypeEnum = exports.subscriptionStatusEnum = exports.subscriptionPlanEnum = exports.maritalStatusEnum = exports.genderEnum = exports.approvalStatusEnum = exports.userRoleEnum = void 0;
exports.sermonsRelations = exports.groupJoinRequestsRelations = exports.groupMembersRelations = exports.groupsRelations = exports.auditLogsRelations = exports.documentsRelations = exports.notificationsRelations = exports.announcementsRelations = exports.prayerRequestsRelations = exports.eventsRelations = exports.expensesRelations = exports.givingRelations = exports.attendanceRelations = exports.servicesRelations = exports.departmentMembersRelations = exports.departmentsRelations = exports.leadersRelations = exports.positionsRelations = exports.membersRelations = exports.churchesRelations = exports.organizationsRelations = exports.largeOrganizationsRelations = exports.usersRelations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.userRoleEnum = (0, pg_core_1.pgEnum)("user_role", [
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
exports.approvalStatusEnum = (0, pg_core_1.pgEnum)("approval_status", [
    "pending",
    "approved",
    "rejected",
]);
exports.genderEnum = (0, pg_core_1.pgEnum)("gender", ["male", "female", "other"]);
exports.maritalStatusEnum = (0, pg_core_1.pgEnum)("marital_status", [
    "single",
    "married",
    "divorced",
    "widowed",
]);
exports.subscriptionPlanEnum = (0, pg_core_1.pgEnum)("subscription_plan", [
    "starter",
    "growth",
    "enterprise",
]);
exports.subscriptionStatusEnum = (0, pg_core_1.pgEnum)("subscription_status", [
    "active",
    "inactive",
    "trial",
    "expired",
    "cancelled",
]);
exports.attendanceTypeEnum = (0, pg_core_1.pgEnum)("attendance_type", [
    "in_person",
    "online",
    "both",
]);
exports.invitationStatusEnum = (0, pg_core_1.pgEnum)("invitation_status", [
    "pending",
    "accepted",
    "expired",
]);
exports.notificationTypeEnum = (0, pg_core_1.pgEnum)("notification_type", [
    "info",
    "warning",
    "success",
    "error",
]);
exports.givingTypeEnum = (0, pg_core_1.pgEnum)("giving_type", [
    "tithe",
    "offering",
    "pledge",
    "donation",
    "special",
]);
exports.givingStatusEnum = (0, pg_core_1.pgEnum)("giving_status", [
    "pending",
    "completed",
    "failed",
    "refunded",
]);
exports.expenseStatusEnum = (0, pg_core_1.pgEnum)("expense_status", [
    "pending",
    "approved",
    "rejected",
    "paid",
]);
exports.eventStatusEnum = (0, pg_core_1.pgEnum)("event_status", [
    "draft",
    "published",
    "cancelled",
    "completed",
]);
exports.prayerRequestStatusEnum = (0, pg_core_1.pgEnum)("prayer_request_status", [
    "pending",
    "praying",
    "answered",
    "closed",
]);
exports.prayerRequestVisibilityEnum = (0, pg_core_1.pgEnum)("prayer_request_visibility", [
    "public",
    "private",
    "confidential",
]);
exports.documentVisibilityEnum = (0, pg_core_1.pgEnum)("document_visibility", [
    "public",
    "members_only",
    "leadership_only",
    "private",
]);
exports.announcementImagePositionEnum = (0, pg_core_1.pgEnum)("announcement_image_position", [
    "top",
    "bottom",
    "left",
    "right",
    "cover",
]);
exports.departmentTypeEnum = (0, pg_core_1.pgEnum)("department_type", [
    "large_org_department",
    "org_department",
    "church_department",
]);
exports.unregisteredUsers = (0, pg_core_1.pgTable)("unregistered_users", {
    unregisteredUserId: (0, pg_core_1.serial)("unregistered_user_id").primaryKey(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    fullName: (0, pg_core_1.varchar)("full_name", { length: 100 }).notNull(),
    role: (0, exports.userRoleEnum)("role").notNull(),
    invitationToken: (0, pg_core_1.varchar)("invitation_token", { length: 255 }).notNull().unique(),
    tokenExpiresAt: (0, pg_core_1.timestamp)("token_expires_at").notNull(),
    invitedById: (0, pg_core_1.integer)("invited_by_id").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    organizationId: (0, pg_core_1.integer)("organization_id"),
    churchId: (0, pg_core_1.integer)("church_id"),
    largeOrganizationId: (0, pg_core_1.integer)("large_organization_id"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    emailIdx: (0, pg_core_1.index)("unregistered_email_idx").on(table.email),
    tokenIdx: (0, pg_core_1.index)("unregistered_token_idx").on(table.invitationToken),
}));
exports.users = (0, pg_core_1.pgTable)("users", {
    userId: (0, pg_core_1.serial)("user_id").primaryKey(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.text)("password_hash").notNull(),
    fullName: (0, pg_core_1.varchar)("full_name", { length: 100 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    profilePicture: (0, pg_core_1.varchar)("profile_picture", { length: 500 }),
    profilePicturePublicId: (0, pg_core_1.varchar)("profile_picture_public_id", { length: 255 }),
    gender: (0, exports.genderEnum)("gender"),
    dateOfBirth: (0, pg_core_1.timestamp)("date_of_birth"),
    maritalStatus: (0, exports.maritalStatusEnum)("marital_status"),
    occupation: (0, pg_core_1.varchar)("occupation", { length: 100 }),
    address: (0, pg_core_1.text)("address"),
    role: (0, exports.userRoleEnum)("role").notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    verificationCode: (0, pg_core_1.varchar)("verification_code", { length: 10 }),
    lastLoginAt: (0, pg_core_1.timestamp)("last_login_at"),
    organizationId: (0, pg_core_1.integer)("organization_id"),
    churchId: (0, pg_core_1.integer)("church_id"),
    largeOrganizationId: (0, pg_core_1.integer)("large_organization_id"),
    createdBy: (0, pg_core_1.integer)("created_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    emailIdx: (0, pg_core_1.index)("user_email_idx").on(table.email),
    roleIdx: (0, pg_core_1.index)("user_role_idx").on(table.role),
    orgIdx: (0, pg_core_1.index)("user_org_idx").on(table.organizationId),
    churchIdx: (0, pg_core_1.index)("user_church_idx").on(table.churchId),
    verificationCodeIdx: (0, pg_core_1.index)("verification_code_idx").on(table.verificationCode),
}));
exports.largeOrganizations = (0, pg_core_1.pgTable)("large_organizations", {
    largeOrganizationId: (0, pg_core_1.serial)("large_organization_id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 200 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    logo: (0, pg_core_1.varchar)("logo", { length: 500 }),
    logoPublicId: (0, pg_core_1.varchar)("logo_public_id", { length: 255 }),
    website: (0, pg_core_1.varchar)("website", { length: 255 }),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    address: (0, pg_core_1.text)("address"),
    country: (0, pg_core_1.varchar)("country", { length: 100 }),
    city: (0, pg_core_1.varchar)("city", { length: 100 }),
    state: (0, pg_core_1.varchar)("state", { length: 100 }),
    postalCode: (0, pg_core_1.varchar)("postal_code", { length: 20 }),
    subscriptionPlan: (0, exports.subscriptionPlanEnum)("subscription_plan").default("starter"),
    subscriptionStatus: (0, exports.subscriptionStatusEnum)("subscription_status").default("trial"),
    subscriptionStartDate: (0, pg_core_1.timestamp)("subscription_start_date"),
    subscriptionEndDate: (0, pg_core_1.timestamp)("subscription_end_date"),
    maxOrganizations: (0, pg_core_1.integer)("max_organizations").default(10),
    maxChurches: (0, pg_core_1.integer)("max_churches").default(50),
    maxMembers: (0, pg_core_1.integer)("max_members").default(1000),
    createdBy: (0, pg_core_1.integer)("created_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    nameIdx: (0, pg_core_1.index)("large_org_name_idx").on(table.name),
    emailIdx: (0, pg_core_1.index)("large_org_email_idx").on(table.email),
}));
exports.organizations = (0, pg_core_1.pgTable)("organizations", {
    organizationId: (0, pg_core_1.serial)("organization_id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 200 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    logo: (0, pg_core_1.varchar)("logo", { length: 500 }),
    logoPublicId: (0, pg_core_1.varchar)("logo_public_id", { length: 255 }),
    website: (0, pg_core_1.varchar)("website", { length: 255 }),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    address: (0, pg_core_1.text)("address"),
    country: (0, pg_core_1.varchar)("country", { length: 100 }),
    city: (0, pg_core_1.varchar)("city", { length: 100 }),
    state: (0, pg_core_1.varchar)("state", { length: 100 }),
    postalCode: (0, pg_core_1.varchar)("postal_code", { length: 20 }),
    largeOrganizationId: (0, pg_core_1.integer)("large_organization_id")
        .references(() => exports.largeOrganizations.largeOrganizationId, {
        onDelete: "cascade",
    })
        .notNull(),
    maxChurches: (0, pg_core_1.integer)("max_churches").default(20),
    maxMembers: (0, pg_core_1.integer)("max_members").default(500),
    createdBy: (0, pg_core_1.integer)("created_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    nameIdx: (0, pg_core_1.index)("org_name_idx").on(table.name),
    largeOrgIdx: (0, pg_core_1.index)("org_large_org_idx").on(table.largeOrganizationId),
}));
exports.churches = (0, pg_core_1.pgTable)("churches", {
    churchId: (0, pg_core_1.serial)("church_id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 200 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    logo: (0, pg_core_1.varchar)("logo", { length: 500 }),
    logoPublicId: (0, pg_core_1.varchar)("logo_public_id", { length: 255 }),
    website: (0, pg_core_1.varchar)("website", { length: 255 }),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    address: (0, pg_core_1.text)("address"),
    country: (0, pg_core_1.varchar)("country", { length: 100 }),
    city: (0, pg_core_1.varchar)("city", { length: 100 }),
    state: (0, pg_core_1.varchar)("state", { length: 100 }),
    postalCode: (0, pg_core_1.varchar)("postal_code", { length: 20 }),
    denomination: (0, pg_core_1.varchar)("denomination", { length: 100 }),
    foundedDate: (0, pg_core_1.timestamp)("founded_date"),
    organizationId: (0, pg_core_1.integer)("organization_id")
        .references(() => exports.organizations.organizationId, {
        onDelete: "cascade",
    })
        .notNull(),
    maxMembers: (0, pg_core_1.integer)("max_members").default(200),
    createdBy: (0, pg_core_1.integer)("created_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    nameIdx: (0, pg_core_1.index)("church_name_idx").on(table.name),
    orgIdx: (0, pg_core_1.index)("church_org_idx").on(table.organizationId),
}));
exports.members = (0, pg_core_1.pgTable)("members", {
    memberId: (0, pg_core_1.serial)("member_id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id")
        .references(() => exports.users.userId, { onDelete: "set null" }),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    fullName: (0, pg_core_1.varchar)("full_name", { length: 100 }).notNull(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" }),
    organizationId: (0, pg_core_1.integer)("organization_id")
        .references(() => exports.organizations.organizationId, { onDelete: "cascade" }),
    largeOrganizationId: (0, pg_core_1.integer)("large_organization_id")
        .references(() => exports.largeOrganizations.largeOrganizationId, { onDelete: "cascade" }),
    membershipNumber: (0, pg_core_1.varchar)("membership_number", { length: 50 }),
    membershipDate: (0, pg_core_1.timestamp)("membership_date"),
    role: (0, exports.userRoleEnum)("role").notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(false),
    isBaptized: (0, pg_core_1.boolean)("is_baptized").default(false),
    baptismDate: (0, pg_core_1.timestamp)("baptism_date"),
    isConfirmed: (0, pg_core_1.boolean)("is_confirmed").default(false),
    confirmationDate: (0, pg_core_1.timestamp)("confirmation_date"),
    isLeader: (0, pg_core_1.boolean)("is_leader").default(false),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)("member_user_idx").on(table.userId),
    emailIdx: (0, pg_core_1.index)("member_email_idx").on(table.email),
    churchIdIdx: (0, pg_core_1.index)("member_church_idx").on(table.churchId),
    membershipNumberIdx: (0, pg_core_1.index)("member_number_idx").on(table.membershipNumber),
}));
exports.positions = (0, pg_core_1.pgTable)("positions", {
    positionId: (0, pg_core_1.serial)("position_id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" }),
    organizationId: (0, pg_core_1.integer)("organization_id")
        .references(() => exports.organizations.organizationId, { onDelete: "cascade" }),
    largeOrganizationId: (0, pg_core_1.integer)("large_organization_id")
        .references(() => exports.largeOrganizations.largeOrganizationId, { onDelete: "cascade" }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("position_church_idx").on(table.churchId),
    orgIdx: (0, pg_core_1.index)("position_org_idx").on(table.organizationId),
    largeOrgIdx: (0, pg_core_1.index)("position_large_org_idx").on(table.largeOrganizationId),
}));
exports.leaders = (0, pg_core_1.pgTable)("leaders", {
    leaderId: (0, pg_core_1.serial)("leader_id").primaryKey(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "cascade" })
        .notNull(),
    positionId: (0, pg_core_1.integer)("position_id")
        .references(() => exports.positions.positionId, { onDelete: "cascade" })
        .notNull(),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    isApproved: (0, pg_core_1.boolean)("is_approved").default(false),
    approvedBy: (0, pg_core_1.integer)("approved_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    approvedAt: (0, pg_core_1.timestamp)("approved_at"),
    notes: (0, pg_core_1.text)("notes"),
    profilePicture: (0, pg_core_1.varchar)("profile_picture", { length: 500 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    memberIdx: (0, pg_core_1.index)("leader_member_idx").on(table.memberId),
    positionIdx: (0, pg_core_1.index)("leader_position_idx").on(table.positionId),
}));
exports.departments = (0, pg_core_1.pgTable)("departments", {
    departmentId: (0, pg_core_1.serial)("department_id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    type: (0, exports.departmentTypeEnum)("type").notNull(),
    parentDepartmentId: (0, pg_core_1.integer)("parent_department_id")
        .references(() => exports.departments.departmentId, { onDelete: "set null" }),
    largeOrganizationId: (0, pg_core_1.integer)("large_organization_id")
        .references(() => exports.largeOrganizations.largeOrganizationId, { onDelete: "cascade" }),
    organizationId: (0, pg_core_1.integer)("organization_id")
        .references(() => exports.organizations.organizationId, { onDelete: "cascade" }),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" }),
    leaderId: (0, pg_core_1.integer)("leader_id")
        .references(() => exports.members.memberId, { onDelete: "set null" }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    largeOrgIdx: (0, pg_core_1.index)("dept_large_org_idx").on(table.largeOrganizationId),
    orgIdx: (0, pg_core_1.index)("dept_org_idx").on(table.organizationId),
    churchIdx: (0, pg_core_1.index)("dept_church_idx").on(table.churchId),
    parentIdx: (0, pg_core_1.index)("dept_parent_idx").on(table.parentDepartmentId),
}));
exports.departmentMembers = (0, pg_core_1.pgTable)("department_members", {
    departmentMemberId: (0, pg_core_1.serial)("department_member_id").primaryKey(),
    departmentId: (0, pg_core_1.integer)("department_id")
        .references(() => exports.departments.departmentId, { onDelete: "cascade" })
        .notNull(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "cascade" })
        .notNull(),
    positionId: (0, pg_core_1.integer)("position_id")
        .references(() => exports.positions.positionId, { onDelete: "set null" }),
    role: (0, pg_core_1.varchar)("role", { length: 50 }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    unique: (0, pg_core_1.unique)("unique_dept_member").on(table.departmentId, table.memberId),
    deptIdx: (0, pg_core_1.index)("dept_member_dept_idx").on(table.departmentId),
    memberIdx: (0, pg_core_1.index)("dept_member_member_idx").on(table.memberId),
}));
exports.services = (0, pg_core_1.pgTable)("services", {
    serviceId: (0, pg_core_1.serial)("service_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    dayOfWeek: (0, pg_core_1.integer)("day_of_week").notNull(),
    startTime: (0, pg_core_1.timestamp)("start_time").notNull(),
    endTime: (0, pg_core_1.timestamp)("end_time"),
    serviceType: (0, pg_core_1.varchar)("service_type", { length: 50 }).default("regular"),
    attendanceType: (0, exports.attendanceTypeEnum)("attendance_type").default("in_person"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("service_church_idx").on(table.churchId),
}));
exports.attendance = (0, pg_core_1.pgTable)("attendance", {
    attendanceId: (0, pg_core_1.serial)("attendance_id").primaryKey(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "cascade" })
        .notNull(),
    serviceId: (0, pg_core_1.integer)("service_id")
        .references(() => exports.services.serviceId, { onDelete: "cascade" })
        .notNull(),
    date: (0, pg_core_1.timestamp)("date").notNull(),
    attended: (0, pg_core_1.boolean)("attended").default(true),
    checkInTime: (0, pg_core_1.timestamp)("check_in_time"),
    checkOutTime: (0, pg_core_1.timestamp)("check_out_time"),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => ({
    memberIdx: (0, pg_core_1.index)("attendance_member_idx").on(table.memberId),
    serviceIdx: (0, pg_core_1.index)("attendance_service_idx").on(table.serviceId),
    dateIdx: (0, pg_core_1.index)("attendance_date_idx").on(table.date),
    unique: (0, pg_core_1.unique)("unique_attendance").on(table.memberId, table.serviceId, table.date),
}));
exports.visitors = (0, pg_core_1.pgTable)("visitors", {
    visitorId: (0, pg_core_1.serial)("visitor_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    fullName: (0, pg_core_1.varchar)("full_name", { length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    address: (0, pg_core_1.text)("address"),
    profilePicture: (0, pg_core_1.varchar)("profile_picture", { length: 500 }),
    visitedDate: (0, pg_core_1.timestamp)("visited_date").defaultNow(),
    serviceId: (0, pg_core_1.integer)("service_id").references(() => exports.services.serviceId, {
        onDelete: "set null",
    }),
    isMember: (0, pg_core_1.boolean)("is_member").default(false),
    memberId: (0, pg_core_1.integer)("member_id").references(() => exports.members.memberId, {
        onDelete: "set null",
    }),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("visitor_church_idx").on(table.churchId),
}));
exports.givingCategories = (0, pg_core_1.pgTable)("giving_categories", {
    categoryId: (0, pg_core_1.serial)("category_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    image: (0, pg_core_1.varchar)("image", { length: 500 }),
    imagePublicId: (0, pg_core_1.varchar)("image_public_id", { length: 255 }),
    type: (0, exports.givingTypeEnum)("type").notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("giving_category_church_idx").on(table.churchId),
}));
exports.giving = (0, pg_core_1.pgTable)("giving", {
    givingId: (0, pg_core_1.serial)("giving_id").primaryKey(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "cascade" })
        .notNull(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    categoryId: (0, pg_core_1.integer)("category_id").references(() => exports.givingCategories.categoryId, { onDelete: "set null" }),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)("currency", { length: 3 }).default("KES"),
    type: (0, exports.givingTypeEnum)("type").notNull(),
    status: (0, exports.givingStatusEnum)("status").default("pending"),
    date: (0, pg_core_1.timestamp)("date").defaultNow().notNull(),
    paymentMethod: (0, pg_core_1.varchar)("payment_method", { length: 50 }),
    transactionId: (0, pg_core_1.varchar)("transaction_id", { length: 255 }),
    notes: (0, pg_core_1.text)("notes"),
    isAnonymous: (0, pg_core_1.boolean)("is_anonymous").default(false),
    receiptNumber: (0, pg_core_1.varchar)("receipt_number", { length: 50 }),
    receiptFile: (0, pg_core_1.varchar)("receipt_file", { length: 500 }),
    receiptFilePublicId: (0, pg_core_1.varchar)("receipt_file_public_id", { length: 255 }),
    mpesaCheckoutRequestID: (0, pg_core_1.varchar)("mpesa_checkout_request_id", { length: 255 }),
    mpesaMerchantRequestID: (0, pg_core_1.varchar)("mpesa_merchant_request_id", { length: 255 }),
    approvedBy: (0, pg_core_1.integer)("approved_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    approvedAt: (0, pg_core_1.timestamp)("approved_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    memberIdx: (0, pg_core_1.index)("giving_member_idx").on(table.memberId),
    churchIdx: (0, pg_core_1.index)("giving_church_idx").on(table.churchId),
    dateIdx: (0, pg_core_1.index)("giving_date_idx").on(table.date),
}));
exports.pledges = (0, pg_core_1.pgTable)("pledges", {
    pledgeId: (0, pg_core_1.serial)("pledge_id").primaryKey(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "cascade" })
        .notNull(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    categoryId: (0, pg_core_1.integer)("category_id").references(() => exports.givingCategories.categoryId, { onDelete: "set null" }),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)("currency", { length: 3 }).default("USD"),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    frequency: (0, pg_core_1.varchar)("frequency", { length: 20 }).default("monthly"),
    isFulfilled: (0, pg_core_1.boolean)("is_fulfilled").default(false),
    fulfilledAt: (0, pg_core_1.timestamp)("fulfilled_at"),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    memberIdx: (0, pg_core_1.index)("pledge_member_idx").on(table.memberId),
    churchIdx: (0, pg_core_1.index)("pledge_church_idx").on(table.churchId),
}));
exports.expenseCategories = (0, pg_core_1.pgTable)("expense_categories", {
    categoryId: (0, pg_core_1.serial)("category_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    image: (0, pg_core_1.varchar)("image", { length: 500 }),
    imagePublicId: (0, pg_core_1.varchar)("image_public_id", { length: 255 }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("expense_category_church_idx").on(table.churchId),
}));
exports.expenses = (0, pg_core_1.pgTable)("expenses", {
    expenseId: (0, pg_core_1.serial)("expense_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "set null" }),
    categoryId: (0, pg_core_1.integer)("category_id").references(() => exports.expenseCategories.categoryId, { onDelete: "set null" }),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)("currency", { length: 3 }).default("KES"),
    description: (0, pg_core_1.text)("description").notNull(),
    date: (0, pg_core_1.timestamp)("date").defaultNow().notNull(),
    status: (0, exports.expenseStatusEnum)("status").default("pending"),
    paymentMethod: (0, pg_core_1.varchar)("payment_method", { length: 50 }),
    approvedBy: (0, pg_core_1.integer)("approved_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    approvedAt: (0, pg_core_1.timestamp)("approved_at"),
    receiptUrl: (0, pg_core_1.varchar)("receipt_url", { length: 500 }),
    receiptPublicId: (0, pg_core_1.varchar)("receipt_public_id", { length: 255 }),
    notes: (0, pg_core_1.text)("notes"),
    mpesaCheckoutRequestID: (0, pg_core_1.varchar)("mpesa_checkout_request_id", { length: 255 }),
    mpesaMerchantRequestID: (0, pg_core_1.varchar)("mpesa_merchant_request_id", { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("expense_church_idx").on(table.churchId),
    memberIdx: (0, pg_core_1.index)("expense_member_idx").on(table.memberId),
    dateIdx: (0, pg_core_1.index)("expense_date_idx").on(table.date),
    mpesaCheckoutIdx: (0, pg_core_1.index)("expense_mpesa_checkout_idx").on(table.mpesaCheckoutRequestID),
}));
exports.budgets = (0, pg_core_1.pgTable)("budgets", {
    budgetId: (0, pg_core_1.serial)("budget_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)("currency", { length: 3 }).default("USD"),
    year: (0, pg_core_1.integer)("year").notNull(),
    month: (0, pg_core_1.integer)("month"),
    isAnnual: (0, pg_core_1.boolean)("is_annual").default(false),
    attachment: (0, pg_core_1.varchar)("attachment", { length: 500 }),
    attachmentPublicId: (0, pg_core_1.varchar)("attachment_public_id", { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("budget_church_idx").on(table.churchId),
    yearIdx: (0, pg_core_1.index)("budget_year_idx").on(table.year),
}));
exports.events = (0, pg_core_1.pgTable)("events", {
    eventId: (0, pg_core_1.serial)("event_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 200 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    location: (0, pg_core_1.varchar)("location", { length: 255 }),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date"),
    status: (0, exports.eventStatusEnum)("status").default("draft"),
    isPublic: (0, pg_core_1.boolean)("is_public").default(true),
    maxAttendees: (0, pg_core_1.integer)("max_attendees"),
    imageUrl: (0, pg_core_1.varchar)("image_url", { length: 500 }),
    imagePublicId: (0, pg_core_1.varchar)("image_public_id", { length: 255 }),
    coverImageUrl: (0, pg_core_1.varchar)("cover_image_url", { length: 500 }),
    coverImagePublicId: (0, pg_core_1.varchar)("cover_image_public_id", { length: 255 }),
    gallery: (0, pg_core_1.jsonb)("gallery"),
    createdBy: (0, pg_core_1.integer)("created_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("event_church_idx").on(table.churchId),
    dateIdx: (0, pg_core_1.index)("event_date_idx").on(table.startDate),
}));
exports.eventRegistrations = (0, pg_core_1.pgTable)("event_registrations", {
    registrationId: (0, pg_core_1.serial)("registration_id").primaryKey(),
    eventId: (0, pg_core_1.integer)("event_id")
        .references(() => exports.events.eventId, { onDelete: "cascade" })
        .notNull(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "cascade" })
        .notNull(),
    attended: (0, pg_core_1.boolean)("attended").default(false),
    notes: (0, pg_core_1.text)("notes"),
    registrationImage: (0, pg_core_1.varchar)("registration_image", { length: 500 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => ({
    unique: (0, pg_core_1.unique)("unique_event_registration").on(table.eventId, table.memberId),
    eventIdx: (0, pg_core_1.index)("event_reg_event_idx").on(table.eventId),
    memberIdx: (0, pg_core_1.index)("event_reg_member_idx").on(table.memberId),
}));
exports.prayerRequests = (0, pg_core_1.pgTable)("prayer_requests", {
    prayerRequestId: (0, pg_core_1.serial)("prayer_request_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "cascade" })
        .notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 200 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    image: (0, pg_core_1.varchar)("image", { length: 500 }),
    imagePublicId: (0, pg_core_1.varchar)("image_public_id", { length: 255 }),
    status: (0, exports.prayerRequestStatusEnum)("status").default("pending"),
    visibility: (0, exports.prayerRequestVisibilityEnum)("visibility").default("public"),
    answeredAt: (0, pg_core_1.timestamp)("answered_at"),
    answerDescription: (0, pg_core_1.text)("answer_description"),
    prayerCount: (0, pg_core_1.integer)("prayer_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("prayer_church_idx").on(table.churchId),
    memberIdx: (0, pg_core_1.index)("prayer_member_idx").on(table.memberId),
    statusIdx: (0, pg_core_1.index)("prayer_status_idx").on(table.status),
}));
exports.prayerInteractions = (0, pg_core_1.pgTable)("prayer_interactions", {
    interactionId: (0, pg_core_1.serial)("interaction_id").primaryKey(),
    prayerRequestId: (0, pg_core_1.integer)("prayer_request_id")
        .references(() => exports.prayerRequests.prayerRequestId, { onDelete: "cascade" })
        .notNull(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "cascade" })
        .notNull(),
    type: (0, pg_core_1.varchar)("type", { length: 20 }).default("prayed"),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => ({
    unique: (0, pg_core_1.unique)("unique_prayer_interaction").on(table.prayerRequestId, table.memberId),
    prayerIdx: (0, pg_core_1.index)("prayer_interaction_prayer_idx").on(table.prayerRequestId),
    memberIdx: (0, pg_core_1.index)("prayer_interaction_member_idx").on(table.memberId),
}));
exports.announcements = (0, pg_core_1.pgTable)("announcements", {
    announcementId: (0, pg_core_1.serial)("announcement_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 200 }).notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    imageUrl: (0, pg_core_1.varchar)("image_url", { length: 500 }),
    imagePublicId: (0, pg_core_1.varchar)("image_public_id", { length: 255 }),
    imagePosition: (0, exports.announcementImagePositionEnum)("image_position").default("top"),
    isPublished: (0, pg_core_1.boolean)("is_published").default(false),
    publishedAt: (0, pg_core_1.timestamp)("published_at"),
    expiresAt: (0, pg_core_1.timestamp)("expires_at"),
    createdBy: (0, pg_core_1.integer)("created_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("announcement_church_idx").on(table.churchId),
    publishedIdx: (0, pg_core_1.index)("announcement_published_idx").on(table.publishedAt),
}));
exports.notifications = (0, pg_core_1.pgTable)("notifications", {
    notificationId: (0, pg_core_1.serial)("notification_id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id")
        .references(() => exports.users.userId, { onDelete: "cascade" })
        .notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 200 }).notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
    type: (0, exports.notificationTypeEnum)("type").default("info"),
    isRead: (0, pg_core_1.boolean)("is_read").default(false),
    readAt: (0, pg_core_1.timestamp)("read_at"),
    link: (0, pg_core_1.varchar)("link", { length: 255 }),
    notificationImage: (0, pg_core_1.varchar)("notification_image", { length: 500 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => ({
    userIdx: (0, pg_core_1.index)("notification_user_idx").on(table.userId),
    readIdx: (0, pg_core_1.index)("notification_read_idx").on(table.isRead),
    createdIdx: (0, pg_core_1.index)("notification_created_idx").on(table.createdAt),
}));
exports.documents = (0, pg_core_1.pgTable)("documents", {
    documentId: (0, pg_core_1.serial)("document_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 200 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    fileName: (0, pg_core_1.varchar)("file_name", { length: 255 }).notNull(),
    fileUrl: (0, pg_core_1.varchar)("file_url", { length: 500 }).notNull(),
    filePublicId: (0, pg_core_1.varchar)("file_public_id", { length: 255 }),
    fileSize: (0, pg_core_1.integer)("file_size"),
    fileType: (0, pg_core_1.varchar)("file_type", { length: 100 }),
    documentType: (0, pg_core_1.varchar)("document_type", { length: 50 }),
    visibility: (0, exports.documentVisibilityEnum)("visibility").default("members_only"),
    thumbnail: (0, pg_core_1.varchar)("thumbnail", { length: 500 }),
    thumbnailPublicId: (0, pg_core_1.varchar)("thumbnail_public_id", { length: 255 }),
    uploadedBy: (0, pg_core_1.integer)("uploaded_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    version: (0, pg_core_1.integer)("version").default(1),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("document_church_idx").on(table.churchId),
    typeIdx: (0, pg_core_1.index)("document_type_idx").on(table.documentType),
}));
exports.auditLogs = (0, pg_core_1.pgTable)("audit_logs", {
    auditId: (0, pg_core_1.serial)("audit_id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    action: (0, pg_core_1.varchar)("action", { length: 50 }).notNull(),
    entity: (0, pg_core_1.varchar)("entity", { length: 50 }).notNull(),
    entityId: (0, pg_core_1.integer)("entity_id"),
    changes: (0, pg_core_1.jsonb)("changes"),
    ipAddress: (0, pg_core_1.varchar)("ip_address", { length: 45 }),
    userAgent: (0, pg_core_1.text)("user_agent"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => ({
    userIdx: (0, pg_core_1.index)("audit_user_idx").on(table.userId),
    entityIdx: (0, pg_core_1.index)("audit_entity_idx").on(table.entity),
    createdIdx: (0, pg_core_1.index)("audit_created_idx").on(table.createdAt),
}));
exports.invitations = (0, pg_core_1.pgTable)("invitations", {
    invitationId: (0, pg_core_1.serial)("invitation_id").primaryKey(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    role: (0, exports.userRoleEnum)("role").notNull(),
    token: (0, pg_core_1.varchar)("token", { length: 255 }).notNull().unique(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    status: (0, exports.invitationStatusEnum)("status").default("pending"),
    invitedBy: (0, pg_core_1.integer)("invited_by").references(() => exports.users.userId, {
        onDelete: "set null",
    }),
    largeOrganizationId: (0, pg_core_1.integer)("large_organization_id").references(() => exports.largeOrganizations.largeOrganizationId, { onDelete: "cascade" }),
    organizationId: (0, pg_core_1.integer)("organization_id").references(() => exports.organizations.organizationId, { onDelete: "cascade" }),
    churchId: (0, pg_core_1.integer)("church_id").references(() => exports.churches.churchId, {
        onDelete: "cascade",
    }),
    acceptedAt: (0, pg_core_1.timestamp)("accepted_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    tokenIdx: (0, pg_core_1.index)("invitation_token_idx").on(table.token),
    emailIdx: (0, pg_core_1.index)("invitation_email_idx").on(table.email),
    statusIdx: (0, pg_core_1.index)("invitation_status_idx").on(table.status),
}));
exports.groups = (0, pg_core_1.pgTable)("groups", {
    groupId: (0, pg_core_1.serial)("group_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    type: (0, pg_core_1.varchar)("type", { length: 50 }),
    leaderId: (0, pg_core_1.integer)("leader_id").references(() => exports.members.memberId, {
        onDelete: "set null",
    }),
    meetingDay: (0, pg_core_1.integer)("meeting_day"),
    meetingTime: (0, pg_core_1.timestamp)("meeting_time"),
    location: (0, pg_core_1.varchar)("location", { length: 255 }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("group_church_idx").on(table.churchId),
}));
exports.groupJoinRequests = (0, pg_core_1.pgTable)("group_join_requests", {
    requestId: (0, pg_core_1.serial)("request_id").primaryKey(),
    groupId: (0, pg_core_1.integer)("group_id")
        .references(() => exports.groups.groupId, { onDelete: "cascade" })
        .notNull(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "cascade" })
        .notNull(),
    message: (0, pg_core_1.text)("message"),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("pending"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    groupIdx: (0, pg_core_1.index)("join_req_group_idx").on(table.groupId),
    memberIdx: (0, pg_core_1.index)("join_req_member_idx").on(table.memberId),
    statusIdx: (0, pg_core_1.index)("join_req_status_idx").on(table.status),
}));
exports.groupMembers = (0, pg_core_1.pgTable)("group_members", {
    groupMemberId: (0, pg_core_1.serial)("group_member_id").primaryKey(),
    groupId: (0, pg_core_1.integer)("group_id")
        .references(() => exports.groups.groupId, { onDelete: "cascade" })
        .notNull(),
    memberId: (0, pg_core_1.integer)("member_id")
        .references(() => exports.members.memberId, { onDelete: "cascade" })
        .notNull(),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").defaultNow().notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    role: (0, pg_core_1.varchar)("role", { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => ({
    unique: (0, pg_core_1.unique)("unique_group_member").on(table.groupId, table.memberId),
    groupIdx: (0, pg_core_1.index)("group_member_group_idx").on(table.groupId),
    memberIdx: (0, pg_core_1.index)("group_member_member_idx").on(table.memberId),
}));
exports.sermons = (0, pg_core_1.pgTable)("sermons", {
    sermonId: (0, pg_core_1.serial)("sermon_id").primaryKey(),
    churchId: (0, pg_core_1.integer)("church_id")
        .references(() => exports.churches.churchId, { onDelete: "cascade" })
        .notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 200 }).notNull(),
    speaker: (0, pg_core_1.varchar)("speaker", { length: 100 }).notNull(),
    topic: (0, pg_core_1.varchar)("topic", { length: 100 }),
    scripture: (0, pg_core_1.varchar)("scripture", { length: 255 }),
    description: (0, pg_core_1.text)("description"),
    videoUrl: (0, pg_core_1.varchar)("video_url", { length: 500 }),
    videoPublicId: (0, pg_core_1.varchar)("video_public_id", { length: 255 }),
    audioUrl: (0, pg_core_1.varchar)("audio_url", { length: 500 }),
    audioPublicId: (0, pg_core_1.varchar)("audio_public_id", { length: 255 }),
    notes: (0, pg_core_1.text)("notes"),
    preachedAt: (0, pg_core_1.timestamp)("preached_at").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    churchIdx: (0, pg_core_1.index)("sermon_church_idx").on(table.churchId),
    dateIdx: (0, pg_core_1.index)("sermon_date_idx").on(table.preachedAt),
}));
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one, many }) => ({
    unregisteredUsers: many(exports.unregisteredUsers),
    createdBy: one(exports.users, {
        fields: [exports.users.createdBy],
        references: [exports.users.userId],
    }),
    largeOrganizations: many(exports.largeOrganizations),
    organizations: many(exports.organizations),
    churches: many(exports.churches),
    members: many(exports.members),
    notifications: many(exports.notifications),
    auditLogs: many(exports.auditLogs),
    invitations: many(exports.invitations),
}));
exports.largeOrganizationsRelations = (0, drizzle_orm_1.relations)(exports.largeOrganizations, ({ one, many }) => ({
    organizations: many(exports.organizations),
    createdBy: one(exports.users, {
        fields: [exports.largeOrganizations.createdBy],
        references: [exports.users.userId],
    }),
}));
exports.organizationsRelations = (0, drizzle_orm_1.relations)(exports.organizations, ({ one, many }) => ({
    largeOrganization: one(exports.largeOrganizations, {
        fields: [exports.organizations.largeOrganizationId],
        references: [exports.largeOrganizations.largeOrganizationId],
    }),
    churches: many(exports.churches),
    createdBy: one(exports.users, {
        fields: [exports.organizations.createdBy],
        references: [exports.users.userId],
    }),
}));
exports.churchesRelations = (0, drizzle_orm_1.relations)(exports.churches, ({ one, many }) => ({
    organization: one(exports.organizations, {
        fields: [exports.churches.organizationId],
        references: [exports.organizations.organizationId],
    }),
    members: many(exports.members),
    positions: many(exports.positions),
    services: many(exports.services),
    visitors: many(exports.visitors),
    giving: many(exports.giving),
    givingCategories: many(exports.givingCategories),
    expenses: many(exports.expenses),
    expenseCategories: many(exports.expenseCategories),
    budgets: many(exports.budgets),
    events: many(exports.events),
    prayerRequests: many(exports.prayerRequests),
    announcements: many(exports.announcements),
    documents: many(exports.documents),
    groups: many(exports.groups),
    sermons: many(exports.sermons),
    departments: many(exports.departments),
    createdBy: one(exports.users, {
        fields: [exports.churches.createdBy],
        references: [exports.users.userId],
    }),
}));
exports.membersRelations = (0, drizzle_orm_1.relations)(exports.members, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.members.userId],
        references: [exports.users.userId],
    }),
    church: one(exports.churches, {
        fields: [exports.members.churchId],
        references: [exports.churches.churchId],
    }),
    leaders: many(exports.leaders),
    attendance: many(exports.attendance),
    giving: many(exports.giving),
    pledges: many(exports.pledges),
    eventRegistrations: many(exports.eventRegistrations),
    prayerRequests: many(exports.prayerRequests),
    prayerInteractions: many(exports.prayerInteractions),
    groupMembers: many(exports.groupMembers),
    departmentMembers: many(exports.departmentMembers),
}));
exports.positionsRelations = (0, drizzle_orm_1.relations)(exports.positions, ({ one, many }) => ({
    church: one(exports.churches, {
        fields: [exports.positions.churchId],
        references: [exports.churches.churchId],
    }),
    organization: one(exports.organizations, {
        fields: [exports.positions.organizationId],
        references: [exports.organizations.organizationId],
    }),
    largeOrganization: one(exports.largeOrganizations, {
        fields: [exports.positions.largeOrganizationId],
        references: [exports.largeOrganizations.largeOrganizationId],
    }),
    leaders: many(exports.leaders),
    departmentMembers: many(exports.departmentMembers),
}));
exports.leadersRelations = (0, drizzle_orm_1.relations)(exports.leaders, ({ one }) => ({
    member: one(exports.members, {
        fields: [exports.leaders.memberId],
        references: [exports.members.memberId],
    }),
    position: one(exports.positions, {
        fields: [exports.leaders.positionId],
        references: [exports.positions.positionId],
    }),
    approvedBy: one(exports.users, {
        fields: [exports.leaders.approvedBy],
        references: [exports.users.userId],
    }),
}));
exports.departmentsRelations = (0, drizzle_orm_1.relations)(exports.departments, ({ one, many }) => ({
    largeOrganization: one(exports.largeOrganizations, {
        fields: [exports.departments.largeOrganizationId],
        references: [exports.largeOrganizations.largeOrganizationId],
    }),
    organization: one(exports.organizations, {
        fields: [exports.departments.organizationId],
        references: [exports.organizations.organizationId],
    }),
    church: one(exports.churches, {
        fields: [exports.departments.churchId],
        references: [exports.churches.churchId],
    }),
    parent: one(exports.departments, {
        fields: [exports.departments.parentDepartmentId],
        references: [exports.departments.departmentId],
    }),
    children: many(exports.departments, { relationName: "children" }),
    leader: one(exports.members, {
        fields: [exports.departments.leaderId],
        references: [exports.members.memberId],
    }),
    departmentMembers: many(exports.departmentMembers),
}));
exports.departmentMembersRelations = (0, drizzle_orm_1.relations)(exports.departmentMembers, ({ one }) => ({
    department: one(exports.departments, {
        fields: [exports.departmentMembers.departmentId],
        references: [exports.departments.departmentId],
    }),
    member: one(exports.members, {
        fields: [exports.departmentMembers.memberId],
        references: [exports.members.memberId],
    }),
    position: one(exports.positions, {
        fields: [exports.departmentMembers.positionId],
        references: [exports.positions.positionId],
    }),
}));
exports.servicesRelations = (0, drizzle_orm_1.relations)(exports.services, ({ one, many }) => ({
    church: one(exports.churches, {
        fields: [exports.services.churchId],
        references: [exports.churches.churchId],
    }),
    attendance: many(exports.attendance),
}));
exports.attendanceRelations = (0, drizzle_orm_1.relations)(exports.attendance, ({ one }) => ({
    member: one(exports.members, {
        fields: [exports.attendance.memberId],
        references: [exports.members.memberId],
    }),
    service: one(exports.services, {
        fields: [exports.attendance.serviceId],
        references: [exports.services.serviceId],
    }),
}));
exports.givingRelations = (0, drizzle_orm_1.relations)(exports.giving, ({ one }) => ({
    member: one(exports.members, {
        fields: [exports.giving.memberId],
        references: [exports.members.memberId],
    }),
    church: one(exports.churches, {
        fields: [exports.giving.churchId],
        references: [exports.churches.churchId],
    }),
    category: one(exports.givingCategories, {
        fields: [exports.giving.categoryId],
        references: [exports.givingCategories.categoryId],
    }),
}));
exports.expensesRelations = (0, drizzle_orm_1.relations)(exports.expenses, ({ one }) => ({
    church: one(exports.churches, {
        fields: [exports.expenses.churchId],
        references: [exports.churches.churchId],
    }),
    member: one(exports.members, {
        fields: [exports.expenses.memberId],
        references: [exports.members.memberId],
    }),
    category: one(exports.expenseCategories, {
        fields: [exports.expenses.categoryId],
        references: [exports.expenseCategories.categoryId],
    }),
    approvedBy: one(exports.users, {
        fields: [exports.expenses.approvedBy],
        references: [exports.users.userId],
    }),
}));
exports.eventsRelations = (0, drizzle_orm_1.relations)(exports.events, ({ one, many }) => ({
    church: one(exports.churches, {
        fields: [exports.events.churchId],
        references: [exports.churches.churchId],
    }),
    createdBy: one(exports.users, {
        fields: [exports.events.createdBy],
        references: [exports.users.userId],
    }),
    registrations: many(exports.eventRegistrations),
}));
exports.prayerRequestsRelations = (0, drizzle_orm_1.relations)(exports.prayerRequests, ({ one, many }) => ({
    church: one(exports.churches, {
        fields: [exports.prayerRequests.churchId],
        references: [exports.churches.churchId],
    }),
    member: one(exports.members, {
        fields: [exports.prayerRequests.memberId],
        references: [exports.members.memberId],
    }),
    interactions: many(exports.prayerInteractions),
}));
exports.announcementsRelations = (0, drizzle_orm_1.relations)(exports.announcements, ({ one }) => ({
    church: one(exports.churches, {
        fields: [exports.announcements.churchId],
        references: [exports.churches.churchId],
    }),
    createdBy: one(exports.users, {
        fields: [exports.announcements.createdBy],
        references: [exports.users.userId],
    }),
}));
exports.notificationsRelations = (0, drizzle_orm_1.relations)(exports.notifications, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.notifications.userId],
        references: [exports.users.userId],
    }),
}));
exports.documentsRelations = (0, drizzle_orm_1.relations)(exports.documents, ({ one }) => ({
    church: one(exports.churches, {
        fields: [exports.documents.churchId],
        references: [exports.churches.churchId],
    }),
    uploadedBy: one(exports.users, {
        fields: [exports.documents.uploadedBy],
        references: [exports.users.userId],
    }),
}));
exports.auditLogsRelations = (0, drizzle_orm_1.relations)(exports.auditLogs, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.auditLogs.userId],
        references: [exports.users.userId],
    }),
}));
exports.groupsRelations = (0, drizzle_orm_1.relations)(exports.groups, ({ one, many }) => ({
    church: one(exports.churches, {
        fields: [exports.groups.churchId],
        references: [exports.churches.churchId],
    }),
    leader: one(exports.members, {
        fields: [exports.groups.leaderId],
        references: [exports.members.memberId],
    }),
    groupMembers: many(exports.groupMembers),
    joinRequests: many(exports.groupJoinRequests),
}));
exports.groupMembersRelations = (0, drizzle_orm_1.relations)(exports.groupMembers, ({ one }) => ({
    group: one(exports.groups, {
        fields: [exports.groupMembers.groupId],
        references: [exports.groups.groupId],
    }),
    member: one(exports.members, {
        fields: [exports.groupMembers.memberId],
        references: [exports.members.memberId],
    }),
}));
exports.groupJoinRequestsRelations = (0, drizzle_orm_1.relations)(exports.groupJoinRequests, ({ one }) => ({
    group: one(exports.groups, {
        fields: [exports.groupJoinRequests.groupId],
        references: [exports.groups.groupId],
    }),
    member: one(exports.members, {
        fields: [exports.groupJoinRequests.memberId],
        references: [exports.members.memberId],
    }),
}));
exports.sermonsRelations = (0, drizzle_orm_1.relations)(exports.sermons, ({ one }) => ({
    church: one(exports.churches, {
        fields: [exports.sermons.churchId],
        references: [exports.churches.churchId],
    }),
}));
