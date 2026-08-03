import db from "../Drizzle/db";
import { announcements } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createAnnouncementService = async (data: any) => {
  const [result] = await db
    .insert(announcements)
    .values(data)
    .returning();
  return result;
};

export const getAnnouncementsService = async () => {
  return await db
    .select()
    .from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.createdAt));
};

export const getAllAnnouncementsService = async () => {
  return await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.createdAt));
};

export const getAnnouncementByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.announcementId, id));
  if (!result) throw new Error("Announcement not found");
  return result;
};

export const getAnnouncementsByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(announcements)
    .where(eq(announcements.churchId, churchId))
    .orderBy(desc(announcements.createdAt));
};

export const updateAnnouncementService = async (id: number, data: any) => {
  const [result] = await db
    .update(announcements)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(announcements.announcementId, id))
    .returning();
  if (!result) throw new Error("Announcement not found");
  return result;
};

export const deleteAnnouncementService = async (id: number) => {
  const [result] = await db
    .delete(announcements)
    .where(eq(announcements.announcementId, id))
    .returning({ id: announcements.announcementId });
  if (!result) throw new Error("Announcement not found");
  return result;
};

export const publishAnnouncementService = async (id: number) => {
  const [result] = await db
    .update(announcements)
    .set({
      isPublished: true,
      publishedAt: new Date(),
    })
    .where(eq(announcements.announcementId, id))
    .returning();
  if (!result) throw new Error("Announcement not found");
  return result;
};