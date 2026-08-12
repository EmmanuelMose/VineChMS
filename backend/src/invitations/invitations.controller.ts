import { Request, Response } from "express";
import {
  createInvitationService,
  getInvitationsService,
  getInvitationByIdService,
  getInvitationByTokenService,
  getInvitationsByEmailService,
  getInvitationsByChurchService,
  getInvitationsByOrganizationService,
  getInvitationsByLargeOrganizationService,
  updateInvitationService,
  deleteInvitationService,
  acceptInvitationService,
  resendInvitationService,
} from "./invitations.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const result = await createInvitationService({ ...req.body, invitedBy: userId });
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getInvitations = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getInvitationsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getInvitationById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getInvitationByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getInvitationByToken = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const result = await getInvitationByTokenService(token);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getInvitationsByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const result = await getInvitationsByEmailService(email);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getInvitationsByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getInvitationsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getInvitationsByOrganization = async (req: Request, res: Response) => {
  try {
    const organizationId = parseInt(req.params.organizationId);
    const result = await getInvitationsByOrganizationService(organizationId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getInvitationsByLargeOrganization = async (req: Request, res: Response) => {
  try {
    const largeOrganizationId = parseInt(req.params.largeOrganizationId);
    const result = await getInvitationsByLargeOrganizationService(largeOrganizationId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateInvitation = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateInvitationService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteInvitation = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteInvitationService(id);
    res.json({ success: true, message: "Invitation deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const acceptInvitation = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const result = await acceptInvitationService(token);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resendInvitation = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await resendInvitationService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};