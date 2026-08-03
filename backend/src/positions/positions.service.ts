import db from "../Drizzle/db";
import { positions } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createPositionService = async (data: {
  name: string;
  description?: string | null;
  churchId: number;
  isActive?: boolean;
}) => {
  const [result] = await db
    .insert(positions)
    .values({
      name: data.name,
      description: data.description || null,
      churchId: data.churchId,
      isActive: data.isActive !== undefined ? data.isActive : true,
    })
    .returning();
  return result;
};

export const getPositionsService = async () => {
  return await db
    .select()
    .from(positions)
    .orderBy(desc(positions.createdAt));
};

export const getPositionByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(positions)
    .where(eq(positions.positionId, id));
  if (!result) throw new Error("Position not found");
  return result;
};

export const updatePositionService = async (id: number, data: any) => {
  const [result] = await db
    .update(positions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(positions.positionId, id))
    .returning();
  if (!result) throw new Error("Position not found");
  return result;
};

export const deletePositionService = async (id: number) => {
  const [result] = await db
    .delete(positions)
    .where(eq(positions.positionId, id))
    .returning({ id: positions.positionId });
  if (!result) throw new Error("Position not found");
  return result;
};