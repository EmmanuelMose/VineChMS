import { Router, type RequestHandler } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/upload.middleware";
import {
  uploadFileController,
  deleteFileController,
  deleteMultipleFilesController,
} from "./cloudinary.controller";

const cloudinaryRouter = Router();

cloudinaryRouter.post(
  "/upload",
  authenticate,
  authorize("church_admin", "pastor", "elder", "secretary", "treasurer", "church_member"),
  uploadSingle("file", 50) as unknown as RequestHandler,
  uploadFileController
);

cloudinaryRouter.delete(
  "/delete",
  authenticate,
  authorize("church_admin", "pastor", "elder", "secretary", "treasurer"),
  deleteFileController
);

cloudinaryRouter.delete(
  "/delete-multiple",
  authenticate,
  authorize("church_admin", "pastor", "elder", "secretary", "treasurer"),
  deleteMultipleFilesController
);

export default cloudinaryRouter;