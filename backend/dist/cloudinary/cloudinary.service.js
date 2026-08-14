"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileTypeFromMime = exports.getPublicIdFromUrl = exports.updateFile = exports.uploadFile = exports.extractPublicId = exports.deleteMultipleFromCloudinary = exports.deleteFromCloudinary = exports.uploadDocument = exports.uploadAudio = exports.uploadVideo = exports.uploadImage = exports.uploadToCloudinary = void 0;
const cloudinaryUpload_1 = require("../utils/cloudinaryUpload");
Object.defineProperty(exports, "uploadToCloudinary", { enumerable: true, get: function () { return cloudinaryUpload_1.uploadToCloudinary; } });
Object.defineProperty(exports, "uploadImage", { enumerable: true, get: function () { return cloudinaryUpload_1.uploadImage; } });
Object.defineProperty(exports, "uploadVideo", { enumerable: true, get: function () { return cloudinaryUpload_1.uploadVideo; } });
Object.defineProperty(exports, "uploadAudio", { enumerable: true, get: function () { return cloudinaryUpload_1.uploadAudio; } });
Object.defineProperty(exports, "uploadDocument", { enumerable: true, get: function () { return cloudinaryUpload_1.uploadDocument; } });
Object.defineProperty(exports, "deleteFromCloudinary", { enumerable: true, get: function () { return cloudinaryUpload_1.deleteFromCloudinary; } });
Object.defineProperty(exports, "deleteMultipleFromCloudinary", { enumerable: true, get: function () { return cloudinaryUpload_1.deleteMultipleFromCloudinary; } });
Object.defineProperty(exports, "extractPublicId", { enumerable: true, get: function () { return cloudinaryUpload_1.extractPublicId; } });
const uploadFile = async (fileBuffer, folder = "vinechms", options) => {
    return (0, cloudinaryUpload_1.uploadToCloudinary)(fileBuffer, folder, options);
};
exports.uploadFile = uploadFile;
const updateFile = async (oldPublicId, newFileBuffer, folder = "vinechms", options) => {
    if (oldPublicId) {
        await (0, cloudinaryUpload_1.deleteFromCloudinary)(oldPublicId);
    }
    return (0, cloudinaryUpload_1.uploadToCloudinary)(newFileBuffer, folder, options);
};
exports.updateFile = updateFile;
const getPublicIdFromUrl = (url) => {
    return (0, cloudinaryUpload_1.extractPublicId)(url);
};
exports.getPublicIdFromUrl = getPublicIdFromUrl;
const getFileTypeFromMime = (mimeType) => {
    if (mimeType.startsWith("image/"))
        return "image";
    if (mimeType.startsWith("video/"))
        return "video";
    if (mimeType.startsWith("audio/"))
        return "audio";
    return "raw";
};
exports.getFileTypeFromMime = getFileTypeFromMime;
