import { Router } from "express";
import {
  createInvitation,
  getInvitations,
  getInvitationById,
  getInvitationByToken,
  getInvitationsByEmail,
  getInvitationsByChurch,
  getInvitationsByOrganization,
  getInvitationsByLargeOrganization,
  updateInvitation,
  deleteInvitation,
  acceptInvitation,
  resendInvitation,
} from "./invitations.controller";
import { authenticate } from "../middleware/auth.middleware";

const invitationsRouter = Router();

invitationsRouter.post("/", authenticate, createInvitation);
invitationsRouter.get("/", authenticate, getInvitations);
invitationsRouter.get("/:id", authenticate, getInvitationById);
invitationsRouter.get("/token/:token", authenticate, getInvitationByToken);
invitationsRouter.get("/email/:email", authenticate, getInvitationsByEmail);
invitationsRouter.get("/church/:churchId", authenticate, getInvitationsByChurch);
invitationsRouter.get("/organization/:organizationId", authenticate, getInvitationsByOrganization);
invitationsRouter.get("/large-org/:largeOrganizationId", authenticate, getInvitationsByLargeOrganization);
invitationsRouter.put("/:id", authenticate, updateInvitation);
invitationsRouter.delete("/:id", authenticate, deleteInvitation);
invitationsRouter.post("/accept/:token", authenticate, acceptInvitation);
invitationsRouter.post("/resend/:id", authenticate, resendInvitation);

export default invitationsRouter;