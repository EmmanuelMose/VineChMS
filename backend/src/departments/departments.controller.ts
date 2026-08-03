import { Request, Response } from "express";
import {
  createDepartmentService,
  getDepartmentsService,
  getDepartmentByIdService,
  updateDepartmentService,
  deleteDepartmentService,
  getDepartmentsByLargeOrganizationService,
  getDepartmentsByOrganizationService,
  getDepartmentsByChurchService,
  getSubDepartmentsService,
  addMemberToDepartmentService,
  getDepartmentMembersService,
  removeMemberFromDepartmentService,
  updateDepartmentMemberService,
} from "./departments.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, type, largeOrganizationId, organizationId, churchId, parentDepartmentId, leaderId, isActive } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "name and type are required",
      });
    }

    if (type === "large_org_department" && !largeOrganizationId) {
      return res.status(400).json({
        success: false,
        message: "largeOrganizationId is required for large org departments",
      });
    }

    if (type === "org_department" && !organizationId) {
      return res.status(400).json({
        success: false,
        message: "organizationId is required for org departments",
      });
    }

    if (type === "church_department" && !churchId) {
      return res.status(400).json({
        success: false,
        message: "churchId is required for church departments",
      });
    }

    const result = await createDepartmentService({
      name,
      description,
      type,
      largeOrganizationId: largeOrganizationId || null,
      organizationId: organizationId || null,
      churchId: churchId || null,
      parentDepartmentId: parentDepartmentId || null,
      leaderId: leaderId || null,
      isActive,
    });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getDepartmentsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getDepartmentByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getDepartmentsByLargeOrganization = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.largeOrganizationId);
    const result = await getDepartmentsByLargeOrganizationService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDepartmentsByOrganization = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.organizationId);
    const result = await getDepartmentsByOrganizationService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDepartmentsByChurch = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.churchId);
    const result = await getDepartmentsByChurchService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSubDepartments = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.parentId);
    const result = await getSubDepartmentsService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateDepartmentService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteDepartmentService(id);
    res.json({ success: true, message: "Department deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addMemberToDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { departmentId, memberId, positionId, role, isActive } = req.body;

    if (!departmentId || !memberId) {
      return res.status(400).json({
        success: false,
        message: "departmentId and memberId are required",
      });
    }

    const result = await addMemberToDepartmentService({
      departmentId,
      memberId,
      positionId: positionId || null,
      role: role || null,
      isActive,
    });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDepartmentMembers = async (req: Request, res: Response) => {
  try {
    const departmentId = parseInt(req.params.departmentId);
    const result = await getDepartmentMembersService(departmentId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeMemberFromDepartment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await removeMemberFromDepartmentService(id);
    res.json({ success: true, message: "Member removed from department" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDepartmentMember = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateDepartmentMemberService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};