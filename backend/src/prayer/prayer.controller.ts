import { Request, Response } from "express";
import {
  createPrayerRequestService,
  getPrayerRequestByIdService,
  getPrayerRequestsByChurchService,
  updatePrayerRequestService,
  deletePrayerRequestService,
  prayForRequestService,
  getPrayerInteractionsService,
} from "./prayer.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPrayerRequest = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    const memberId = req.user?.userId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createPrayerRequestService({ ...req.body, churchId, memberId });
    res.status(201).json({ success: true, data: result, message: "Prayer request created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create prayer request" });
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
    const memberId = req.user?.userId;
    const churchId = req.user?.churchId;
    const existing = await getPrayerRequestByIdService(prayerRequestId);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await prayForRequestService(prayerRequestId, memberId!);
    res.status(201).json({ success: true, data: result, message: "Prayed for request successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to pray for request" });
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