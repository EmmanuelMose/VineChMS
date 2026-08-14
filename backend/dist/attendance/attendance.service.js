"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceByMemberAndServiceService = exports.getAttendanceSummaryService = exports.getAttendanceByDateService = exports.deleteAttendanceService = exports.updateAttendanceService = exports.getAttendanceByServiceService = exports.getAttendanceByMemberService = exports.getAttendanceByIdService = exports.getAttendanceService = exports.createAttendanceService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createAttendanceService = async (data) => {
    const pool = db_1.default.$client;
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
exports.createAttendanceService = createAttendanceService;
const getAttendanceService = async (churchId) => {
    if (churchId) {
        return await db_1.default
            .select({
            attendanceId: schema_1.attendance.attendanceId,
            memberId: schema_1.attendance.memberId,
            serviceId: schema_1.attendance.serviceId,
            date: schema_1.attendance.date,
            attended: schema_1.attendance.attended,
            checkInTime: schema_1.attendance.checkInTime,
            checkOutTime: schema_1.attendance.checkOutTime,
            notes: schema_1.attendance.notes,
            createdAt: schema_1.attendance.createdAt,
            fullName: schema_1.users.fullName,
            serviceName: schema_1.services.name,
            churchId: schema_1.services.churchId,
        })
            .from(schema_1.attendance)
            .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.attendance.memberId, schema_1.members.memberId))
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
            .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.attendance.serviceId, schema_1.services.serviceId))
            .where((0, drizzle_orm_1.eq)(schema_1.services.churchId, churchId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.attendance.date));
    }
    return await db_1.default
        .select({
        attendanceId: schema_1.attendance.attendanceId,
        memberId: schema_1.attendance.memberId,
        serviceId: schema_1.attendance.serviceId,
        date: schema_1.attendance.date,
        attended: schema_1.attendance.attended,
        checkInTime: schema_1.attendance.checkInTime,
        checkOutTime: schema_1.attendance.checkOutTime,
        notes: schema_1.attendance.notes,
        createdAt: schema_1.attendance.createdAt,
        fullName: schema_1.users.fullName,
        serviceName: schema_1.services.name,
    })
        .from(schema_1.attendance)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.attendance.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.attendance.serviceId, schema_1.services.serviceId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.attendance.date));
};
exports.getAttendanceService = getAttendanceService;
const getAttendanceByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.attendance)
        .where((0, drizzle_orm_1.eq)(schema_1.attendance.attendanceId, id));
    if (!result)
        throw new Error("Attendance record not found");
    return result;
};
exports.getAttendanceByIdService = getAttendanceByIdService;
const getAttendanceByMemberService = async (memberId) => {
    return await db_1.default
        .select()
        .from(schema_1.attendance)
        .where((0, drizzle_orm_1.eq)(schema_1.attendance.memberId, memberId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.attendance.date));
};
exports.getAttendanceByMemberService = getAttendanceByMemberService;
const getAttendanceByServiceService = async (serviceId) => {
    return await db_1.default
        .select()
        .from(schema_1.attendance)
        .where((0, drizzle_orm_1.eq)(schema_1.attendance.serviceId, serviceId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.attendance.date));
};
exports.getAttendanceByServiceService = getAttendanceByServiceService;
const updateAttendanceService = async (id, data) => {
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
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
    if (!result.rows[0])
        throw new Error("Attendance record not found");
    return result.rows[0];
};
exports.updateAttendanceService = updateAttendanceService;
const deleteAttendanceService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.attendance)
        .where((0, drizzle_orm_1.eq)(schema_1.attendance.attendanceId, id))
        .returning({ id: schema_1.attendance.attendanceId });
    if (!result)
        throw new Error("Attendance record not found");
    return result;
};
exports.deleteAttendanceService = deleteAttendanceService;
const getAttendanceByDateService = async (date) => {
    const pool = db_1.default.$client;
    const query = `
    SELECT * FROM attendance 
    WHERE date::date = $1::date
    ORDER BY created_at DESC
  `;
    const result = await pool.query(query, [date]);
    return result.rows;
};
exports.getAttendanceByDateService = getAttendanceByDateService;
const getAttendanceSummaryService = async (serviceId) => {
    const allAttendance = await db_1.default
        .select()
        .from(schema_1.attendance)
        .where((0, drizzle_orm_1.eq)(schema_1.attendance.serviceId, serviceId));
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
exports.getAttendanceSummaryService = getAttendanceSummaryService;
const getAttendanceByMemberAndServiceService = async (memberId, serviceId) => {
    return await db_1.default
        .select()
        .from(schema_1.attendance)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.attendance.memberId, memberId), (0, drizzle_orm_1.eq)(schema_1.attendance.serviceId, serviceId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.attendance.date));
};
exports.getAttendanceByMemberAndServiceService = getAttendanceByMemberAndServiceService;
