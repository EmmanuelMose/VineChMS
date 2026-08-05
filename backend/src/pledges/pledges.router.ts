import { Router } from "express";
import {
  createPledge,
  getPledges,
  getPledgeById,
  getPledgesByMember,
  getPledgesByChurch,
  getPledgesByCategory,
  getFulfilledPledges,
  getUnfulfilledPledges,
  updatePledge,
  deletePledge,
  fulfillPledge,
  getPledgesSummary,
} from "./pledges.controller";
import { authenticate } from "../middleware/auth.middleware";

const pledgesRouter = Router();

pledgesRouter.post("/", authenticate, createPledge);
pledgesRouter.get("/", authenticate, getPledges);
pledgesRouter.get("/:id", authenticate, getPledgeById);
pledgesRouter.put("/:id", authenticate, updatePledge);
pledgesRouter.delete("/:id", authenticate, deletePledge);
pledgesRouter.get("/member/:memberId", authenticate, getPledgesByMember);
pledgesRouter.get("/church/:churchId", authenticate, getPledgesByChurch);
pledgesRouter.get("/category/:categoryId", authenticate, getPledgesByCategory);
pledgesRouter.get("/fulfilled/:churchId", authenticate, getFulfilledPledges);
pledgesRouter.get("/unfulfilled/:churchId", authenticate, getUnfulfilledPledges);
pledgesRouter.put("/:id/fulfill", authenticate, fulfillPledge);
pledgesRouter.get("/summary/:churchId", authenticate, getPledgesSummary);

export default pledgesRouter;