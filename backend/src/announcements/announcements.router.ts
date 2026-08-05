import { Router } from "express";
import {
  createAnnouncement,
  getPublishedAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  getAnnouncementsByChurch,
  getPublishedAnnouncementsByChurch,
  getActiveAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
} from "./announcements.controller";
import { authenticate } from "../middleware/auth.middleware";

const announcementsRouter = Router();

announcementsRouter.post("/", authenticate, createAnnouncement);
announcementsRouter.get("/published", authenticate, getPublishedAnnouncements);
announcementsRouter.get("/all", authenticate, getAllAnnouncements);
announcementsRouter.get("/active", authenticate, getActiveAnnouncements);
announcementsRouter.get("/:id", authenticate, getAnnouncementById);
announcementsRouter.put("/:id", authenticate, updateAnnouncement);
announcementsRouter.delete("/:id", authenticate, deleteAnnouncement);
announcementsRouter.get("/church/:churchId", authenticate, getAnnouncementsByChurch);
announcementsRouter.get("/church/:churchId/published", authenticate, getPublishedAnnouncementsByChurch);
announcementsRouter.put("/:id/publish", authenticate, publishAnnouncement);
announcementsRouter.put("/:id/unpublish", authenticate, unpublishAnnouncement);

export default announcementsRouter;