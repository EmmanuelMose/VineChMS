import db from "../Drizzle/db";
import { announcements } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const createAnnouncementService = async (data: any) => {
  const pool = db.$client;
  
  const query = `
    INSERT INTO announcements (
      church_id,
      title,
      content,
      image_url,
      image_public_id,
      image_position,
      is_published,
      published_at,
      expires_at,
      created_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    RETURNING *
  `;

  const values = [
    Number(data.churchId),
    data.title,
    data.content,
    data.imageUrl || null,
    data.imagePublicId || null,
    data.imagePosition || "top",
    data.isPublished !== undefined ? Boolean(data.isPublished) : false,
    data.publishedAt || null,
    data.expiresAt || null,
    data.createdBy ? Number(data.createdBy) : null
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAnnouncementByIdService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid announcement ID");
  }
  const [result] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.announcementId, id));
  if (!result) throw new Error("Announcement not found");
  return result;
};

export const getAnnouncementsByChurchService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(announcements)
    .where(eq(announcements.churchId, churchId))
    .orderBy(desc(announcements.createdAt));
};

export const updateAnnouncementService = async (id: number, data: any) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid announcement ID");
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
  if (data.content !== undefined) {
    updates.push(`content = $${paramIndex}`);
    values.push(data.content);
    paramIndex++;
  }
  if (data.imageUrl !== undefined) {
    updates.push(`image_url = $${paramIndex}`);
    values.push(data.imageUrl);
    paramIndex++;
  }
  if (data.imagePublicId !== undefined) {
    updates.push(`image_public_id = $${paramIndex}`);
    values.push(data.imagePublicId);
    paramIndex++;
  }
  if (data.imagePosition !== undefined) {
    updates.push(`image_position = $${paramIndex}`);
    values.push(data.imagePosition);
    paramIndex++;
  }
  if (data.isPublished !== undefined) {
    updates.push(`is_published = $${paramIndex}`);
    values.push(Boolean(data.isPublished));
    paramIndex++;
  }
  if (data.publishedAt !== undefined) {
    updates.push(`published_at = $${paramIndex}`);
    values.push(data.publishedAt);
    paramIndex++;
  }
  if (data.expiresAt !== undefined) {
    updates.push(`expires_at = $${paramIndex}`);
    values.push(data.expiresAt);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE announcements 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE announcement_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Announcement not found");
  return result.rows[0];
};

export const deleteAnnouncementService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid announcement ID");
  }
  const [result] = await db
    .delete(announcements)
    .where(eq(announcements.announcementId, id))
    .returning({ id: announcements.announcementId });
  if (!result) throw new Error("Announcement not found");
  return result;
};

export const publishAnnouncementService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid announcement ID");
  }
  const pool = db.$client;
  
  const query = `
    UPDATE announcements 
    SET 
      is_published = true,
      published_at = NOW(),
      updated_at = NOW()
    WHERE announcement_id = $1
    RETURNING *
  `;
  
  const result = await pool.query(query, [id]);
  if (!result.rows[0]) throw new Error("Announcement not found");
  return result.rows[0];
};

export const unpublishAnnouncementService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid announcement ID");
  }
  const pool = db.$client;
  
  const query = `
    UPDATE announcements 
    SET 
      is_published = false,
      updated_at = NOW()
    WHERE announcement_id = $1
    RETURNING *
  `;
  
  const result = await pool.query(query, [id]);
  if (!result.rows[0]) throw new Error("Announcement not found");
  return result.rows[0];
};

export const getPublishedAnnouncementsByChurchService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(announcements)
    .where(
      and(
        eq(announcements.isPublished, true),
        eq(announcements.churchId, churchId)
      )
    )
    .orderBy(desc(announcements.createdAt));
};

export const getActiveAnnouncementsService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(announcements)
    .where(and(eq(announcements.isPublished, true), eq(announcements.churchId, churchId)))
    .orderBy(desc(announcements.createdAt));
};