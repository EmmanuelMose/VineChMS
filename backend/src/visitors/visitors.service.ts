import db from "../Drizzle/db";
import { visitors, members, users, services } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createVisitorService = async (data: any) => {
  const pool = db.$client;
  
  const query = `
    INSERT INTO visitors (
      church_id,
      full_name,
      email,
      phone,
      address,
      profile_picture,
      visited_date,
      service_id,
      is_member,
      member_id,
      notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    )
    RETURNING *
  `;

  const values = [
    Number(data.churchId),
    data.fullName,
    data.email || null,
    data.phone || null,
    data.address || null,
    data.profilePicture || null,
    data.visitedDate || new Date().toISOString(),
    data.serviceId ? Number(data.serviceId) : null,
    data.isMember !== undefined ? Boolean(data.isMember) : false,
    data.memberId ? Number(data.memberId) : null,
    data.notes || null
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getVisitorsService = async () => {
  return await db
    .select({
      visitorId: visitors.visitorId,
      fullName: visitors.fullName,
      email: visitors.email,
      phone: visitors.phone,
      visitedDate: visitors.visitedDate,
      serviceName: services.name,
      isMember: visitors.isMember,
      notes: visitors.notes,
      createdAt: visitors.createdAt,
    })
    .from(visitors)
    .leftJoin(services, eq(visitors.serviceId, services.serviceId))
    .orderBy(desc(visitors.visitedDate));
};

export const getVisitorByIdService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid visitor ID");
  }
  const [result] = await db
    .select()
    .from(visitors)
    .where(eq(visitors.visitorId, id));
  if (!result) throw new Error("Visitor not found");
  return result;
};

export const getVisitorsByChurchService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(visitors)
    .where(eq(visitors.churchId, churchId))
    .orderBy(desc(visitors.visitedDate));
};

export const getVisitorsByServiceService = async (serviceId: number) => {
  if (!serviceId || isNaN(serviceId)) {
    throw new Error("Invalid service ID");
  }
  return await db
    .select()
    .from(visitors)
    .where(eq(visitors.serviceId, serviceId))
    .orderBy(desc(visitors.visitedDate));
};

export const getVisitorsByDateRangeService = async (churchId: number, startDate: string, endDate: string) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  const pool = db.$client;
  
  const query = `
    SELECT *
    FROM visitors
    WHERE church_id = $1
      AND visited_date::date >= $2::date
      AND visited_date::date <= $3::date
    ORDER BY visited_date DESC
  `;
  
  const result = await pool.query(query, [churchId, startDate, endDate]);
  return result.rows;
};

export const updateVisitorService = async (id: number, data: any) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid visitor ID");
  }
  
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.fullName !== undefined) {
    updates.push(`full_name = $${paramIndex}`);
    values.push(data.fullName);
    paramIndex++;
  }
  if (data.email !== undefined) {
    updates.push(`email = $${paramIndex}`);
    values.push(data.email);
    paramIndex++;
  }
  if (data.phone !== undefined) {
    updates.push(`phone = $${paramIndex}`);
    values.push(data.phone);
    paramIndex++;
  }
  if (data.address !== undefined) {
    updates.push(`address = $${paramIndex}`);
    values.push(data.address);
    paramIndex++;
  }
  if (data.profilePicture !== undefined) {
    updates.push(`profile_picture = $${paramIndex}`);
    values.push(data.profilePicture);
    paramIndex++;
  }
  if (data.visitedDate !== undefined) {
    updates.push(`visited_date = $${paramIndex}`);
    values.push(data.visitedDate);
    paramIndex++;
  }
  if (data.serviceId !== undefined) {
    updates.push(`service_id = $${paramIndex}`);
    values.push(data.serviceId ? Number(data.serviceId) : null);
    paramIndex++;
  }
  if (data.isMember !== undefined) {
    updates.push(`is_member = $${paramIndex}`);
    values.push(Boolean(data.isMember));
    paramIndex++;
  }
  if (data.memberId !== undefined) {
    updates.push(`member_id = $${paramIndex}`);
    values.push(data.memberId ? Number(data.memberId) : null);
    paramIndex++;
  }
  if (data.notes !== undefined) {
    updates.push(`notes = $${paramIndex}`);
    values.push(data.notes);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE visitors 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE visitor_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Visitor not found");
  return result.rows[0];
};

export const deleteVisitorService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid visitor ID");
  }
  const [result] = await db
    .delete(visitors)
    .where(eq(visitors.visitorId, id))
    .returning({ id: visitors.visitorId });
  if (!result) throw new Error("Visitor not found");
  return result;
};

export const convertVisitorToMemberService = async (id: number, data: any) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid visitor ID");
  }
  
  const pool = db.$client;
  
  const visitorResult = await pool.query(
    'SELECT * FROM visitors WHERE visitor_id = $1',
    [id]
  );
  
  if (visitorResult.rows.length === 0) {
    throw new Error("Visitor not found");
  }
  
  const visitor = visitorResult.rows[0];
  
  const existingMember = await pool.query(
    'SELECT member_id FROM members WHERE email = $1',
    [visitor.email]
  );
  
  if (existingMember.rows.length > 0) {
    throw new Error("Member with this email already exists");
  }
  
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  const membershipNumber = `CH${visitor.church_id}-${year}-${random}`;
  
  const memberQuery = `
    INSERT INTO members (
      church_id,
      email,
      full_name,
      phone,
      role,
      membership_number,
      is_active,
      notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    RETURNING *
  `;
  
  const memberValues = [
    visitor.church_id,
    visitor.email || null,
    visitor.full_name,
    visitor.phone || null,
    data.role || 'church_member',
    membershipNumber,
    data.isActive !== undefined ? Boolean(data.isActive) : true,
    data.notes || null
  ];
  
  const memberResult = await pool.query(memberQuery, memberValues);
  const member = memberResult.rows[0];
  
  await pool.query(
    'UPDATE visitors SET is_member = true, member_id = $1, updated_at = NOW() WHERE visitor_id = $2',
    [member.member_id, id]
  );
  
  return {
    member,
    visitor: { ...visitor, is_member: true, member_id: member.member_id }
  };
};