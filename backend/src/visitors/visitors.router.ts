import { Router } from "express";
import {
  createVisitor,
  getVisitors,
  getVisitorById,
  getVisitorsByChurch,
  getVisitorsByService,
  getVisitorsByDateRange,
  updateVisitor,
  deleteVisitor,
  convertVisitorToMember,
} from "./visitors.controller";
import { authenticate } from "../middleware/auth.middleware";

const visitorsRouter = Router();

visitorsRouter.post("/", authenticate, createVisitor);
visitorsRouter.get("/", authenticate, getVisitors);
visitorsRouter.get("/:id", authenticate, getVisitorById);
visitorsRouter.put("/:id", authenticate, updateVisitor);
visitorsRouter.delete("/:id", authenticate, deleteVisitor);
visitorsRouter.get("/church/:churchId", authenticate, getVisitorsByChurch);
visitorsRouter.get("/service/:serviceId", authenticate, getVisitorsByService);
visitorsRouter.get("/date-range/:churchId", authenticate, getVisitorsByDateRange);
visitorsRouter.post("/:id/convert", authenticate, convertVisitorToMember);

export default visitorsRouter;