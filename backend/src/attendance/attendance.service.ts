import db from "../Drizzle/db";
import { attendance, members, users, services } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const createAttendanceService = async (data: any) => {
  const [result] = await db
    .insert(attendance)
    .values(data)
    .returning();
  return result;
};

export const getAttendanceService = async () => {
  return await db
    .select({
      attendanceId: attendance.attendanceId,
      memberId: attendance.memberId,
      fullName: users.fullName,
      serviceName: services.name,
      date: attendance.date,
      attended: attendance.attended,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
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
  const [result] = await db
    .update(attendance)
    .set({ ...data })
    .where(eq(attendance.attendanceId, id))
    .returning();
  if (!result) throw new Error("Attendance record not found");
  return result;
};

export const deleteAttendanceService = async (id: number) => {
  const [result] = await db
    .delete(attendance)
    .where(eq(attendance.attendanceId, id))
    .returning({ id: attendance.attendanceId });
  if (!result) throw new Error("Attendance record not found");
  return result;
};