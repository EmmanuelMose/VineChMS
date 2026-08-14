"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemberEventRegistrations = exports.deleteEventRegistration = exports.updateEventRegistration = exports.getEventRegistrations = exports.registerForEvent = exports.getPublishedEvents = exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
const events_service_1 = require("./events.service");
const createEvent = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, events_service_1.createEventService)({ ...req.body, churchId, createdBy: userId });
        res.status(201).json({ success: true, data: result, message: "Event created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create event" });
    }
};
exports.createEvent = createEvent;
const getEvents = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, events_service_1.getEventsByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch events" });
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, events_service_1.getEventByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Event not found" });
    }
};
exports.getEventById = getEventById;
const updateEvent = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, events_service_1.getEventByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, events_service_1.updateEventService)(id, req.body);
        res.json({ success: true, data: result, message: "Event updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update event" });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, events_service_1.getEventByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, events_service_1.deleteEventService)(id);
        res.json({ success: true, message: "Event deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete event" });
    }
};
exports.deleteEvent = deleteEvent;
const getPublishedEvents = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, events_service_1.getPublishedEventsService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch published events" });
    }
};
exports.getPublishedEvents = getPublishedEvents;
const registerForEvent = async (req, res) => {
    try {
        const result = await (0, events_service_1.registerForEventService)(req.body);
        res.status(201).json({ success: true, data: result, message: "Registered for event successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to register for event" });
    }
};
exports.registerForEvent = registerForEvent;
const getEventRegistrations = async (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId);
        const churchId = req.user?.churchId;
        const event = await (0, events_service_1.getEventByIdService)(eventId);
        if (event.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, events_service_1.getEventRegistrationsService)(eventId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch registrations" });
    }
};
exports.getEventRegistrations = getEventRegistrations;
const updateEventRegistration = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, events_service_1.updateEventRegistrationService)(id, req.body);
        res.json({ success: true, data: result, message: "Registration updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update registration" });
    }
};
exports.updateEventRegistration = updateEventRegistration;
const deleteEventRegistration = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, events_service_1.deleteEventRegistrationService)(id);
        res.json({ success: true, message: "Registration deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete registration" });
    }
};
exports.deleteEventRegistration = deleteEventRegistration;
const getMemberEventRegistrations = async (req, res) => {
    try {
        const memberId = parseInt(req.params.memberId);
        const result = await (0, events_service_1.getMemberEventRegistrationsService)(memberId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch registrations" });
    }
};
exports.getMemberEventRegistrations = getMemberEventRegistrations;
