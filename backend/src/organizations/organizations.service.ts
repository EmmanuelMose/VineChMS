import db from "../Drizzle/db";
import { largeOrganizations, organizations } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

// LARGE ORGANIZATIONS
export const createLargeOrganizationService = async (userId: number, data: any) => {
  const [result] = await db
    .insert(largeOrganizations)
    .values({ ...data, createdBy: userId })
    .returning();
  return result;
};

export const getLargeOrganizationsService = async (userId?: number) => {
  if (userId) {
    return await db
      .select()
      .from(largeOrganizations)
      .where(eq(largeOrganizations.createdBy, userId))
      .orderBy(desc(largeOrganizations.createdAt));
  }
  return await db
    .select()
    .from(largeOrganizations)
    .orderBy(desc(largeOrganizations.createdAt));
};

export const getLargeOrganizationByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(largeOrganizations)
    .where(eq(largeOrganizations.largeOrganizationId, id));
  if (!result) throw new Error("Large organization not found");
  return result;
};

export const updateLargeOrganizationService = async (id: number, data: any) => {
  const [result] = await db
    .update(largeOrganizations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(largeOrganizations.largeOrganizationId, id))
    .returning();
  if (!result) throw new Error("Large organization not found");
  return result;
};

export const deleteLargeOrganizationService = async (id: number) => {
  const [result] = await db
    .delete(largeOrganizations)
    .where(eq(largeOrganizations.largeOrganizationId, id))
    .returning({ id: largeOrganizations.largeOrganizationId });
  if (!result) throw new Error("Large organization not found");
  return result;
};

// SMALL ORGANIZATIONS
export const createOrganizationService = async (userId: number, data: any) => {
  const [result] = await db
    .insert(organizations)
    .values({ ...data, createdBy: userId })
    .returning();
  return result;
};

export const getOrganizationsService = async (userId: number) => {
  return await db
    .select()
    .from(organizations)
    .where(eq(organizations.createdBy, userId))
    .orderBy(desc(organizations.createdAt));
};

export const getOrganizationsByLargeOrganizationService = async (largeOrganizationId: number) => {
  return await db
    .select()
    .from(organizations)
    .where(eq(organizations.largeOrganizationId, largeOrganizationId))
    .orderBy(desc(organizations.createdAt));
};

export const getOrganizationByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.organizationId, id));
  if (!result) throw new Error("Organization not found");
  return result;
};

export const updateOrganizationService = async (id: number, data: any) => {
  const [result] = await db
    .update(organizations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(organizations.organizationId, id))
    .returning();
  if (!result) throw new Error("Organization not found");
  return result;
};

export const deleteOrganizationService = async (id: number) => {
  const [result] = await db
    .delete(organizations)
    .where(eq(organizations.organizationId, id))
    .returning({ id: organizations.organizationId });
  if (!result) throw new Error("Organization not found");
  return result;
};