import { Request, Response } from "express";
import {
  createDocumentService,
  getDocumentsService,
  getAllDocumentsService,
  getDocumentByIdService,
  getDocumentsByChurchService,
  getDocumentsByTypeService,
  getDocumentsByVisibilityService,
  getDocumentsByUploaderService,
  updateDocumentService,
  deleteDocumentService,
  hardDeleteDocumentService,
  restoreDocumentService,
  getActiveDocumentsService,
  getInactiveDocumentsService,
  getDocumentsCountService,
} from "./documents.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const result = await createDocumentService({ ...req.body, uploadedBy: userId });
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getDocumentsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getAllDocumentsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getDocumentByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getDocumentsByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getDocumentsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDocumentsByType = async (req: Request, res: Response) => {
  try {
    const documentType = req.params.documentType;
    const result = await getDocumentsByTypeService(documentType);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDocumentsByVisibility = async (req: Request, res: Response) => {
  try {
    const visibility = req.params.visibility;
    const result = await getDocumentsByVisibilityService(visibility);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDocumentsByUploader = async (req: Request, res: Response) => {
  try {
    const uploadedBy = parseInt(req.params.uploadedBy);
    const result = await getDocumentsByUploaderService(uploadedBy);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateDocumentService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteDocumentService(id);
    res.json({ success: true, message: "Document deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const hardDeleteDocument = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await hardDeleteDocumentService(id);
    res.json({ success: true, message: "Document permanently deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const restoreDocument = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await restoreDocumentService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getActiveDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getActiveDocumentsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getInactiveDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getInactiveDocumentsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDocumentsCount = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getDocumentsCountService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};