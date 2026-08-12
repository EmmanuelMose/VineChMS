import cloudinary, { CloudinaryUploadResult, CloudinaryDeleteResult } from "./cloudinary";

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "vinechms",
  options?: {
    resourceType?: "image" | "video" | "raw" | "auto";
    publicId?: string;
    transformation?: any;
    quality?: number;
    width?: number;
    height?: number;
    crop?: string;
  }
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
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

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result!.url,
            secureUrl: result!.secure_url,
            publicId: result!.public_id,
            format: result!.format,
            width: result!.width,
            height: result!.height,
            bytes: result!.bytes,
            duration: result!.duration,
          });
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const uploadImage = (
  fileBuffer: Buffer,
  folder: string = "vinechms/images",
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
  }
): Promise<CloudinaryUploadResult> => {
  return uploadToCloudinary(fileBuffer, folder, {
    resourceType: "image",
    ...options,
  });
};

export const uploadVideo = (
  fileBuffer: Buffer,
  folder: string = "vinechms/videos",
  options?: {
    quality?: number;
    width?: number;
    height?: number;
  }
): Promise<CloudinaryUploadResult> => {
  return uploadToCloudinary(fileBuffer, folder, {
    resourceType: "video",
    ...options,
  });
};

export const uploadAudio = (
  fileBuffer: Buffer,
  folder: string = "vinechms/audios"
): Promise<CloudinaryUploadResult> => {
  return uploadToCloudinary(fileBuffer, folder, {
    resourceType: "auto",
  });
};

export const uploadDocument = (
  fileBuffer: Buffer,
  folder: string = "vinechms/documents"
): Promise<CloudinaryUploadResult> => {
  return uploadToCloudinary(fileBuffer, folder, {
    resourceType: "raw",
  });
};

export const deleteFromCloudinary = (publicId: string): Promise<CloudinaryDeleteResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          result: result.result,
          publicId,
        });
      }
    });
  });
};

export const deleteMultipleFromCloudinary = async (publicIds: string[]): Promise<CloudinaryDeleteResult[]> => {
  const results: CloudinaryDeleteResult[] = [];
  for (const publicId of publicIds) {
    if (publicId) {
      try {
        const result = await deleteFromCloudinary(publicId);
        results.push(result);
      } catch (error) {
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

export const extractPublicId = (url: string): string => {
  try {
    const urlParts = url.split("/");
    const folderIndex = urlParts.findIndex(part => part === "vinechms");
    if (folderIndex === -1) return "";
    const publicIdWithExt = urlParts.slice(folderIndex).join("/");
    return publicIdWithExt.split(".")[0];
  } catch {
    return "";
  }
};

export const getOptimizedUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    format?: string;
  }
): string => {
  const cloudName = process.env.CLOUD_NAME || "your_cloud_name";
  let url = `https://res.cloudinary.com/${cloudName}/image/upload/`;

  const transformations: string[] = [];
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.crop) transformations.push(`c_${options.crop}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);

  if (transformations.length > 0) {
    url += transformations.join(",") + "/";
  }

  url += publicId;
  return url;
};

export type { CloudinaryUploadResult, CloudinaryDeleteResult };
