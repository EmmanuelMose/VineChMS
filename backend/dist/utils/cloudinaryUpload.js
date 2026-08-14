"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptimizedUrl = exports.extractPublicId = exports.deleteMultipleFromCloudinary = exports.deleteFromCloudinary = exports.uploadDocument = exports.uploadAudio = exports.uploadVideo = exports.uploadImage = exports.uploadToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
const uploadToCloudinary = (fileBuffer, folder = "vinechms", options) => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder,
            resource_type: options?.resourceType || "auto",
        };
        if (options?.publicId) {
            uploadOptions.public_id = options.publicId;
        }
        if (options?.transformation) {
            uploadOptions.transformation = options.transformation;
        }
        if (options?.quality) {
            uploadOptions.quality = options.quality;
        }
        if (options?.width && options?.height) {
            uploadOptions.width = options.width;
            uploadOptions.height = options.height;
        }
        if (options?.crop) {
            uploadOptions.crop = options.crop;
        }
        const uploadStream = cloudinary_1.default.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve({
                    url: result.url,
                    secureUrl: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    bytes: result.bytes,
                    duration: result.duration,
                });
            }
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const uploadImage = (fileBuffer, folder = "vinechms/images", options) => {
    return (0, exports.uploadToCloudinary)(fileBuffer, folder, {
        resourceType: "image",
        ...options,
    });
};
exports.uploadImage = uploadImage;
const uploadVideo = (fileBuffer, folder = "vinechms/videos", options) => {
    return (0, exports.uploadToCloudinary)(fileBuffer, folder, {
        resourceType: "video",
        ...options,
    });
};
exports.uploadVideo = uploadVideo;
const uploadAudio = (fileBuffer, folder = "vinechms/audios") => {
    return (0, exports.uploadToCloudinary)(fileBuffer, folder, {
        resourceType: "auto",
    });
};
exports.uploadAudio = uploadAudio;
const uploadDocument = (fileBuffer, folder = "vinechms/documents") => {
    return (0, exports.uploadToCloudinary)(fileBuffer, folder, {
        resourceType: "raw",
    });
};
exports.uploadDocument = uploadDocument;
const deleteFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.default.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve({
                    result: result.result,
                    publicId,
                });
            }
        });
    });
};
exports.deleteFromCloudinary = deleteFromCloudinary;
const deleteMultipleFromCloudinary = async (publicIds) => {
    const results = [];
    for (const publicId of publicIds) {
        if (publicId) {
            try {
                const result = await (0, exports.deleteFromCloudinary)(publicId);
                results.push(result);
            }
            catch (error) {
                console.error(`Failed to delete ${publicId}:`, error);
                results.push({
                    result: "error",
                    publicId,
                });
            }
        }
    }
    return results;
};
exports.deleteMultipleFromCloudinary = deleteMultipleFromCloudinary;
const extractPublicId = (url) => {
    try {
        const urlParts = url.split("/");
        const folderIndex = urlParts.findIndex(part => part === "vinechms");
        if (folderIndex === -1)
            return "";
        const publicIdWithExt = urlParts.slice(folderIndex).join("/");
        return publicIdWithExt.split(".")[0];
    }
    catch {
        return "";
    }
};
exports.extractPublicId = extractPublicId;
const getOptimizedUrl = (publicId, options) => {
    const cloudName = process.env.CLOUD_NAME || "your_cloud_name";
    let url = `https://res.cloudinary.com/${cloudName}/image/upload/`;
    const transformations = [];
    if (options?.width)
        transformations.push(`w_${options.width}`);
    if (options?.height)
        transformations.push(`h_${options.height}`);
    if (options?.crop)
        transformations.push(`c_${options.crop}`);
    if (options?.quality)
        transformations.push(`q_${options.quality}`);
    if (options?.format)
        transformations.push(`f_${options.format}`);
    if (transformations.length > 0) {
        url += transformations.join(",") + "/";
    }
    url += publicId;
    return url;
};
exports.getOptimizedUrl = getOptimizedUrl;
