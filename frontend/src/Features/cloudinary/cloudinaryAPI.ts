import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface CloudinaryUploadResponse {
  url: string;
  secureUrl: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export const uploadFileToCloudinary = async (
  file: File,
  token: string,
  folder: string = "vinechms/events",
  options?: {
    resourceType?: "image" | "video" | "raw" | "auto";
    quality?: number;
    width?: number;
    height?: number;
    crop?: string;
  }
): Promise<CloudinaryUploadResponse> => {
  console.log("🔑 Token being sent:", token);
  console.log("🔑 Token length:", token?.length);
  console.log("🔑 Token preview:", token?.substring(0, 20) + "...");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  if (options?.resourceType) formData.append("type", options.resourceType);
  if (options?.quality) formData.append("quality", String(options.quality));
  if (options?.width) formData.append("width", String(options.width));
  if (options?.height) formData.append("height", String(options.height));
  if (options?.crop) formData.append("crop", options.crop);

  try {
    const response = await axios.post(`${ApiDomain}/cloudinary/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Upload error status:", error.response?.status);
    console.error("❌ Upload error data:", error.response?.data);
    throw error;
  }
};