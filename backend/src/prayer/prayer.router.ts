import { Router } from "express";
import {
  createPrayerRequest,
  getPrayerRequests,
  getPrayerRequestById,
  updatePrayerRequest,
  deletePrayerRequest,
  getPrayerRequestsByChurch,
  prayForRequest,
  getPrayerInteractions,
} from "./prayer.controller";
import { authenticate } from "../middleware/auth.middleware";

const prayerRouter = Router();

prayerRouter.post("/", authenticate, createPrayerRequest);
prayerRouter.get("/", authenticate, getPrayerRequests);
prayerRouter.get("/:id", authenticate, getPrayerRequestById);
prayerRouter.put("/:id", authenticate, updatePrayerRequest);
prayerRouter.delete("/:id", authenticate, deletePrayerRequest);
prayerRouter.get("/church/:churchId", authenticate, getPrayerRequestsByChurch);
prayerRouter.post("/:id/pray", authenticate, prayForRequest);
prayerRouter.get("/:id/interactions", authenticate, getPrayerInteractions);

export default prayerRouter;