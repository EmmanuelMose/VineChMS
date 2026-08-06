import { Request, Response } from "express";
import {
  createEventService,
  getEventByIdService,
  getEventsByChurchService,
  getPublishedEventsService,
  registerForEventService,
  getEventRegistrationsService,
  updateEventService,
  deleteEventService,
  updateEventRegistrationService,
  deleteEventRegistrationService,
  getMemberEventRegistrationsService,
} from "./events.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createEventService({ ...req.body, churchId, createdBy: userId });
    res.status(201).json({ success: true, data: result, message: "Event created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create event" });
  }
};

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getEventsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch events" });
  }
};

export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getEventByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Event not found" });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getEventByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateEventService(id, req.body);
    res.json({ success: true, data: result, message: "Event updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update event" });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getEventByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteEventService(id);
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete event" });
  }
};

export const getPublishedEvents = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getPublishedEventsService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch published events" });
  }
};

export const registerForEvent = async (req: AuthRequest, res: Response) => {
  try {
    const result = await registerForEventService(req.body);
    res.status(201).json({ success: true, data: result, message: "Registered for event successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to register for event" });
  }
};

export const getEventRegistrations = async (req: AuthRequest, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const churchId = req.user?.churchId;
    const event = await getEventByIdService(eventId);
    if (event.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await getEventRegistrationsService(eventId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch registrations" });
  }
};

export const updateEventRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateEventRegistrationService(id, req.body);
    res.json({ success: true, data: result, message: "Registration updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update registration" });
  }
};

export const deleteEventRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteEventRegistrationService(id);
    res.json({ success: true, message: "Registration deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete registration" });
  }
};

export const getMemberEventRegistrations = async (req: AuthRequest, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const result = await getMemberEventRegistrationsService(memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch registrations" });
  }
};