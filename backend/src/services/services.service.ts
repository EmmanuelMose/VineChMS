import db from "../Drizzle/db";
import { services } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

const toDate = (value: any): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return date;
  }
  if (typeof value === 'number') return new Date(value);
  return null;
};

const toDateOrNow = (value: any): Date => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  if (typeof value === 'number') return new Date(value);
  return new Date();
};

export const createServiceService = async (data: any) => {
  try {
    const processedData: any = {
      churchId: Number(data.churchId),
      name: String(data.name),
      description: data.description ? String(data.description) : null,
      dayOfWeek: Number(data.dayOfWeek),
      startTime: toDateOrNow(data.startTime),
      endTime: data.endTime ? toDate(data.endTime) : null,
      serviceType: String(data.serviceType || "regular"),
      attendanceType: String(data.attendanceType || "in_person"),
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    };

    const [result] = await db
      .insert(services)
      .values(processedData)
      .returning();

    return result;
  } catch (error: any) {
    console.error("Error creating service:", error.message);
    throw new Error("Failed to create service");
  }
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
  try {
    const processedData: any = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) processedData.name = String(data.name);
    if (data.description !== undefined) processedData.description = data.description ? String(data.description) : null;
    if (data.dayOfWeek !== undefined) processedData.dayOfWeek = Number(data.dayOfWeek);
    if (data.startTime !== undefined) processedData.startTime = toDateOrNow(data.startTime);
    if (data.endTime !== undefined) processedData.endTime = data.endTime ? toDate(data.endTime) : null;
    if (data.serviceType !== undefined) processedData.serviceType = String(data.serviceType || "regular");
    if (data.attendanceType !== undefined) processedData.attendanceType = String(data.attendanceType || "in_person");
    if (data.isActive !== undefined) processedData.isActive = Boolean(data.isActive);

    const [result] = await db
      .update(services)
      .set(processedData)
      .where(eq(services.serviceId, id))
      .returning();

    if (!result) throw new Error("Service not found");
    return result;
  } catch (error: any) {
    console.error("Error updating service:", error.message);
    throw new Error("Failed to update service");
  }
};

export const deleteServiceService = async (id: number) => {
  const [result] = await db
    .delete(services)
    .where(eq(services.serviceId, id))
    .returning({ id: services.serviceId });
  if (!result) throw new Error("Service not found");
  return result;
};

export const getServicesByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(services)
    .where(eq(services.churchId, churchId))
    .orderBy(desc(services.createdAt));
};

export const getActiveServicesService = async (churchId: number) => {
  return await db
    .select()
    .from(services)
    .where(and(eq(services.isActive, true), eq(services.churchId, churchId)))
    .orderBy(desc(services.createdAt));
};

export const getServicesByDayService = async (dayOfWeek: number, churchId: number) => {
  return await db
    .select()
    .from(services)
    .where(and(eq(services.dayOfWeek, dayOfWeek), eq(services.churchId, churchId)))
    .orderBy(desc(services.createdAt));
};