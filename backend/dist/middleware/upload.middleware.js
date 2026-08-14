"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadArray = exports.uploadMultiple = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    const allowedAudioTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm"];
    const allowedDocumentTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
        "text/plain",
    ];
    const allAllowed = [...allowedImageTypes, ...allowedVideoTypes, ...allowedAudioTypes, ...allowedDocumentTypes];
    if (allAllowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
};
const uploadSingle = (fieldName, maxSizeMB = 10) => {
    return (0, multer_1.default)({
        storage,
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
        fileFilter,
    }).single(fieldName);
};
exports.uploadSingle = uploadSingle;
const uploadMultiple = (fields, maxSizeMB = 10) => {
    return (0, multer_1.default)({
        storage,
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
        fileFilter,
    }).fields(fields);
};
exports.uploadMultiple = uploadMultiple;
const uploadArray = (fieldName, maxCount = 10, maxSizeMB = 10) => {
    return (0, multer_1.default)({
        storage,
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
        fileFilter,
    }).array(fieldName, maxCount);
};
exports.uploadArray = uploadArray;
