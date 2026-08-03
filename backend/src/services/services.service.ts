import db from "../Drizzle/db";
import { services } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createServiceService = async (data: any) => {
  const [result] = await db
    .insert(services)
    .values(data)
    .returning();
  return result;
};

export const getServicesService = async () => {
  return await db
    .select()
    .from(services)
    .orderBy(desc(services.createdAt));
};

export const getServiceByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(services)
    .where(eq(services.serviceId, id));
  if (!result) throw new Error("Service not found");
  return result;
};

export const updateServiceService = async (id: number, data: any) => {
  const [result] = await db
    .update(services)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(services.serviceId, id))
    .returning();
  if (!result) throw new Error("Service not found");
  return result;
};

export const deleteServiceService = async (id: number) => {
  const [result] = await db
    .delete(services)
    .where(eq(services.serviceId, id))
    .returning({ id: services.serviceId });
  if (!result) throw new Error("Service not found");
  return result;
};