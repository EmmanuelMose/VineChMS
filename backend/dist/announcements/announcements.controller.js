"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpublishAnnouncement = exports.publishAnnouncement = exports.getActiveAnnouncements = exports.getPublishedAnnouncements = exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncementById = exports.getAnnouncements = exports.createAnnouncement = void 0;
const announcements_service_1 = require("./announcements.service");
const createAnnouncement = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, announcements_service_1.createAnnouncementService)({ ...req.body, churchId, createdBy: userId });
        res.status(201).json({ success: true, data: result, message: "Announcement created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create announcement" });
    }
};
exports.createAnnouncement = createAnnouncement;
const getAnnouncements = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, announcements_service_1.getAnnouncementsByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch announcements" });
    }
};
exports.getAnnouncements = getAnnouncements;
const getAnnouncementById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, announcements_service_1.getAnnouncementByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Announcement not found" });
    }
};
exports.getAnnouncementById = getAnnouncementById;
const updateAnnouncement = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, announcements_service_1.getAnnouncementByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, announcements_service_1.updateAnnouncementService)(id, req.body);
        res.json({ success: true, data: result, message: "Announcement updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update announcement" });
    }
};
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, announcements_service_1.getAnnouncementByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, announcements_service_1.deleteAnnouncementService)(id);
        res.json({ success: true, message: "Announcement deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete announcement" });
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
const getPublishedAnnouncements = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, announcements_service_1.getPublishedAnnouncementsByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch published announcements" });
    }
};
exports.getPublishedAnnouncements = getPublishedAnnouncements;
const getActiveAnnouncements = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, announcements_service_1.getActiveAnnouncementsService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch active announcements" });
    }
};
exports.getActiveAnnouncements = getActiveAnnouncements;
const publishAnnouncement = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, announcements_service_1.getAnnouncementByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, announcements_service_1.publishAnnouncementService)(id);
        res.json({ success: true, data: result, message: "Announcement published successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to publish announcement" });
    }
};
exports.publishAnnouncement = publishAnnouncement;
const unpublishAnnouncement = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, announcements_service_1.getAnnouncementByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, announcements_service_1.unpublishAnnouncementService)(id);
        res.json({ success: true, data: result, message: "Announcement unpublished successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to unpublish announcement" });
    }
};
exports.unpublishAnnouncement = unpublishAnnouncement;
