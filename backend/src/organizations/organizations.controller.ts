import { Request, Response } from "express";
import {
  createLargeOrganizationService,
  getLargeOrganizationByIdService,
  getLargeOrganizationsService,
  updateLargeOrganizationService,
  deleteLargeOrganizationService,
  createOrganizationService,
  getOrganizationByIdService,
  getOrganizationsByLargeOrganizationService,
  updateOrganizationService,
  deleteOrganizationService,
  getOrganizationsService,
} from "./organizations.service";
import { AuthRequest } from "../middleware/auth.middleware";

// LARGE ORGANIZATIONS
export const createLargeOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await createLargeOrganizationService(userId, req.body);
    res.status(201).json({ success: true, data: result, message: "Large organization created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create large organization" });
  }
};

export const getLargeOrganizations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    let result;
    
    if (userRole === "super_admin") {
      result = await getLargeOrganizationsService();
    } else {
      result = await getLargeOrganizationsService(userId);
    }
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch large organizations" });
  }
};

export const getLargeOrganizationById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getLargeOrganizationByIdService(id);
    
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    
    if (userRole !== "super_admin" && result.createdBy !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Large organization not found" });
  }
};

export const updateLargeOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const existing = await getLargeOrganizationByIdService(id);
    
    if (userRole !== "super_admin" && existing.createdBy !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    const result = await updateLargeOrganizationService(id, req.body);
    res.json({ success: true, data: result, message: "Large organization updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update large organization" });
  }
};

export const deleteLargeOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const existing = await getLargeOrganizationByIdService(id);
    
    if (userRole !== "super_admin" && existing.createdBy !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    await deleteLargeOrganizationService(id);
    res.json({ success: true, message: "Large organization deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete large organization" });
  }
};

// SMALL ORGANIZATIONS
export const createOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { largeOrganizationId } = req.body;
    
    // Verify access to the large organization
    const largeOrg = await getLargeOrganizationByIdService(largeOrganizationId);
    if (largeOrg.createdBy !== userId && req.user?.role !== "super_admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    const result = await createOrganizationService(userId, req.body);
    res.status(201).json({ success: true, data: result, message: "Organization created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create organization" });
  }
};

export const getOrganizations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const largeOrganizationId = req.user?.largeOrganizationId;
    
    let result;
    if (userRole === "super_admin") {
      result = await getOrganizationsByLargeOrganizationService(largeOrganizationId!);
    } else if (userRole === "large_org_admin" || userRole === "large_org_member") {
      result = await getOrganizationsByLargeOrganizationService(largeOrganizationId!);
    } else {
      result = await getOrganizationsService(userId);
    }
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch organizations" });
  }
};

export const getOrganizationById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getOrganizationByIdService(id);
    
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const largeOrganizationId = req.user?.largeOrganizationId;
    
    if (userRole !== "super_admin" && 
        result.createdBy !== userId && 
        result.largeOrganizationId !== largeOrganizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Organization not found" });
  }
};

export const updateOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const largeOrganizationId = req.user?.largeOrganizationId;
    const existing = await getOrganizationByIdService(id);
    
    if (userRole !== "super_admin" && 
        existing.createdBy !== userId && 
        existing.largeOrganizationId !== largeOrganizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    const result = await updateOrganizationService(id, req.body);
    res.json({ success: true, data: result, message: "Organization updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update organization" });
  }
};

export const deleteOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const largeOrganizationId = req.user?.largeOrganizationId;
    const existing = await getOrganizationByIdService(id);
    
    if (userRole !== "super_admin" && 
        existing.createdBy !== userId && 
        existing.largeOrganizationId !== largeOrganizationId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    await deleteOrganizationService(id);
    res.json({ success: true, message: "Organization deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete organization" });
  }
};