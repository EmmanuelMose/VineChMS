import db from "../Drizzle/db";
import { attendance, members, users, services } from "../Drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const createAttendanceService = async (data: any) => {
  const pool = db.$client;
  
  const query = `
    INSERT INTO attendance (
      member_id, 
      service_id, 
      date, 
      attended, 
      check_in_time, 
      check_out_time, 
      notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )
    RETURNING *
  `;

  const values = [
    Number(data.memberId),
    Number(data.serviceId),
    data.date || new Date().toISOString(),
    data.attended !== undefined ? Boolean(data.attended) : true,
    data.checkInTime || null,
    data.checkOutTime || null,
    data.notes || null
  ];

  console.log('📝 Query:', query);
  console.log('📊 Values:', values);

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAttendanceService = async (churchId?: number) => {
  if (churchId) {
    return await db
      .select({
        attendanceId: attendance.attendanceId,
        memberId: attendance.memberId,
        serviceId: attendance.serviceId,
        date: attendance.date,
        attended: attendance.attended,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        notes: attendance.notes,
        createdAt: attendance.createdAt,
        fullName: users.fullName,
        serviceName: services.name,
        churchId: services.churchId,
      })
      .from(attendance)
      .leftJoin(members, eq(attendance.memberId, members.memberId))
      .leftJoin(users, eq(members.userId, users.userId))
      .leftJoin(services, eq(attendance.serviceId, services.serviceId))
      .where(eq(services.churchId, churchId))
      .orderBy(desc(attendance.date));
  }
  return await db
    .select({
      attendanceId: attendance.attendanceId,
      memberId: attendance.memberId,
      serviceId: attendance.serviceId,
      date: attendance.date,
      attended: attendance.attended,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      notes: attendance.notes,
      createdAt: attendance.createdAt,
      fullName: users.fullName,
      serviceName: services.name,
    })
    .from(attendance)
    .leftJoin(members, eq(attendance.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .leftJoin(services, eq(attendance.serviceId, services.serviceId))
    .orderBy(desc(attendance.date));
};

export const getAttendanceByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(attendance)
    .where(eq(attendance.attendanceId, id));
  if (!result) throw new Error("Attendance record not found");
  return result;
};

export const getAttendanceByMemberService = async (memberId: number) => {
  return await db
    .select()
    .from(attendance)
    .where(eq(attendance.memberId, memberId))
    .orderBy(desc(attendance.date));
};

export const getAttendanceByServiceService = async (serviceId: number) => {
  return await db
    .select()
    .from(attendance)
    .where(eq(attendance.serviceId, serviceId))
    .orderBy(desc(attendance.date));
};

export const updateAttendanceService = async (id: number, data: any) => {
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.date !== undefined) {
    updates.push(`date = $${paramIndex}`);
    values.push(data.date || null);
    paramIndex++;
  }
  if (data.checkInTime !== undefined) {
    updates.push(`check_in_time = $${paramIndex}`);
    values.push(data.checkInTime || null);
    paramIndex++;
  }
  if (data.checkOutTime !== undefined) {
    updates.push(`check_out_time = $${paramIndex}`);
    values.push(data.checkOutTime || null);
    paramIndex++;
  }
  if (data.attended !== undefined) {
    updates.push(`attended = $${paramIndex}`);
    values.push(Boolean(data.attended));
    paramIndex++;
  }
  if (data.notes !== undefined) {
    updates.push(`notes = $${paramIndex}`);
    values.push(data.notes || null);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE attendance 
    SET ${updates.join(', ')} 
    WHERE attendance_id = $${paramIndex}
    RETURNING *
  `;

  console.log('📝 Update Query:', query);
  console.log('📊 Update Values:', values);

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Attendance record not found");
  return result.rows[0];
};

export const deleteAttendanceService = async (id: number) => {
  const [result] = await db
    .delete(attendance)
    .where(eq(attendance.attendanceId, id))
    .returning({ id: attendance.attendanceId });
  if (!result) throw new Error("Attendance record not found");
  return result;
};

export const getAttendanceByDateService = async (date: string) => {
  const pool = db.$client;
  const query = `
    SELECT * FROM attendance 
    WHERE date::date = $1::date
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [date]);
  return result.rows;
};

export const getAttendanceSummaryService = async (serviceId: number) => {
  const allAttendance = await db
    .select()
    .from(attendance)
    .where(eq(attendance.serviceId, serviceId));

  const total = allAttendance.length;
  const present = allAttendance.filter(a => a.attended).length;
  const absent = allAttendance.filter(a => !a.attended).length;

  return {
    total,
    present,
    absent,
    attendanceRate: total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0,
  };
};

export const getAttendanceByMemberAndServiceService = async (memberId: number, serviceId: number) => {
  return await db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.memberId, memberId),
        eq(attendance.serviceId, serviceId)
      )
    )
    .orderBy(desc(attendance.date));
};