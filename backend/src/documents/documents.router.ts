import { Router } from "express";
import {
  createDocument,
  getDocuments,
  getAllDocuments,
  getDocumentById,
  getDocumentsByChurch,
  getDocumentsByType,
  getDocumentsByVisibility,
  getDocumentsByUploader,
  updateDocument,
  deleteDocument,
  hardDeleteDocument,
  restoreDocument,
  getActiveDocuments,
  getInactiveDocuments,
  getDocumentsCount,
} from "./documents.controller";
import { authenticate } from "../middleware/auth.middleware";

const documentsRouter = Router();

documentsRouter.post("/", authenticate, createDocument);
documentsRouter.get("/", authenticate, getDocuments);
documentsRouter.get("/all", authenticate, getAllDocuments);
documentsRouter.get("/active", authenticate, getActiveDocuments);
documentsRouter.get("/inactive", authenticate, getInactiveDocuments);
documentsRouter.get("/count", authenticate, getDocumentsCount);
documentsRouter.get("/:id", authenticate, getDocumentById);
documentsRouter.put("/:id", authenticate, updateDocument);
documentsRouter.delete("/:id", authenticate, deleteDocument);
documentsRouter.delete("/:id/permanent", authenticate, hardDeleteDocument);
documentsRouter.put("/:id/restore", authenticate, restoreDocument);
documentsRouter.get("/church/:churchId", authenticate, getDocumentsByChurch);
documentsRouter.get("/type/:documentType", authenticate, getDocumentsByType);
documentsRouter.get("/visibility/:visibility", authenticate, getDocumentsByVisibility);
documentsRouter.get("/uploader/:uploadedBy", authenticate, getDocumentsByUploader);

export default documentsRouter;