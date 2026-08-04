import { Router } from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByChurch,
  getActiveServices,
  getServicesByDay,
} from "./services.controller";
import { authenticate } from "../middleware/auth.middleware";

const servicesRouter = Router();

servicesRouter.post("/", authenticate, createService);
servicesRouter.get("/", authenticate, getServices);
servicesRouter.get("/:id", authenticate, getServiceById);
servicesRouter.put("/:id", authenticate, updateService);
servicesRouter.delete("/:id", authenticate, deleteService);
servicesRouter.get("/church/:churchId", authenticate, getServicesByChurch);
servicesRouter.get("/status/active", authenticate, getActiveServices);
servicesRouter.get("/day/:dayOfWeek", authenticate, getServicesByDay);

export default servicesRouter;