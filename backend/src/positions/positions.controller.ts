import { Request, Response } from "express";
import {
  createPositionService,
  getPositionsService,
  getPositionByIdService,
  updatePositionService,
  deletePositionService,
  getPositionsByChurchService,
  getPositionsByOrganizationService,
  getPositionsByLargeOrganizationService,
} from "./positions.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPosition = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, churchId, organizationId, largeOrganizationId, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    }

    if (!churchId && !organizationId && !largeOrganizationId) {
      return res.status(400).json({
        success: false,
        message: "At least one of churchId, organizationId, or largeOrganizationId is required",
      });
    }

    const result = await createPositionService({
      name,
      description: description || null,
      churchId: churchId || null,
      organizationId: organizationId || null,
      largeOrganizationId: largeOrganizationId || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPositions = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getPositionsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPositionById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getPositionByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getPositionsByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getPositionsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPositionsByOrganization = async (req: Request, res: Response) => {
  try {
    const organizationId = parseInt(req.params.organizationId);
    const result = await getPositionsByOrganizationService(organizationId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPositionsByLargeOrganization = async (req: Request, res: Response) => {
  try {
    const largeOrganizationId = parseInt(req.params.largeOrganizationId);
    const result = await getPositionsByLargeOrganizationService(largeOrganizationId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePosition = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updatePositionService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePosition = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deletePositionService(id);
    res.json({ success: true, message: "Position deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};