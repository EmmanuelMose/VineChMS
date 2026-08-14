"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMultipleFilesController = exports.deleteFileController = exports.uploadFileController = void 0;
const cloudinary_service_1 = require("./cloudinary.service");
const uploadFileController = async (req, res) => {
    console.log("📤 Upload controller reached. User:", req.user?.userId);
    try {
        const file = req.file;
        const { folder, type, quality, width, height, crop } = req.body;
        if (!file) {
            return res.status(400).json({ success: false, message: "No file provided" });
        }
        const folderPath = folder || "vinechms";
        const resourceType = type || "auto";
        const result = await (0, cloudinary_service_1.uploadFile)(file.buffer, folderPath, {
            resourceType,
            quality: quality ? parseInt(quality) : undefined,
            width: width ? parseInt(width) : undefined,
            height: height ? parseInt(height) : undefined,
            crop,
        });
        res.json({
            success: true,
            data: result,
            message: "File uploaded successfully",
        });
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to upload file",
        });
    }
};
exports.uploadFileController = uploadFileController;
const deleteFileController = async (req, res) => {
    try {
        const { publicId } = req.body;
        if (!publicId) {
            return res.status(400).json({ success: false, message: "Public ID is required" });
        }
        const result = await (0, cloudinary_service_1.deleteFromCloudinary)(publicId);
        res.json({
            success: true,
            data: result,
            message: "File deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to delete file",
        });
    }
};
exports.deleteFileController = deleteFileController;
const deleteMultipleFilesController = async (req, res) => {
    try {
        const { publicIds } = req.body;
        if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
            return res.status(400).json({ success: false, message: "Public IDs are required" });
        }
        const results = await (0, cloudinary_service_1.deleteMultipleFromCloudinary)(publicIds);
        res.json({
            success: true,
            data: results,
            message: "Files deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete multiple error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to delete files",
        });
    }
};
exports.deleteMultipleFilesController = deleteMultipleFilesController;
