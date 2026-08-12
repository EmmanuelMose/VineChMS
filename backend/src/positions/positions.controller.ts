import { Request, Response } from "express";
import {
  createPositionService,
  getPositionByIdService,
  getPositionsByChurchService,
  getPositionsByOrganizationService,
  getPositionsByLargeOrganizationService,
  updatePositionService,
  deletePositionService,
} from "./positions.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPosition = async (req: AuthRequest, res: Response) => {
  try {
    const { churchId, organizationId, largeOrganizationId } = req.body;
    const userChurchId = req.user?.churchId;
    const userOrganizationId = req.user?.organizationId;
    const userLargeOrganizationId = req.user?.largeOrganizationId;

    if (churchId && churchId !== userChurchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (organizationId && organizationId !== userOrganizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (largeOrganizationId && largeOrganizationId !== userLargeOrganizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const result = await createPositionService(req.body);
    res.status(201).json({ success: true, data: result, message: "Position created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create position" });
  }
};

export const getPositions = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    const organizationId = req.user?.organizationId;
    const largeOrganizationId = req.user?.largeOrganizationId;
    const userRole = req.user?.role;

    let result;
    if (userRole === "church_admin" || userRole === "church_member" || userRole === "pastor") {
      result = await getPositionsByChurchService(churchId!);
    } else if (userRole === "small_org_admin" || userRole === "small_org_member") {
      result = await getPositionsByOrganizationService(organizationId!);
    } else if (userRole === "large_org_admin" || userRole === "large_org_member") {
      result = await getPositionsByLargeOrganizationService(largeOrganizationId!);
    } else {
      result = await getPositionsByChurchService(churchId!);
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch positions" });
  }
};

export const getPositionById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getPositionByIdService(id);
    
    const churchId = req.user?.churchId;
    const organizationId = req.user?.organizationId;
    const largeOrganizationId = req.user?.largeOrganizationId;

    if (result.churchId && result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (result.organizationId && result.organizationId !== organizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (result.largeOrganizationId && result.largeOrganizationId !== largeOrganizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Position not found" });
  }
};

export const updatePosition = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await getPositionByIdService(id);
    
    const churchId = req.user?.churchId;
    const organizationId = req.user?.organizationId;
    const largeOrganizationId = req.user?.largeOrganizationId;

    if (existing.churchId && existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (existing.organizationId && existing.organizationId !== organizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (existing.largeOrganizationId && existing.largeOrganizationId !== largeOrganizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const result = await updatePositionService(id, req.body);
    res.json({ success: true, data: result, message: "Position updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update position" });
  }
};

export const deletePosition = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await getPositionByIdService(id);
    
    const churchId = req.user?.churchId;
    const organizationId = req.user?.organizationId;
    const largeOrganizationId = req.user?.largeOrganizationId;

    if (existing.churchId && existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (existing.organizationId && existing.organizationId !== organizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (existing.largeOrganizationId && existing.largeOrganizationId !== largeOrganizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await deletePositionService(id);
    res.json({ success: true, message: "Position deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete position" });
  }
};