import { Router } from "express";
import {
  createAnnouncement,
  getPublishedAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsByChurch,
  publishAnnouncement,
} from "./announcements.controller";
import { authenticate } from "../middleware/auth.middleware";

const announcementsRouter = Router();

announcementsRouter.post("/", authenticate, createAnnouncement);
announcementsRouter.get("/published", authenticate, getPublishedAnnouncements);
announcementsRouter.get("/all", authenticate, getAllAnnouncements);
announcementsRouter.get("/:id", authenticate, getAnnouncementById);
announcementsRouter.put("/:id", authenticate, updateAnnouncement);
announcementsRouter.delete("/:id", authenticate, deleteAnnouncement);
announcementsRouter.get("/church/:churchId", authenticate, getAnnouncementsByChurch);
announcementsRouter.put("/:id/publish", authenticate, publishAnnouncement);

export default announcementsRouter;