import { Request, Response } from "express";
import {
  createPrayerRequestService,
  getPrayerRequestByIdService,
  getPrayerRequestsByChurchService,
  updatePrayerRequestService,
  deletePrayerRequestService,
  prayForRequestService,
  getPrayerInteractionsService,
  getOrCreateMember,
} from "./prayer.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPrayerRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const churchId = req.user?.churchId;
    if (!churchId || !userId) {
      return res.status(400).json({ success: false, message: "User or church ID missing" });
    }
    const memberId = await getOrCreateMember(userId, churchId);
    const result = await createPrayerRequestService({ ...req.body, churchId, memberId });
    res.status(201).json({ success: true, data: result, message: "Prayer request created successfully" });
  } catch (error: any) {
    console.error("Error creating prayer request:", error);
    res.status(400).json({ success: false, message: error.message || "Failed to create prayer request" });
  }
};

export const getPrayerRequests = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getPrayerRequestsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch prayer requests" });
  }
};

export const getPrayerRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getPrayerRequestByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Prayer request not found" });
  }
};

export const updatePrayerRequest = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getPrayerRequestByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updatePrayerRequestService(id, req.body);
    res.json({ success: true, data: result, message: "Prayer request updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update prayer request" });
  }
};

export const deletePrayerRequest = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getPrayerRequestByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deletePrayerRequestService(id);
    res.json({ success: true, message: "Prayer request deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete prayer request" });
  }
};

export const prayForRequest = async (req: AuthRequest, res: Response) => {
  try {
    const prayerRequestId = parseInt(req.params.id);
    const userId = req.user?.userId;
    const churchId = req.user?.churchId;
    if (!userId || !churchId) {
      return res.status(400).json({ success: false, message: "User or church missing" });
    }
    const existing = await getPrayerRequestByIdService(prayerRequestId);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const memberId = await getOrCreateMember(userId, churchId);
    const result = await prayForRequestService(prayerRequestId, memberId);
    res.status(201).json({ success: true, data: result, message: "Prayed for request successfully" });
  } catch (error: any) {
    console.error("Error praying for request:", error);
    res.status(400).json({ success: false, message: error.message || "Failed to pray for request" });
  }
};

export const getPrayerInteractions = async (req: AuthRequest, res: Response) => {
  try {
    const prayerRequestId = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getPrayerRequestByIdService(prayerRequestId);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await getPrayerInteractionsService(prayerRequestId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch prayer interactions" });
  }
};