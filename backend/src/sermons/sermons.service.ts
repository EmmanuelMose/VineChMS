import db from "../Drizzle/db";
import { sermons } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createSermonService = async (data: any) => {
  const [result] = await db
    .insert(sermons)
    .values(data)
    .returning();
  return result;
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
  const [result] = await db
    .update(sermons)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(sermons.sermonId, id))
    .returning();
  if (!result) throw new Error("Sermon not found");
  return result;
};

export const deleteSermonService = async (id: number) => {
  const [result] = await db
    .delete(sermons)
    .where(eq(sermons.sermonId, id))
    .returning({ id: sermons.sermonId });
  if (!result) throw new Error("Sermon not found");
  return result;
};