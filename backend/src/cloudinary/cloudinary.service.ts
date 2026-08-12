import {
  uploadToCloudinary,
  uploadImage,
  uploadVideo,
  uploadAudio,
  uploadDocument,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  extractPublicId,
  CloudinaryUploadResult,
  CloudinaryDeleteResult,
} from "../utils/cloudinaryUpload";

export {
  uploadToCloudinary,
  uploadImage,
  uploadVideo,
  uploadAudio,
  uploadDocument,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  extractPublicId
};
  export type {
    CloudinaryUploadResult,
    CloudinaryDeleteResult
  };

export const uploadFile = async (
  fileBuffer: Buffer,
  folder: string = "vinechms",
  options?: {
    resourceType?: "image" | "video" | "raw" | "auto";
    quality?: number;
    width?: number;
    height?: number;
    crop?: string;
  }
): Promise<CloudinaryUploadResult> => {
  return uploadToCloudinary(fileBuffer, folder, options);
};

export const updateFile = async (
  oldPublicId: string | null | undefined,
  newFileBuffer: Buffer,
  folder: string = "vinechms",
  options?: {
    resourceType?: "image" | "video" | "raw" | "auto";
    quality?: number;
    width?: number;
    height?: number;
    crop?: string;
  }
): Promise<CloudinaryUploadResult> => {
  if (oldPublicId) {
    await deleteFromCloudinary(oldPublicId);
  }
  return uploadToCloudinary(newFileBuffer, folder, options);
};

export const getPublicIdFromUrl = (url: string): string => {
  return extractPublicId(url);
};

export const getFileTypeFromMime = (mimeType: string): "image" | "video" | "audio" | "raw" => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "raw";
};