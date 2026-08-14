"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemberEventRegistrationsService = exports.deleteEventRegistrationService = exports.updateEventRegistrationService = exports.getEventRegistrationsService = exports.registerForEventService = exports.deleteEventService = exports.updateEventService = exports.getPublishedEventsService = exports.getEventsByChurchService = exports.getEventByIdService = exports.createEventService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createEventService = async (data) => {
    const pool = db_1.default.$client;
    const query = `
    INSERT INTO events (
      church_id,
      title,
      description,
      location,
      start_date,
      end_date,
      status,
      is_public,
      max_attendees,
      image_url,
      image_public_id,
      cover_image_url,
      cover_image_public_id,
      gallery,
      created_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
    )
    RETURNING *
  `;
    const values = [
        Number(data.churchId),
        data.title,
        data.description || null,
        data.location || null,
        data.startDate || new Date().toISOString(),
        data.endDate || null,
        data.status || "draft",
        data.isPublic !== undefined ? Boolean(data.isPublic) : true,
        data.maxAttendees ? Number(data.maxAttendees) : null,
        data.imageUrl || null,
        data.imagePublicId || null,
        data.coverImageUrl || null,
        data.coverImagePublicId || null,
        data.gallery ? JSON.stringify(data.gallery) : null,
        data.createdBy ? Number(data.createdBy) : null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.createEventService = createEventService;
const getEventByIdService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid event ID");
    }
    const [result] = await db_1.default
        .select()
        .from(schema_1.events)
        .where((0, drizzle_orm_1.eq)(schema_1.events.eventId, id));
    if (!result)
        throw new Error("Event not found");
    return result;
};
exports.getEventByIdService = getEventByIdService;
const getEventsByChurchService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.events)
        .where((0, drizzle_orm_1.eq)(schema_1.events.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.events.startDate));
};
exports.getEventsByChurchService = getEventsByChurchService;
const getPublishedEventsService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.events)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.status, "published"), (0, drizzle_orm_1.eq)(schema_1.events.churchId, churchId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.events.startDate));
};
exports.getPublishedEventsService = getPublishedEventsService;
const updateEventService = async (id, data) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid event ID");
    }
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.title !== undefined) {
        updates.push(`title = $${paramIndex}`);
        values.push(data.title);
        paramIndex++;
    }
    if (data.description !== undefined) {
        updates.push(`description = $${paramIndex}`);
        values.push(data.description);
        paramIndex++;
    }
    if (data.location !== undefined) {
        updates.push(`location = $${paramIndex}`);
        values.push(data.location);
        paramIndex++;
    }
    if (data.startDate !== undefined) {
        updates.push(`start_date = $${paramIndex}`);
        values.push(data.startDate);
        paramIndex++;
    }
    if (data.endDate !== undefined) {
        updates.push(`end_date = $${paramIndex}`);
        values.push(data.endDate);
        paramIndex++;
    }
    if (data.status !== undefined) {
        updates.push(`status = $${paramIndex}`);
        values.push(data.status);
        paramIndex++;
    }
    if (data.isPublic !== undefined) {
        updates.push(`is_public = $${paramIndex}`);
        values.push(Boolean(data.isPublic));
        paramIndex++;
    }
    if (data.maxAttendees !== undefined) {
        updates.push(`max_attendees = $${paramIndex}`);
        values.push(data.maxAttendees ? Number(data.maxAttendees) : null);
        paramIndex++;
    }
    if (data.imageUrl !== undefined) {
        updates.push(`image_url = $${paramIndex}`);
        values.push(data.imageUrl);
        paramIndex++;
    }
    if (data.coverImageUrl !== undefined) {
        updates.push(`cover_image_url = $${paramIndex}`);
        values.push(data.coverImageUrl);
        paramIndex++;
    }
    if (data.gallery !== undefined) {
        updates.push(`gallery = $${paramIndex}`);
        values.push(data.gallery ? JSON.stringify(data.gallery) : null);
        paramIndex++;
    }
    if (updates.length === 0) {
        throw new Error("No fields to update");
    }
    values.push(id);
    const query = `
    UPDATE events 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE event_id = $${paramIndex}
    RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Event not found");
    return result.rows[0];
};
exports.updateEventService = updateEventService;
const deleteEventService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid event ID");
    }
    const [result] = await db_1.default
        .delete(schema_1.events)
        .where((0, drizzle_orm_1.eq)(schema_1.events.eventId, id))
        .returning({ id: schema_1.events.eventId });
    if (!result)
        throw new Error("Event not found");
    return result;
};
exports.deleteEventService = deleteEventService;
const registerForEventService = async (data) => {
    if (!data.eventId || isNaN(Number(data.eventId))) {
        throw new Error("Invalid event ID");
    }
    if (!data.memberId || isNaN(Number(data.memberId))) {
        throw new Error("Invalid member ID");
    }
    const pool = db_1.default.$client;
    const query = `
    INSERT INTO event_registrations (
      event_id,
      member_id,
      attended,
      notes,
      registration_image
    ) VALUES (
      $1, $2, $3, $4, $5
    )
    RETURNING *
  `;
    const values = [
        Number(data.eventId),
        Number(data.memberId),
        data.attended !== undefined ? Boolean(data.attended) : false,
        data.notes || null,
        data.registrationImage || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.registerForEventService = registerForEventService;
const getEventRegistrationsService = async (eventId) => {
    if (!eventId || isNaN(eventId)) {
        throw new Error("Invalid event ID");
    }
    return await db_1.default
        .select({
        registrationId: schema_1.eventRegistrations.registrationId,
        memberId: schema_1.eventRegistrations.memberId,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        attended: schema_1.eventRegistrations.attended,
        notes: schema_1.eventRegistrations.notes,
        registrationImage: schema_1.eventRegistrations.registrationImage,
        createdAt: schema_1.eventRegistrations.createdAt,
    })
        .from(schema_1.eventRegistrations)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.eventRegistrations.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .where((0, drizzle_orm_1.eq)(schema_1.eventRegistrations.eventId, eventId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.eventRegistrations.createdAt));
};
exports.getEventRegistrationsService = getEventRegistrationsService;
const updateEventRegistrationService = async (id, data) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid registration ID");
    }
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.attended !== undefined) {
        updates.push(`attended = $${paramIndex}`);
        values.push(Boolean(data.attended));
        paramIndex++;
    }
    if (data.notes !== undefined) {
        updates.push(`notes = $${paramIndex}`);
        values.push(data.notes);
        paramIndex++;
    }
    if (data.registrationImage !== undefined) {
        updates.push(`registration_image = $${paramIndex}`);
        values.push(data.registrationImage);
        paramIndex++;
    }
    if (updates.length === 0) {
        throw new Error("No fields to update");
    }
    values.push(id);
    const query = `
    UPDATE event_registrations 
    SET ${updates.join(', ')}
    WHERE registration_id = $${paramIndex}
    RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Registration not found");
    return result.rows[0];
};
exports.updateEventRegistrationService = updateEventRegistrationService;
const deleteEventRegistrationService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid registration ID");
    }
    const [result] = await db_1.default
        .delete(schema_1.eventRegistrations)
        .where((0, drizzle_orm_1.eq)(schema_1.eventRegistrations.registrationId, id))
        .returning({ id: schema_1.eventRegistrations.registrationId });
    if (!result)
        throw new Error("Registration not found");
    return result;
};
exports.deleteEventRegistrationService = deleteEventRegistrationService;
const getMemberEventRegistrationsService = async (memberId) => {
    if (!memberId || isNaN(memberId)) {
        throw new Error("Invalid member ID");
    }
    return await db_1.default
        .select({
        registrationId: schema_1.eventRegistrations.registrationId,
        eventId: schema_1.eventRegistrations.eventId,
        eventTitle: schema_1.events.title,
        eventStartDate: schema_1.events.startDate,
        eventLocation: schema_1.events.location,
        attended: schema_1.eventRegistrations.attended,
        notes: schema_1.eventRegistrations.notes,
        createdAt: schema_1.eventRegistrations.createdAt,
    })
        .from(schema_1.eventRegistrations)
        .leftJoin(schema_1.events, (0, drizzle_orm_1.eq)(schema_1.eventRegistrations.eventId, schema_1.events.eventId))
        .where((0, drizzle_orm_1.eq)(schema_1.eventRegistrations.memberId, memberId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.eventRegistrations.createdAt));
};
exports.getMemberEventRegistrationsService = getMemberEventRegistrationsService;
