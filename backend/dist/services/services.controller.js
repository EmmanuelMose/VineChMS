"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServicesByDay = exports.getActiveServices = exports.getServicesByChurch = exports.deleteService = exports.updateService = exports.getServiceById = exports.getServices = exports.createService = void 0;
const services_service_1 = require("./services.service");
const createService = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const data = { ...req.body, churchId: Number(churchId) };
        const result = await (0, services_service_1.createServiceService)(data);
        res.status(201).json({ success: true, data: result, message: "Service created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create service" });
    }
};
exports.createService = createService;
const getServices = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, services_service_1.getServicesByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch services" });
    }
};
exports.getServices = getServices;
const getServiceById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, services_service_1.getServiceByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Service not found" });
    }
};
exports.getServiceById = getServiceById;
const updateService = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, services_service_1.getServiceByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, services_service_1.updateServiceService)(id, req.body);
        res.json({ success: true, data: result, message: "Service updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update service" });
    }
};
exports.updateService = updateService;
const deleteService = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, services_service_1.getServiceByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, services_service_1.deleteServiceService)(id);
        res.json({ success: true, message: "Service deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete service" });
    }
};
exports.deleteService = deleteService;
const getServicesByChurch = async (req, res) => {
    try {
        const churchId = parseInt(req.params.churchId);
        const userChurchId = req.user?.churchId;
        if (churchId !== userChurchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, services_service_1.getServicesByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch services" });
    }
};
exports.getServicesByChurch = getServicesByChurch;
const getActiveServices = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, services_service_1.getActiveServicesService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch active services" });
    }
};
exports.getActiveServices = getActiveServices;
const getServicesByDay = async (req, res) => {
    try {
        const dayOfWeek = parseInt(req.params.dayOfWeek);
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, services_service_1.getServicesByDayService)(dayOfWeek, churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch services" });
    }
};
exports.getServicesByDay = getServicesByDay;
