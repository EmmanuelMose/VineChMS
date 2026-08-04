import { Router } from "express";
import {
  createAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendanceByMember,
  getAttendanceByService,
  getAttendanceByDate,
  getAttendanceSummary,
  getAttendanceByMemberAndService,
} from "./attendance.controller";
import { authenticate } from "../middleware/auth.middleware";

const attendanceRouter = Router();

attendanceRouter.post("/", authenticate, createAttendance);
attendanceRouter.get("/", authenticate, getAttendance);
attendanceRouter.get("/:id", authenticate, getAttendanceById);
attendanceRouter.put("/:id", authenticate, updateAttendance);
attendanceRouter.delete("/:id", authenticate, deleteAttendance);
attendanceRouter.get("/member/:memberId", authenticate, getAttendanceByMember);
attendanceRouter.get("/service/:serviceId", authenticate, getAttendanceByService);
attendanceRouter.get("/date/:date", authenticate, getAttendanceByDate);
attendanceRouter.get("/summary/:serviceId", authenticate, getAttendanceSummary);
attendanceRouter.get("/member/:memberId/service/:serviceId", authenticate, getAttendanceByMemberAndService);

export default attendanceRouter;