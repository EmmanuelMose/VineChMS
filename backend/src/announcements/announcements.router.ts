import { Router } from "express";
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getPublishedAnnouncements,
  getActiveAnnouncements,
  publishAnnouncement,
  unpublishAnnouncement,
} from "./announcements.controller";
import { authenticate } from "../middleware/auth.middleware";

const announcementsRouter = Router();

announcementsRouter.post("/", authenticate, createAnnouncement);
announcementsRouter.get("/", authenticate, getAnnouncements);
announcementsRouter.get("/published", authenticate, getPublishedAnnouncements);
announcementsRouter.get("/active", authenticate, getActiveAnnouncements);
announcementsRouter.get("/:id", authenticate, getAnnouncementById);
announcementsRouter.put("/:id", authenticate, updateAnnouncement);
announcementsRouter.delete("/:id", authenticate, deleteAnnouncement);
announcementsRouter.put("/:id/publish", authenticate, publishAnnouncement);
announcementsRouter.put("/:id/unpublish", authenticate, unpublishAnnouncement);

export default announcementsRouter;