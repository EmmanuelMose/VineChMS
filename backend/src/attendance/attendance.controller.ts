import { Request, Response } from "express";
import {
  createAttendanceService,
  getAttendanceService,
  getAttendanceByIdService,
  updateAttendanceService,
  deleteAttendanceService,
  getAttendanceByMemberService,
  getAttendanceByServiceService,
} from "./attendance.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createAttendanceService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getAttendanceService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAttendanceById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getAttendanceByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateAttendanceService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteAttendanceService(id);
    res.json({ success: true, message: "Attendance record deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAttendanceByMember = async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const result = await getAttendanceByMemberService(memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAttendanceByService = async (req: Request, res: Response) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    const result = await getAttendanceByServiceService(serviceId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};