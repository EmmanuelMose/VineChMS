import { Request, Response } from "express";
import {
  createAnnouncementService,
  getAnnouncementsService,
  getAllAnnouncementsService,
  getAnnouncementByIdService,
  updateAnnouncementService,
  deleteAnnouncementService,
  getAnnouncementsByChurchService,
  publishAnnouncementService,
} from "./announcements.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createAnnouncementService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPublishedAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getAnnouncementsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getAllAnnouncementsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getAnnouncementByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateAnnouncementService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteAnnouncementService(id);
    res.json({ success: true, message: "Announcement deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAnnouncementsByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getAnnouncementsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const publishAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await publishAnnouncementService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};