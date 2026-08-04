import db from "../Drizzle/db";
import { sermons } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createSermonService = async (data: any) => {
  const pool = db.$client;
  
  const query = `
    INSERT INTO sermons (
      church_id,
      title,
      speaker,
      topic,
      scripture,
      description,
      video_url,
      video_public_id,
      audio_url,
      audio_public_id,
      notes,
      preached_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    )
    RETURNING *
  `;

  const values = [
    Number(data.churchId),
    data.title,
    data.speaker,
    data.topic || null,
    data.scripture || null,
    data.description || null,
    data.videoUrl || null,
    data.videoPublicId || null,
    data.audioUrl || null,
    data.audioPublicId || null,
    data.notes || null,
    data.preachedAt || new Date().toISOString()
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getSermonsService = async () => {
  return await db
    .select()
    .from(sermons)
    .orderBy(desc(sermons.preachedAt));
};

export const getSermonByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(sermons)
    .where(eq(sermons.sermonId, id));
  if (!result) throw new Error("Sermon not found");
  return result;
};

export const getSermonsByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(sermons)
    .where(eq(sermons.churchId, churchId))
    .orderBy(desc(sermons.preachedAt));
};

export const updateSermonService = async (id: number, data: any) => {
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.title !== undefined) {
    updates.push(`title = $${paramIndex}`);
    values.push(data.title);
    paramIndex++;
  }
  if (data.speaker !== undefined) {
    updates.push(`speaker = $${paramIndex}`);
    values.push(data.speaker);
    paramIndex++;
  }
  if (data.topic !== undefined) {
    updates.push(`topic = $${paramIndex}`);
    values.push(data.topic);
    paramIndex++;
  }
  if (data.scripture !== undefined) {
    updates.push(`scripture = $${paramIndex}`);
    values.push(data.scripture);
    paramIndex++;
  }
  if (data.description !== undefined) {
    updates.push(`description = $${paramIndex}`);
    values.push(data.description);
    paramIndex++;
  }
  if (data.videoUrl !== undefined) {
    updates.push(`video_url = $${paramIndex}`);
    values.push(data.videoUrl);
    paramIndex++;
  }
  if (data.videoPublicId !== undefined) {
    updates.push(`video_public_id = $${paramIndex}`);
    values.push(data.videoPublicId);
    paramIndex++;
  }
  if (data.audioUrl !== undefined) {
    updates.push(`audio_url = $${paramIndex}`);
    values.push(data.audioUrl);
    paramIndex++;
  }
  if (data.audioPublicId !== undefined) {
    updates.push(`audio_public_id = $${paramIndex}`);
    values.push(data.audioPublicId);
    paramIndex++;
  }
  if (data.notes !== undefined) {
    updates.push(`notes = $${paramIndex}`);
    values.push(data.notes);
    paramIndex++;
  }
  if (data.preachedAt !== undefined) {
    updates.push(`preached_at = $${paramIndex}`);
    values.push(data.preachedAt);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE sermons 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE sermon_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Sermon not found");
  return result.rows[0];
};

export const deleteSermonService = async (id: number) => {
  const [result] = await db
    .delete(sermons)
    .where(eq(sermons.sermonId, id))
    .returning({ id: sermons.sermonId });
  if (!result) throw new Error("Sermon not found");
  return result;
};