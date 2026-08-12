import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  uploadFile,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} from "./cloudinary.service";

export const uploadFileController = async (req: AuthRequest, res: Response) => {
  console.log("📤 Upload controller reached. User:", req.user?.userId);
  try {
    const file = req.file;
    const { folder, type, quality, width, height, crop } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const folderPath = folder || "vinechms";
    const resourceType = type || "auto";

    const result = await uploadFile(file.buffer, folderPath, {
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
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
};

export const deleteFileController = async (req: AuthRequest, res: Response) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ success: false, message: "Public ID is required" });
    }

    const result = await deleteFromCloudinary(publicId);

    res.json({
      success: true,
      data: result,
      message: "File deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete file",
    });
  }
};

export const deleteMultipleFilesController = async (req: AuthRequest, res: Response) => {
  try {
    const { publicIds } = req.body;

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return res.status(400).json({ success: false, message: "Public IDs are required" });
    }

    const results = await deleteMultipleFromCloudinary(publicIds);

    res.json({
      success: true,
      data: results,
      message: "Files deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete multiple error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete files",
    });
  }
};