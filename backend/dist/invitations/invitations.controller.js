"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendInvitation = exports.acceptInvitation = exports.deleteInvitation = exports.updateInvitation = exports.getInvitationsByLargeOrganization = exports.getInvitationsByOrganization = exports.getInvitationsByChurch = exports.getInvitationsByEmail = exports.getInvitationByToken = exports.getInvitationById = exports.getInvitations = exports.createInvitation = void 0;
const invitations_service_1 = require("./invitations.service");
const createInvitation = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const result = await (0, invitations_service_1.createInvitationService)({ ...req.body, invitedBy: userId });
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createInvitation = createInvitation;
const getInvitations = async (req, res) => {
    try {
        const result = await (0, invitations_service_1.getInvitationsService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getInvitations = getInvitations;
const getInvitationById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, invitations_service_1.getInvitationByIdService)(id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getInvitationById = getInvitationById;
const getInvitationByToken = async (req, res) => {
    try {
        const token = req.params.token;
        const result = await (0, invitations_service_1.getInvitationByTokenService)(token);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getInvitationByToken = getInvitationByToken;
const getInvitationsByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const result = await (0, invitations_service_1.getInvitationsByEmailService)(email);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getInvitationsByEmail = getInvitationsByEmail;
const getInvitationsByChurch = async (req, res) => {
    try {
        const churchId = parseInt(req.params.churchId);
        const result = await (0, invitations_service_1.getInvitationsByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getInvitationsByChurch = getInvitationsByChurch;
const getInvitationsByOrganization = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.organizationId);
        const result = await (0, invitations_service_1.getInvitationsByOrganizationService)(organizationId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getInvitationsByOrganization = getInvitationsByOrganization;
const getInvitationsByLargeOrganization = async (req, res) => {
    try {
        const largeOrganizationId = parseInt(req.params.largeOrganizationId);
        const result = await (0, invitations_service_1.getInvitationsByLargeOrganizationService)(largeOrganizationId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getInvitationsByLargeOrganization = getInvitationsByLargeOrganization;
const updateInvitation = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, invitations_service_1.updateInvitationService)(id, req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateInvitation = updateInvitation;
const deleteInvitation = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, invitations_service_1.deleteInvitationService)(id);
        res.json({ success: true, message: "Invitation deleted" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteInvitation = deleteInvitation;
const acceptInvitation = async (req, res) => {
    try {
        const token = req.params.token;
        const result = await (0, invitations_service_1.acceptInvitationService)(token);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.acceptInvitation = acceptInvitation;
const resendInvitation = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, invitations_service_1.resendInvitationService)(id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.resendInvitation = resendInvitation;
