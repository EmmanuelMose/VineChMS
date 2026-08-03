import { Request, Response } from "express";
import {
  createLargeOrganizationService,
  getLargeOrganizationsService,
  getLargeOrganizationByIdService,
  updateLargeOrganizationService,
  deleteLargeOrganizationService,
  createOrganizationService,
  getOrganizationsService,
  getOrganizationByIdService,
  updateOrganizationService,
  deleteOrganizationService,
} from "./organizations.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createLargeOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await createLargeOrganizationService(userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLargeOrganizations = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getLargeOrganizationsService(req.user!.userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLargeOrganizationById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getLargeOrganizationByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateLargeOrganization = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateLargeOrganizationService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLargeOrganization = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteLargeOrganizationService(id);
    res.json({ success: true, message: "Large organization deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await createOrganizationService(userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOrganizations = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getOrganizationsService(req.user!.userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOrganizationById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getOrganizationByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateOrganizationService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteOrganizationService(id);
    res.json({ success: true, message: "Organization deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};