import db from "../Drizzle/db";
import { services } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

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
  const processedData = {
    ...data,
    startTime: toDateOrNow(data.startTime),
    endTime: toDate(data.endTime),
    isActive: data.isActive !== undefined ? data.isActive : true,
  };

  Object.keys(processedData).forEach(key => {
    if (processedData[key] === undefined) {
      delete processedData[key];
    }
  });

  const [result] = await db
    .insert(services)
    .values(processedData)
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
  const processedData: any = {
    ...data,
    updatedAt: new Date(),
  };

  if (data.startTime !== undefined) {
    processedData.startTime = data.startTime ? toDate(data.startTime) : null;
  }
  if (data.endTime !== undefined) {
    processedData.endTime = data.endTime ? toDate(data.endTime) : null;
  }

  Object.keys(processedData).forEach(key => {
    if (processedData[key] === undefined) {
      delete processedData[key];
    }
  });

  const [result] = await db
    .update(services)
    .set(processedData)
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

export const getServicesByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(services)
    .where(eq(services.churchId, churchId))
    .orderBy(desc(services.createdAt));
};

export const getActiveServicesService = async () => {
  return await db
    .select()
    .from(services)
    .where(eq(services.isActive, true))
    .orderBy(desc(services.createdAt));
};

export const getServicesByDayService = async (dayOfWeek: number) => {
  return await db
    .select()
    .from(services)
    .where(eq(services.dayOfWeek, dayOfWeek))
    .orderBy(desc(services.createdAt));
};