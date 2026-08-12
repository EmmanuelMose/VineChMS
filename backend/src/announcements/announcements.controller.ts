import { Request, Response } from "express";
import {
  createAnnouncementService,
  getAnnouncementByIdService,
  getAnnouncementsByChurchService,
  getPublishedAnnouncementsByChurchService,
  getActiveAnnouncementsService,
  updateAnnouncementService,
  deleteAnnouncementService,
  publishAnnouncementService,
  unpublishAnnouncementService,
} from "./announcements.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createAnnouncementService({ ...req.body, churchId, createdBy: userId });
    res.status(201).json({ success: true, data: result, message: "Announcement created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create announcement" });
  }
};

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getAnnouncementsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch announcements" });
  }
};

export const getAnnouncementById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getAnnouncementByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Announcement not found" });
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getAnnouncementByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateAnnouncementService(id, req.body);
    res.json({ success: true, data: result, message: "Announcement updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update announcement" });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getAnnouncementByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteAnnouncementService(id);
    res.json({ success: true, message: "Announcement deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete announcement" });
  }
};

export const getPublishedAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getPublishedAnnouncementsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch published announcements" });
  }
};

export const getActiveAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getActiveAnnouncementsService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch active announcements" });
  }
};

export const publishAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getAnnouncementByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await publishAnnouncementService(id);
    res.json({ success: true, data: result, message: "Announcement published successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to publish announcement" });
  }
};

export const unpublishAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getAnnouncementByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await unpublishAnnouncementService(id);
    res.json({ success: true, data: result, message: "Announcement unpublished successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to unpublish announcement" });
  }
};