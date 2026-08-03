import { Request, Response } from "express";
import {
  createEventService,
  getEventsService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
  getEventsByChurchService,
  registerForEventService,
  getEventRegistrationsService,
  updateEventRegistrationService,
  deleteEventRegistrationService,
} from "./events.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createEventService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getEventsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getEventByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateEventService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteEventService(id);
    res.json({ success: true, message: "Event deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getEventsByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getEventsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const registerForEvent = async (req: AuthRequest, res: Response) => {
  try {
    const result = await registerForEventService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getEventRegistrations = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const result = await getEventRegistrationsService(eventId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateEventRegistration = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateEventRegistrationService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEventRegistration = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteEventRegistrationService(id);
    res.json({ success: true, message: "Registration deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};