import db from "../Drizzle/db";
import { events, eventRegistrations, members, users } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const createEventService = async (data: any) => {
  const pool = db.$client;
  
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

export const getEventByIdService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid event ID");
  }
  const [result] = await db
    .select()
    .from(events)
    .where(eq(events.eventId, id));
  if (!result) throw new Error("Event not found");
  return result;
};

export const getEventsByChurchService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(events)
    .where(eq(events.churchId, churchId))
    .orderBy(desc(events.startDate));
};

export const getPublishedEventsService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(events)
    .where(and(eq(events.status, "published"), eq(events.churchId, churchId)))
    .orderBy(desc(events.startDate));
};

export const updateEventService = async (id: number, data: any) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid event ID");
  }
  
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
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
  if (!result.rows[0]) throw new Error("Event not found");
  return result.rows[0];
};

export const deleteEventService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid event ID");
  }
  const [result] = await db
    .delete(events)
    .where(eq(events.eventId, id))
    .returning({ id: events.eventId });
  if (!result) throw new Error("Event not found");
  return result;
};

export const registerForEventService = async (data: any) => {
  if (!data.eventId || isNaN(Number(data.eventId))) {
    throw new Error("Invalid event ID");
  }
  if (!data.memberId || isNaN(Number(data.memberId))) {
    throw new Error("Invalid member ID");
  }
  
  const pool = db.$client;
  
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

export const getEventRegistrationsService = async (eventId: number) => {
  if (!eventId || isNaN(eventId)) {
    throw new Error("Invalid event ID");
  }
  return await db
    .select({
      registrationId: eventRegistrations.registrationId,
      memberId: eventRegistrations.memberId,
      fullName: users.fullName,
      email: users.email,
      attended: eventRegistrations.attended,
      notes: eventRegistrations.notes,
      registrationImage: eventRegistrations.registrationImage,
      createdAt: eventRegistrations.createdAt,
    })
    .from(eventRegistrations)
    .leftJoin(members, eq(eventRegistrations.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(desc(eventRegistrations.createdAt));
};

export const updateEventRegistrationService = async (id: number, data: any) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid registration ID");
  }
  
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
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
  if (!result.rows[0]) throw new Error("Registration not found");
  return result.rows[0];
};

export const deleteEventRegistrationService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid registration ID");
  }
  const [result] = await db
    .delete(eventRegistrations)
    .where(eq(eventRegistrations.registrationId, id))
    .returning({ id: eventRegistrations.registrationId });
  if (!result) throw new Error("Registration not found");
  return result;
};

export const getMemberEventRegistrationsService = async (memberId: number) => {
  if (!memberId || isNaN(memberId)) {
    throw new Error("Invalid member ID");
  }
  return await db
    .select({
      registrationId: eventRegistrations.registrationId,
      eventId: eventRegistrations.eventId,
      eventTitle: events.title,
      eventStartDate: events.startDate,
      eventLocation: events.location,
      attended: eventRegistrations.attended,
      notes: eventRegistrations.notes,
      createdAt: eventRegistrations.createdAt,
    })
    .from(eventRegistrations)
    .leftJoin(events, eq(eventRegistrations.eventId, events.eventId))
    .where(eq(eventRegistrations.memberId, memberId))
    .orderBy(desc(eventRegistrations.createdAt));
};