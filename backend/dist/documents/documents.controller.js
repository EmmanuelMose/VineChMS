"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentsCount = exports.getInactiveDocuments = exports.getActiveDocuments = exports.restoreDocument = exports.hardDeleteDocument = exports.deleteDocument = exports.updateDocument = exports.getDocumentsByUploader = exports.getDocumentsByVisibility = exports.getDocumentsByType = exports.getDocumentsByChurch = exports.getDocumentById = exports.getAllDocuments = exports.getDocuments = exports.createDocument = void 0;
const documents_service_1 = require("./documents.service");
const createDocument = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const result = await (0, documents_service_1.createDocumentService)({ ...req.body, uploadedBy: userId });
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createDocument = createDocument;
const getDocuments = async (req, res) => {
    try {
        const result = await (0, documents_service_1.getDocumentsService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getDocuments = getDocuments;
const getAllDocuments = async (req, res) => {
    try {
        const result = await (0, documents_service_1.getAllDocumentsService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAllDocuments = getAllDocuments;
const getDocumentById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, documents_service_1.getDocumentByIdService)(id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getDocumentById = getDocumentById;
const getDocumentsByChurch = async (req, res) => {
    try {
        const churchId = parseInt(req.params.churchId);
        const result = await (0, documents_service_1.getDocumentsByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getDocumentsByChurch = getDocumentsByChurch;
const getDocumentsByType = async (req, res) => {
    try {
        const documentType = req.params.documentType;
        const result = await (0, documents_service_1.getDocumentsByTypeService)(documentType);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getDocumentsByType = getDocumentsByType;
const getDocumentsByVisibility = async (req, res) => {
    try {
        const visibility = req.params.visibility;
        const result = await (0, documents_service_1.getDocumentsByVisibilityService)(visibility);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getDocumentsByVisibility = getDocumentsByVisibility;
const getDocumentsByUploader = async (req, res) => {
    try {
        const uploadedBy = parseInt(req.params.uploadedBy);
        const result = await (0, documents_service_1.getDocumentsByUploaderService)(uploadedBy);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getDocumentsByUploader = getDocumentsByUploader;
const updateDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, documents_service_1.updateDocumentService)(id, req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateDocument = updateDocument;
const deleteDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, documents_service_1.deleteDocumentService)(id);
        res.json({ success: true, message: "Document deleted" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteDocument = deleteDocument;
const hardDeleteDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, documents_service_1.hardDeleteDocumentService)(id);
        res.json({ success: true, message: "Document permanently deleted" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.hardDeleteDocument = hardDeleteDocument;
const restoreDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, documents_service_1.restoreDocumentService)(id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.restoreDocument = restoreDocument;
const getActiveDocuments = async (req, res) => {
    try {
        const result = await (0, documents_service_1.getActiveDocumentsService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getActiveDocuments = getActiveDocuments;
const getInactiveDocuments = async (req, res) => {
    try {
        const result = await (0, documents_service_1.getInactiveDocumentsService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getInactiveDocuments = getInactiveDocuments;
const getDocumentsCount = async (req, res) => {
    try {
        const result = await (0, documents_service_1.getDocumentsCountService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getDocumentsCount = getDocumentsCount;
