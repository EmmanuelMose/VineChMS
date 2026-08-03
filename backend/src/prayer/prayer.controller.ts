import { Request, Response } from "express";
import {
  createPrayerRequestService,
  getPrayerRequestsService,
  getPrayerRequestByIdService,
  updatePrayerRequestService,
  deletePrayerRequestService,
  getPrayerRequestsByChurchService,
  prayForRequestService,
  getPrayerInteractionsService,
} from "./prayer.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPrayerRequest = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createPrayerRequestService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPrayerRequests = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getPrayerRequestsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPrayerRequestById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getPrayerRequestByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updatePrayerRequest = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updatePrayerRequestService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePrayerRequest = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deletePrayerRequestService(id);
    res.json({ success: true, message: "Prayer request deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPrayerRequestsByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getPrayerRequestsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const prayForRequest = async (req: AuthRequest, res: Response) => {
  try {
    const prayerRequestId = parseInt(req.params.id);
    const memberId = req.body.memberId;
    const result = await prayForRequestService(prayerRequestId, memberId);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPrayerInteractions = async (req: Request, res: Response) => {
  try {
    const prayerRequestId = parseInt(req.params.id);
    const result = await getPrayerInteractionsService(prayerRequestId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};