"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSermon = exports.updateSermon = exports.getSermonById = exports.getSermons = exports.createSermon = void 0;
const sermons_service_1 = require("./sermons.service");
const createSermon = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, sermons_service_1.createSermonService)({ ...req.body, churchId });
        res.status(201).json({ success: true, data: result, message: "Sermon created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create sermon" });
    }
};
exports.createSermon = createSermon;
const getSermons = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, sermons_service_1.getSermonsByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch sermons" });
    }
};
exports.getSermons = getSermons;
const getSermonById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, sermons_service_1.getSermonByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Sermon not found" });
    }
};
exports.getSermonById = getSermonById;
const updateSermon = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, sermons_service_1.getSermonByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, sermons_service_1.updateSermonService)(id, req.body);
        res.json({ success: true, data: result, message: "Sermon updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update sermon" });
    }
};
exports.updateSermon = updateSermon;
const deleteSermon = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, sermons_service_1.getSermonByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, sermons_service_1.deleteSermonService)(id);
        res.json({ success: true, message: "Sermon deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete sermon" });
    }
};
exports.deleteSermon = deleteSermon;
