import { Router } from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "./services.controller";
import { authenticate } from "../middleware/auth.middleware";

const servicesRouter = Router();

servicesRouter.post("/", authenticate, createService);
servicesRouter.get("/", authenticate, getServices);
servicesRouter.get("/:id", authenticate, getServiceById);
servicesRouter.put("/:id", authenticate, updateService);
servicesRouter.delete("/:id", authenticate, deleteService);

export default servicesRouter;