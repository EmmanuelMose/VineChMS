import { Request, Response } from "express";
import {
  createServiceService,
  getServicesService,
  getServiceByIdService,
  updateServiceService,
  deleteServiceService,
  getServicesByChurchService,
  getActiveServicesService,
  getServicesByDayService,
} from "./services.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const data = { ...req.body, churchId: Number(churchId) };
    const result = await createServiceService(data);
    res.status(201).json({ success: true, data: result, message: "Service created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create service" });
  }
};

export const getServices = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getServicesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch services" });
  }
};

export const getServiceById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getServiceByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Service not found" });
  }
};

export const updateService = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getServiceByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateServiceService(id, req.body);
    res.json({ success: true, data: result, message: "Service updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update service" });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getServiceByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteServiceService(id);
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete service" });
  }
};

export const getServicesByChurch = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const userChurchId = req.user?.churchId;
    if (churchId !== userChurchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await getServicesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch services" });
  }
};

export const getActiveServices = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getActiveServicesService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch active services" });
  }
};

export const getServicesByDay = async (req: AuthRequest, res: Response) => {
  try {
    const dayOfWeek = parseInt(req.params.dayOfWeek);
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getServicesByDayService(dayOfWeek, churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch services" });
  }
};