import db from "../Drizzle/db";
import { events, eventRegistrations, members, users } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createEventService = async (data: any) => {
  const [result] = await db
    .insert(events)
    .values(data)
    .returning();
  return result;
};

export const getEventsService = async () => {
  return await db
    .select()
    .from(events)
    .orderBy(desc(events.createdAt));
};

export const getEventByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(events)
    .where(eq(events.eventId, id));
  if (!result) throw new Error("Event not found");
  return result;
};

export const getEventsByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(events)
    .where(eq(events.churchId, churchId))
    .orderBy(desc(events.startDate));
};

export const updateEventService = async (id: number, data: any) => {
  const [result] = await db
    .update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.eventId, id))
    .returning();
  if (!result) throw new Error("Event not found");
  return result;
};

export const deleteEventService = async (id: number) => {
  const [result] = await db
    .delete(events)
    .where(eq(events.eventId, id))
    .returning({ id: events.eventId });
  if (!result) throw new Error("Event not found");
  return result;
};

export const registerForEventService = async (data: any) => {
  const [result] = await db
    .insert(eventRegistrations)
    .values(data)
    .returning();
  return result;
};

export const getEventRegistrationsService = async (eventId: number) => {
  return await db
    .select({
      registrationId: eventRegistrations.registrationId,
      memberId: eventRegistrations.memberId,
      fullName: users.fullName,
      email: users.email,
      attended: eventRegistrations.attended,
    })
    .from(eventRegistrations)
    .leftJoin(members, eq(eventRegistrations.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .where(eq(eventRegistrations.eventId, eventId));
};

export const updateEventRegistrationService = async (id: number, data: any) => {
  const [result] = await db
    .update(eventRegistrations)
    .set(data)
    .where(eq(eventRegistrations.registrationId, id))
    .returning();
  if (!result) throw new Error("Registration not found");
  return result;
};

export const deleteEventRegistrationService = async (id: number) => {
  const [result] = await db
    .delete(eventRegistrations)
    .where(eq(eventRegistrations.registrationId, id))
    .returning({ id: eventRegistrations.registrationId });
  if (!result) throw new Error("Registration not found");
  return result;
};