import { Router } from "express";
import {
  createPosition,
  getPositions,
  getPositionById,
  updatePosition,
  deletePosition,
  getPositionsByChurch,
  getPositionsByOrganization,
  getPositionsByLargeOrganization,
} from "./positions.controller";
import { authenticate } from "../middleware/auth.middleware";

const positionsRouter = Router();

positionsRouter.post("/", authenticate, createPosition);
positionsRouter.get("/", authenticate, getPositions);
positionsRouter.get("/:id", authenticate, getPositionById);
positionsRouter.put("/:id", authenticate, updatePosition);
positionsRouter.delete("/:id", authenticate, deletePosition);

positionsRouter.get("/church/:churchId", authenticate, getPositionsByChurch);
positionsRouter.get("/organization/:organizationId", authenticate, getPositionsByOrganization);
positionsRouter.get("/large-org/:largeOrganizationId", authenticate, getPositionsByLargeOrganization);

export default positionsRouter;