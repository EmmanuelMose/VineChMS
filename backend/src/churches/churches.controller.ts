import { Request, Response } from "express";
import {
  createChurchService,
  getChurchByIdService,
  getChurchesByOrganizationService,
  getChurchesService,
  updateChurchService,
  deleteChurchService,
  getChurchMembersService,
  getChurchesByOrganizationIdsService,
} from "./churches.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { organizations } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../Drizzle/db";

export const createChurch = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const { organizationId } = req.body;

    if (!organizationId) {
      return res.status(400).json({ 
        success: false, 
        message: "Organization ID is required" 
      });
    }

    // Verify user has access to the organization
    if (userRole !== "super_admin") {
      const organization = await db.query.organizations.findFirst({
        where: eq(organizations.organizationId, organizationId),
      });

      if (!organization) {
        return res.status(404).json({ 
          success: false, 
          message: "Organization not found" 
        });
      }

      if (organization.createdBy !== userId && userRole !== "large_org_admin") {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    }

    const result = await createChurchService(userId, req.body);
    res.status(201).json({ 
      success: true, 
      data: result, 
      message: "Church created successfully" 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to create church" 
    });
  }
};

export const getChurches = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const organizationId = req.user?.organizationId;
    const largeOrganizationId = req.user?.largeOrganizationId;

    let result;

    if (userRole === "super_admin") {
      result = await getChurchesService();
    } else if (userRole === "large_org_admin" || userRole === "large_org_member") {
      // Get all organizations under this large org
      const orgs = await db.query.organizations.findMany({
        where: eq(organizations.largeOrganizationId, largeOrganizationId!),
      });
      const orgIds = orgs.map(o => o.organizationId);
      result = await getChurchesByOrganizationIdsService(orgIds);
    } else if (userRole === "small_org_admin" || userRole === "small_org_member") {
      result = await getChurchesByOrganizationService(organizationId!);
    } else if (userRole === "church_admin" || userRole === "church_member" || userRole === "pastor") {
      const churchId = req.user?.churchId;
      const church = await getChurchByIdService(churchId!);
      result = [church];
    } else {
      result = await getChurchesByOrganizationService(organizationId!);
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to fetch churches" 
    });
  }
};

export const getChurchById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getChurchByIdService(id);
    
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const organizationId = req.user?.organizationId;
    const largeOrganizationId = req.user?.largeOrganizationId;

    // Check access based on role
    if (userRole === "super_admin") {
      // Super admin can access any church
    } else if (userRole === "large_org_admin" || userRole === "large_org_member") {
      // Check if church belongs to an organization under this large org
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.organizationId, result.organizationId),
      });
      if (org?.largeOrganizationId !== largeOrganizationId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    } else if (userRole === "small_org_admin" || userRole === "small_org_member") {
      if (result.organizationId !== organizationId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    } else if (userRole === "church_admin" || userRole === "church_member" || userRole === "pastor") {
      if (result.churchId !== req.user?.churchId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    } else {
      if (result.createdBy !== userId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: "Church not found" 
    });
  }
};

export const updateChurch = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const organizationId = req.user?.organizationId;
    const largeOrganizationId = req.user?.largeOrganizationId;
    
    const existing = await getChurchByIdService(id);

    // Check access based on role
    if (userRole === "super_admin") {
      // Super admin can update any church
    } else if (userRole === "large_org_admin" || userRole === "large_org_member") {
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.organizationId, existing.organizationId),
      });
      if (org?.largeOrganizationId !== largeOrganizationId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    } else if (userRole === "small_org_admin" || userRole === "small_org_member") {
      if (existing.organizationId !== organizationId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    } else if (userRole === "church_admin") {
      if (existing.churchId !== req.user?.churchId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    } else {
      if (existing.createdBy !== userId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    }

    const result = await updateChurchService(id, req.body);
    res.json({ 
      success: true, 
      data: result, 
      message: "Church updated successfully" 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to update church" 
    });
  }
};

export const deleteChurch = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const organizationId = req.user?.organizationId;
    const largeOrganizationId = req.user?.largeOrganizationId;
    
    const existing = await getChurchByIdService(id);

    // Only super admin or the creator can delete
    if (userRole !== "super_admin") {
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.organizationId, existing.organizationId),
      });
      
      if (userRole === "large_org_admin" || userRole === "large_org_member") {
        if (org?.largeOrganizationId !== largeOrganizationId) {
          return res.status(403).json({ 
            success: false, 
            message: "Access denied" 
          });
        }
      } else if (userRole === "small_org_admin" || userRole === "small_org_member") {
        if (existing.organizationId !== organizationId) {
          return res.status(403).json({ 
            success: false, 
            message: "Access denied" 
          });
        }
      } else {
        if (existing.createdBy !== userId) {
          return res.status(403).json({ 
            success: false, 
            message: "Access denied" 
          });
        }
      }
    }

    await deleteChurchService(id);
    res.json({ 
      success: true, 
      message: "Church deleted successfully" 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to delete church" 
    });
  }
};

export const getChurchMembers = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const church = await getChurchByIdService(id);
    
    const userRole = req.user?.role;
    const organizationId = req.user?.organizationId;
    const largeOrganizationId = req.user?.largeOrganizationId;
    const churchId = req.user?.churchId;

    // Check access
    if (userRole === "super_admin") {
      // Super admin can access any church members
    } else if (userRole === "large_org_admin" || userRole === "large_org_member") {
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.organizationId, church.organizationId),
      });
      if (org?.largeOrganizationId !== largeOrganizationId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    } else if (userRole === "small_org_admin" || userRole === "small_org_member") {
      if (church.organizationId !== organizationId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    } else if (userRole === "church_admin" || userRole === "pastor") {
      if (church.churchId !== churchId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    } else if (userRole === "church_member") {
      if (church.churchId !== churchId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    } else {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied" 
      });
    }

    const result = await getChurchMembersService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to fetch church members" 
    });
  }
};