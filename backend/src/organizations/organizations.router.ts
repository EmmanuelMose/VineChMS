import { Router } from "express";
import {
  createLargeOrganization,
  getLargeOrganizations,
  getLargeOrganizationById,
  updateLargeOrganization,
  deleteLargeOrganization,
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "./organizations.controller";
import { authenticate } from "../middleware/auth.middleware";

const organizationsRouter = Router();

organizationsRouter.post("/large", authenticate, createLargeOrganization);
organizationsRouter.get("/large", authenticate, getLargeOrganizations);
organizationsRouter.get("/large/:id", authenticate, getLargeOrganizationById);
organizationsRouter.put("/large/:id", authenticate, updateLargeOrganization);
organizationsRouter.delete("/large/:id", authenticate, deleteLargeOrganization);

organizationsRouter.post("/", authenticate, createOrganization);
organizationsRouter.get("/", authenticate, getOrganizations);
organizationsRouter.get("/:id", authenticate, getOrganizationById);
organizationsRouter.put("/:id", authenticate, updateOrganization);
organizationsRouter.delete("/:id", authenticate, deleteOrganization);

export default organizationsRouter;