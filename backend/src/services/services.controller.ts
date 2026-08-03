import { Request, Response } from "express";
import {
  createServiceService,
  getServicesService,
  getServiceByIdService,
  updateServiceService,
  deleteServiceService,
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