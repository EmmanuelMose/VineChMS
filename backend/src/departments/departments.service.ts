import db from "../Drizzle/db";
import { departments, departmentMembers, members, positions, users } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const createDepartmentService = async (data: {
  name: string;
  description?: string | null;
  type: "large_org_department" | "org_department" | "church_department";
  largeOrganizationId?: number | null;
  organizationId?: number | null;
  churchId?: number | null;
  parentDepartmentId?: number | null;
  leaderId?: number | null;
  isActive?: boolean;
}) => {
  const [result] = await db
    .insert(departments)
    .values({
      name: data.name,
      description: data.description || null,
      type: data.type,
      largeOrganizationId: data.largeOrganizationId || null,
      organizationId: data.organizationId || null,
      churchId: data.churchId || null,
      parentDepartmentId: data.parentDepartmentId || null,
      leaderId: data.leaderId || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    })
    .returning();
  return result;
};

export const getDepartmentsService = async () => {
  return await db
    .select({
      departmentId: departments.departmentId,
      name: departments.name,
      description: departments.description,
      type: departments.type,
      largeOrganizationId: departments.largeOrganizationId,
      organizationId: departments.organizationId,
      churchId: departments.churchId,
      parentDepartmentId: departments.parentDepartmentId,
      leaderId: departments.leaderId,
      isActive: departments.isActive,
      createdAt: departments.createdAt,
      updatedAt: departments.updatedAt,
    })
    .from(departments)
    .orderBy(desc(departments.createdAt));
};

export const getDepartmentByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(departments)
    .where(eq(departments.departmentId, id));
  if (!result) throw new Error("Department not found");
  return result;
};

export const getDepartmentsByLargeOrganizationService = async (largeOrganizationId: number) => {
  return await db
    .select()
    .from(departments)
    .where(eq(departments.largeOrganizationId, largeOrganizationId))
    .orderBy(desc(departments.createdAt));
};

export const getDepartmentsByOrganizationService = async (organizationId: number) => {
  return await db
    .select()
    .from(departments)
    .where(eq(departments.organizationId, organizationId))
    .orderBy(desc(departments.createdAt));
};

export const getDepartmentsByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(departments)
    .where(eq(departments.churchId, churchId))
    .orderBy(desc(departments.createdAt));
};

export const getSubDepartmentsService = async (parentDepartmentId: number) => {
  return await db
    .select()
    .from(departments)
    .where(eq(departments.parentDepartmentId, parentDepartmentId))
    .orderBy(desc(departments.createdAt));
};

export const updateDepartmentService = async (id: number, data: any) => {
  const [result] = await db
    .update(departments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(departments.departmentId, id))
    .returning();
  if (!result) throw new Error("Department not found");
  return result;
};

export const deleteDepartmentService = async (id: number) => {
  const [result] = await db
    .delete(departments)
    .where(eq(departments.departmentId, id))
    .returning({ id: departments.departmentId });
  if (!result) throw new Error("Department not found");
  return result;
};

export const addMemberToDepartmentService = async (data: {
  departmentId: number;
  memberId: number;
  positionId?: number | null;
  role?: string | null;
  isActive?: boolean;
}) => {
  const existing = await db
    .select()
    .from(departmentMembers)
    .where(
      and(
        eq(departmentMembers.departmentId, data.departmentId),
        eq(departmentMembers.memberId, data.memberId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Member already in this department");
  }

  const [result] = await db
    .insert(departmentMembers)
    .values({
      departmentId: data.departmentId,
      memberId: data.memberId,
      positionId: data.positionId || null,
      role: data.role || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      joinedAt: new Date(),
    })
    .returning();
  return result;
};

export const getDepartmentMembersService = async (departmentId: number) => {
  return await db
    .select({
      departmentMemberId: departmentMembers.departmentMemberId,
      departmentId: departmentMembers.departmentId,
      memberId: departmentMembers.memberId,
      fullName: members.fullName,
      email: members.email,
      positionId: departmentMembers.positionId,
      positionName: positions.name,
      role: departmentMembers.role,
      isActive: departmentMembers.isActive,
      joinedAt: departmentMembers.joinedAt,
    })
    .from(departmentMembers)
    .leftJoin(members, eq(departmentMembers.memberId, members.memberId))
    .leftJoin(positions, eq(departmentMembers.positionId, positions.positionId))
    .where(eq(departmentMembers.departmentId, departmentId))
    .orderBy(desc(departmentMembers.joinedAt));
};

export const removeMemberFromDepartmentService = async (departmentMemberId: number) => {
  const [result] = await db
    .delete(departmentMembers)
    .where(eq(departmentMembers.departmentMemberId, departmentMemberId))
    .returning({ id: departmentMembers.departmentMemberId });
  if (!result) throw new Error("Department member not found");
  return result;
};

export const updateDepartmentMemberService = async (id: number, data: any) => {
  const [result] = await db
    .update(departmentMembers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(departmentMembers.departmentMemberId, id))
    .returning();
  if (!result) throw new Error("Department member not found");
  return result;
};