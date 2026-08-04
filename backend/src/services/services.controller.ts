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
    const result = await createServiceService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getServices = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getServicesService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getServiceByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateServiceService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteServiceService(id);
    res.json({ success: true, message: "Service deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getServicesByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getServicesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getActiveServices = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getActiveServicesService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getServicesByDay = async (req: Request, res: Response) => {
  try {
    const dayOfWeek = parseInt(req.params.dayOfWeek);
    const result = await getServicesByDayService(dayOfWeek);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};