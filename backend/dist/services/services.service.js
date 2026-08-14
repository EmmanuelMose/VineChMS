"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServicesByDayService = exports.getActiveServicesService = exports.getServicesByChurchService = exports.deleteServiceService = exports.updateServiceService = exports.getServiceByIdService = exports.getServicesService = exports.createServiceService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const toDate = (value) => {
    if (!value)
        return null;
    if (value instanceof Date)
        return value;
    if (typeof value === 'string') {
        const date = new Date(value);
        if (isNaN(date.getTime()))
            return null;
        return date;
    }
    if (typeof value === 'number')
        return new Date(value);
    return null;
};
const toDateOrNow = (value) => {
    if (!value)
        return new Date();
    if (value instanceof Date)
        return value;
    if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime()))
            return date;
    }
    if (typeof value === 'number')
        return new Date(value);
    return new Date();
};
const createServiceService = async (data) => {
    try {
        const processedData = {
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
        const [result] = await db_1.default
            .insert(schema_1.services)
            .values(processedData)
            .returning();
        return result;
    }
    catch (error) {
        console.error("Error creating service:", error.message);
        throw new Error("Failed to create service");
    }
};
exports.createServiceService = createServiceService;
const getServicesService = async () => {
    return await db_1.default
        .select()
        .from(schema_1.services)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.services.createdAt));
};
exports.getServicesService = getServicesService;
const getServiceByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.services)
        .where((0, drizzle_orm_1.eq)(schema_1.services.serviceId, id));
    if (!result)
        throw new Error("Service not found");
    return result;
};
exports.getServiceByIdService = getServiceByIdService;
const updateServiceService = async (id, data) => {
    try {
        const processedData = {
            updatedAt: new Date(),
        };
        if (data.name !== undefined)
            processedData.name = String(data.name);
        if (data.description !== undefined)
            processedData.description = data.description ? String(data.description) : null;
        if (data.dayOfWeek !== undefined)
            processedData.dayOfWeek = Number(data.dayOfWeek);
        if (data.startTime !== undefined)
            processedData.startTime = toDateOrNow(data.startTime);
        if (data.endTime !== undefined)
            processedData.endTime = data.endTime ? toDate(data.endTime) : null;
        if (data.serviceType !== undefined)
            processedData.serviceType = String(data.serviceType || "regular");
        if (data.attendanceType !== undefined)
            processedData.attendanceType = String(data.attendanceType || "in_person");
        if (data.isActive !== undefined)
            processedData.isActive = Boolean(data.isActive);
        const [result] = await db_1.default
            .update(schema_1.services)
            .set(processedData)
            .where((0, drizzle_orm_1.eq)(schema_1.services.serviceId, id))
            .returning();
        if (!result)
            throw new Error("Service not found");
        return result;
    }
    catch (error) {
        console.error("Error updating service:", error.message);
        throw new Error("Failed to update service");
    }
};
exports.updateServiceService = updateServiceService;
const deleteServiceService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.services)
        .where((0, drizzle_orm_1.eq)(schema_1.services.serviceId, id))
        .returning({ id: schema_1.services.serviceId });
    if (!result)
        throw new Error("Service not found");
    return result;
};
exports.deleteServiceService = deleteServiceService;
const getServicesByChurchService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.services)
        .where((0, drizzle_orm_1.eq)(schema_1.services.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.services.createdAt));
};
exports.getServicesByChurchService = getServicesByChurchService;
const getActiveServicesService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.services)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.isActive, true), (0, drizzle_orm_1.eq)(schema_1.services.churchId, churchId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.services.createdAt));
};
exports.getActiveServicesService = getActiveServicesService;
const getServicesByDayService = async (dayOfWeek, churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.services)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.dayOfWeek, dayOfWeek), (0, drizzle_orm_1.eq)(schema_1.services.churchId, churchId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.services.createdAt));
};
exports.getServicesByDayService = getServicesByDayService;
