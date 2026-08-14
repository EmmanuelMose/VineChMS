"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrayerInteractions = exports.prayForRequest = exports.deletePrayerRequest = exports.updatePrayerRequest = exports.getPrayerRequestById = exports.getPrayerRequests = exports.createPrayerRequest = void 0;
const prayer_service_1 = require("./prayer.service");
const createPrayerRequest = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const churchId = req.user?.churchId;
        if (!churchId || !userId) {
            return res.status(400).json({ success: false, message: "User or church ID missing" });
        }
        const memberId = await (0, prayer_service_1.getOrCreateMember)(userId, churchId);
        const result = await (0, prayer_service_1.createPrayerRequestService)({ ...req.body, churchId, memberId });
        res.status(201).json({ success: true, data: result, message: "Prayer request created successfully" });
    }
    catch (error) {
        console.error("Error creating prayer request:", error);
        res.status(400).json({ success: false, message: error.message || "Failed to create prayer request" });
    }
};
exports.createPrayerRequest = createPrayerRequest;
const getPrayerRequests = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, prayer_service_1.getPrayerRequestsByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch prayer requests" });
    }
};
exports.getPrayerRequests = getPrayerRequests;
const getPrayerRequestById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, prayer_service_1.getPrayerRequestByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Prayer request not found" });
    }
};
exports.getPrayerRequestById = getPrayerRequestById;
const updatePrayerRequest = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, prayer_service_1.getPrayerRequestByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, prayer_service_1.updatePrayerRequestService)(id, req.body);
        res.json({ success: true, data: result, message: "Prayer request updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update prayer request" });
    }
};
exports.updatePrayerRequest = updatePrayerRequest;
const deletePrayerRequest = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, prayer_service_1.getPrayerRequestByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, prayer_service_1.deletePrayerRequestService)(id);
        res.json({ success: true, message: "Prayer request deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete prayer request" });
    }
};
exports.deletePrayerRequest = deletePrayerRequest;
const prayForRequest = async (req, res) => {
    try {
        const prayerRequestId = parseInt(req.params.id);
        const userId = req.user?.userId;
        const churchId = req.user?.churchId;
        if (!userId || !churchId) {
            return res.status(400).json({ success: false, message: "User or church missing" });
        }
        const existing = await (0, prayer_service_1.getPrayerRequestByIdService)(prayerRequestId);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const memberId = await (0, prayer_service_1.getOrCreateMember)(userId, churchId);
        const result = await (0, prayer_service_1.prayForRequestService)(prayerRequestId, memberId);
        res.status(201).json({ success: true, data: result, message: "Prayed for request successfully" });
    }
    catch (error) {
        console.error("Error praying for request:", error);
        res.status(400).json({ success: false, message: error.message || "Failed to pray for request" });
    }
};
exports.prayForRequest = prayForRequest;
const getPrayerInteractions = async (req, res) => {
    try {
        const prayerRequestId = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, prayer_service_1.getPrayerRequestByIdService)(prayerRequestId);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, prayer_service_1.getPrayerInteractionsService)(prayerRequestId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch prayer interactions" });
    }
};
exports.getPrayerInteractions = getPrayerInteractions;
