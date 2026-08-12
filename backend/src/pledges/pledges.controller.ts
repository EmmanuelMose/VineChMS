import { Request, Response } from "express";
import {
  createPledgeService,
  getPledgeByIdService,
  getPledgesByChurchService,
  getPledgesByMemberService,
  getPledgesByCategoryService,
  getFulfilledPledgesService,
  getUnfulfilledPledgesService,
  updatePledgeService,
  deletePledgeService,
  fulfillPledgeService,
  getPledgesSummaryService,
} from "./pledges.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPledge = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ 
        success: false, 
        message: "Church ID is required" 
      });
    }

    const result = await createPledgeService({ ...req.body, churchId });
    res.status(201).json({ 
      success: true, 
      data: result, 
      message: "Pledge created successfully" 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to create pledge" 
    });
  }
};

export const getPledges = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ 
        success: false, 
        message: "Church ID is required" 
      });
    }

    const result = await getPledgesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to fetch pledges" 
    });
  }
};

export const getPledgeById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getPledgeByIdService(id);
    
    if (result.churchId !== churchId) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied" 
      });
    }
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: "Pledge not found" 
    });
  }
};

export const updatePledge = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getPledgeByIdService(id);
    
    if (existing.churchId !== churchId) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied" 
      });
    }
    
    const result = await updatePledgeService(id, req.body);
    res.json({ 
      success: true, 
      data: result, 
      message: "Pledge updated successfully" 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to update pledge" 
    });
  }
};

export const deletePledge = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getPledgeByIdService(id);
    
    if (existing.churchId !== churchId) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied" 
      });
    }
    
    await deletePledgeService(id);
    res.json({ 
      success: true, 
      message: "Pledge deleted successfully" 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to delete pledge" 
    });
  }
};

export const getPledgesByMember = async (req: AuthRequest, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const churchId = req.user?.churchId;
    const result = await getPledgesByMemberService(memberId);
    
    // Filter by church to ensure data isolation
    const filtered = result.filter(pledge => pledge.churchId === churchId);
    
    res.json({ success: true, data: filtered });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to fetch pledges" 
    });
  }
};

export const getPledgesByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const churchId = req.user?.churchId;
    const result = await getPledgesByCategoryService(categoryId);
    
    // Filter by church to ensure data isolation
    const filtered = result.filter(pledge => pledge.churchId === churchId);
    
    res.json({ success: true, data: filtered });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to fetch pledges" 
    });
  }
};

export const getFulfilledPledges = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ 
        success: false, 
        message: "Church ID is required" 
      });
    }

    const result = await getFulfilledPledgesService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to fetch fulfilled pledges" 
    });
  }
};

export const getUnfulfilledPledges = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ 
        success: false, 
        message: "Church ID is required" 
      });
    }

    const result = await getUnfulfilledPledgesService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to fetch unfulfilled pledges" 
    });
  }
};

export const fulfillPledge = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getPledgeByIdService(id);
    
    if (existing.churchId !== churchId) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied" 
      });
    }
    
    const result = await fulfillPledgeService(id);
    res.json({ 
      success: true, 
      data: result, 
      message: "Pledge fulfilled successfully" 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to fulfill pledge" 
    });
  }
};

export const getPledgesSummary = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ 
        success: false, 
        message: "Church ID is required" 
      });
    }

    const result = await getPledgesSummaryService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Failed to fetch pledges summary" 
    });
  }
};