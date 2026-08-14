"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceByMemberAndService = exports.getAttendanceSummary = exports.getAttendanceByDate = exports.getAttendanceByService = exports.getAttendanceByMember = exports.deleteAttendance = exports.updateAttendance = exports.getAttendanceById = exports.getAttendance = exports.createAttendance = void 0;
const attendance_service_1 = require("./attendance.service");
const createAttendance = async (req, res) => {
    try {
        console.log('📥 Incoming data:', req.body);
        const result = await (0, attendance_service_1.createAttendanceService)(req.body);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        console.error('❌ Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createAttendance = createAttendance;
const getAttendance = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        const result = await (0, attendance_service_1.getAttendanceService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAttendance = getAttendance;
const getAttendanceById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, attendance_service_1.getAttendanceByIdService)(id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getAttendanceById = getAttendanceById;
const updateAttendance = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, attendance_service_1.updateAttendanceService)(id, req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateAttendance = updateAttendance;
const deleteAttendance = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, attendance_service_1.deleteAttendanceService)(id);
        res.json({ success: true, message: "Attendance record deleted" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteAttendance = deleteAttendance;
const getAttendanceByMember = async (req, res) => {
    try {
        const memberId = parseInt(req.params.memberId);
        const result = await (0, attendance_service_1.getAttendanceByMemberService)(memberId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAttendanceByMember = getAttendanceByMember;
const getAttendanceByService = async (req, res) => {
    try {
        const serviceId = parseInt(req.params.serviceId);
        const result = await (0, attendance_service_1.getAttendanceByServiceService)(serviceId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAttendanceByService = getAttendanceByService;
const getAttendanceByDate = async (req, res) => {
    try {
        const date = req.params.date;
        const result = await (0, attendance_service_1.getAttendanceByDateService)(date);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAttendanceByDate = getAttendanceByDate;
const getAttendanceSummary = async (req, res) => {
    try {
        const serviceId = parseInt(req.params.serviceId);
        const result = await (0, attendance_service_1.getAttendanceSummaryService)(serviceId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAttendanceSummary = getAttendanceSummary;
const getAttendanceByMemberAndService = async (req, res) => {
    try {
        const memberId = parseInt(req.params.memberId);
        const serviceId = parseInt(req.params.serviceId);
        const result = await (0, attendance_service_1.getAttendanceByMemberAndServiceService)(memberId, serviceId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAttendanceByMemberAndService = getAttendanceByMemberAndService;
