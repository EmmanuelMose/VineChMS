import { Router } from "express";
import {
  createSermon,
  getSermons,
  getSermonById,
  updateSermon,
  deleteSermon,
} from "./sermons.controller";
import { authenticate } from "../middleware/auth.middleware";

const sermonsRouter = Router();

sermonsRouter.post("/", authenticate, createSermon);
sermonsRouter.get("/", authenticate, getSermons);
sermonsRouter.get("/:id", authenticate, getSermonById);
sermonsRouter.put("/:id", authenticate, updateSermon);
sermonsRouter.delete("/:id", authenticate, deleteSermon);

export default sermonsRouter;