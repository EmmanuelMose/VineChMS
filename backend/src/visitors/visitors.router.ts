import { Router } from "express";
import {
  createVisitor,
  getVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
  getVisitorsByService,
  getVisitorsByDateRange,
  convertVisitorToMember,
} from "./visitors.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const visitorsRouter = Router();

visitorsRouter.post("/", authenticate, createVisitor);
visitorsRouter.get("/", authenticate, getVisitors);
visitorsRouter.get("/:id", authenticate, getVisitorById);
visitorsRouter.put("/:id", authenticate, updateVisitor);
visitorsRouter.delete("/:id", authenticate, deleteVisitor);
visitorsRouter.get("/service/:serviceId", authenticate, getVisitorsByService);
visitorsRouter.get("/date-range/:churchId", authenticate, getVisitorsByDateRange);
visitorsRouter.post("/:id/convert", authenticate, authorize("secretary", "church_admin", "pastor", "elder"), convertVisitorToMember);

export default visitorsRouter;