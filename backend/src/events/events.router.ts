import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByChurch,
  registerForEvent,
  getEventRegistrations,
  updateEventRegistration,
  deleteEventRegistration,
} from "./events.controller";
import { authenticate } from "../middleware/auth.middleware";

const eventsRouter = Router();

eventsRouter.post("/", authenticate, createEvent);
eventsRouter.get("/", authenticate, getEvents);
eventsRouter.get("/:id", authenticate, getEventById);
eventsRouter.put("/:id", authenticate, updateEvent);
eventsRouter.delete("/:id", authenticate, deleteEvent);
eventsRouter.get("/church/:churchId", authenticate, getEventsByChurch);
eventsRouter.post("/register", authenticate, registerForEvent);
eventsRouter.get("/:eventId/registrations", authenticate, getEventRegistrations);
eventsRouter.put("/registration/:id", authenticate, updateEventRegistration);
eventsRouter.delete("/registration/:id", authenticate, deleteEventRegistration);

export default eventsRouter;