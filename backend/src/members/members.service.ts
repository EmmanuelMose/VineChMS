import db from "../Drizzle/db";
import { members, users } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const getMembersService = async () => {
  return await db
    .select()
    .from(members)
    .orderBy(desc(members.createdAt));
};

export const getMembersByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(members)
    .where(eq(members.churchId, churchId))
    .orderBy(desc(members.createdAt));
};

export const getMembersByOrganizationService = async (organizationId: number) => {
  return await db
    .select()
    .from(members)
    .where(eq(members.organizationId, organizationId))
    .orderBy(desc(members.createdAt));
};

export const getMembersByLargeOrganizationService = async (largeOrganizationId: number) => {
  return await db
    .select()
    .from(members)
    .where(eq(members.largeOrganizationId, largeOrganizationId))
    .orderBy(desc(members.createdAt));
};

export const getMemberByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(members)
    .where(eq(members.memberId, id));
  if (!result) throw new Error("Member not found");
  return result;
};

export const getMemberByUserIdService = async (userId: number) => {
  const [result] = await db
    .select()
    .from(members)
    .where(eq(members.userId, userId));
  if (!result) throw new Error("Member not found");
  return result;
};

export const updateMemberService = async (id: number, data: any) => {
  const [existingMember] = await db
    .select()
    .from(members)
    .where(eq(members.memberId, id));

  if (!existingMember) {
    throw new Error("Member not found");
  }

  const memberFields: any = {};
  if (data.fullName !== undefined) memberFields.fullName = data.fullName;
  if (data.email !== undefined) memberFields.email = data.email;
  if (data.membershipNumber !== undefined) memberFields.membershipNumber = data.membershipNumber;
  if (data.isActive !== undefined) memberFields.isActive = data.isActive;
  if (data.isBaptized !== undefined) memberFields.isBaptized = data.isBaptized;
  if (data.isConfirmed !== undefined) memberFields.isConfirmed = data.isConfirmed;
  if (data.isLeader !== undefined) memberFields.isLeader = data.isLeader;
  if (data.notes !== undefined) memberFields.notes = data.notes;
  if (data.role !== undefined) memberFields.role = data.role;

  const userFields: any = {};
  if (data.fullName !== undefined) userFields.fullName = data.fullName;
  if (data.email !== undefined) userFields.email = data.email;
  if (data.phone !== undefined) userFields.phone = data.phone;
  if (data.gender !== undefined) userFields.gender = data.gender;

  // 🔥 FIX: Safe date conversion – avoid "toISOString is not a function"
  if (data.dateOfBirth !== undefined) {
    if (data.dateOfBirth === "" || data.dateOfBirth === null) {
      userFields.dateOfBirth = null;
    } else {
      const date = new Date(data.dateOfBirth);
      if (!isNaN(date.getTime())) {
        userFields.dateOfBirth = date;
      } else {
        userFields.dateOfBirth = null; // fallback to null if invalid
      }
    }
  }

  if (data.maritalStatus !== undefined) userFields.maritalStatus = data.maritalStatus;
  if (data.occupation !== undefined) userFields.occupation = data.occupation;
  if (data.address !== undefined) userFields.address = data.address;
  if (data.profilePicture !== undefined) userFields.profilePicture = data.profilePicture;
  if (data.profilePicturePublicId !== undefined) userFields.profilePicturePublicId = data.profilePicturePublicId;
  if (data.role !== undefined) userFields.role = data.role;

  if (Object.keys(memberFields).length > 0) {
    await db
      .update(members)
      .set({ ...memberFields, updatedAt: new Date() })
      .where(eq(members.memberId, id));
  }

  if (Object.keys(userFields).length > 0) {
    if (existingMember.userId == null) {
      throw new Error("Member has no associated user");
    }
    await db
      .update(users)
      .set({ ...userFields, updatedAt: new Date() })
      .where(eq(users.userId, existingMember.userId));
  }

  const [updatedMember] = await db
    .select()
    .from(members)
    .where(eq(members.memberId, id));

  return updatedMember;
};

export const upgradeMemberRoleService = async (memberId: number, newRole: string, updatedBy: number) => {
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.memberId, memberId));
  
  if (!member) throw new Error("Member not found");

  const validRoles = ["pastor", "elder", "treasurer", "secretary", "church_member"];
  if (!validRoles.includes(newRole)) {
    throw new Error("Invalid role. Valid roles: pastor, elder, treasurer, secretary, church_member");
  }

  const [updatedMember] = await db
    .update(members)
    .set({ 
      role: newRole as any,
      updatedAt: new Date(),
      isLeader: newRole !== "church_member" 
    })
    .where(eq(members.memberId, memberId))
    .returning();

  let updatedUser = null;
  let newToken = null;

  if (member.userId) {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.userId, member.userId));
    
    if (existingUser) {
      [updatedUser] = await db
        .update(users)
        .set({ 
          role: newRole as any,
          updatedAt: new Date()
        })
        .where(eq(users.userId, member.userId))
        .returning();

      newToken = jwt.sign(
        {
          userId: updatedUser.userId,
          role: updatedUser.role,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          churchId: updatedUser.churchId,
          organizationId: updatedUser.organizationId,
          largeOrganizationId: updatedUser.largeOrganizationId,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
    }
  }

  return { 
    member: updatedMember, 
    user: updatedUser,
    newToken: newToken,
    updatedUser: updatedUser ? {
      userId: updatedUser.userId,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
      churchId: updatedUser.churchId,
      organizationId: updatedUser.organizationId,
      largeOrganizationId: updatedUser.largeOrganizationId,
      isActive: updatedUser.isActive,
      isVerified: updatedUser.isVerified,
    } : null
  };
};

export const deleteMemberService = async (id: number) => {
  const [result] = await db
    .delete(members)
    .where(eq(members.memberId, id))
    .returning({ id: members.memberId });
  if (!result) throw new Error("Member not found");
  return result;
};