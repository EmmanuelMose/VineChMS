import { Router } from "express";
import {
  createPosition,
  getPositions,
  getPositionById,
  updatePosition,
  deletePosition,
} from "./positions.controller";
import { authenticate } from "../middleware/auth.middleware";

const positionsRouter = Router();

positionsRouter.post("/", authenticate, createPosition);
positionsRouter.get("/", authenticate, getPositions);
positionsRouter.get("/:id", authenticate, getPositionById);
positionsRouter.put("/:id", authenticate, updatePosition);
positionsRouter.delete("/:id", authenticate, deletePosition);

export default positionsRouter;