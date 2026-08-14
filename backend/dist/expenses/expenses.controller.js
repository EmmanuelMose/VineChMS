"use strict";
// File: backend/src/expenses/expenses.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpensesByDateRange = exports.rejectExpense = exports.approveExpense = exports.getExpensesTotal = exports.getExpensesSummary = exports.getExpensesByStatus = exports.getExpensesByCategory = exports.deleteExpense = exports.updateExpense = exports.getExpenseById = exports.getExpenses = exports.createExpense = exports.deleteExpenseCategory = exports.updateExpenseCategory = exports.getExpenseCategoryById = exports.getExpenseCategories = exports.createExpenseCategory = void 0;
const expenses_service_1 = require("./expenses.service");
const createExpenseCategory = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, expenses_service_1.createExpenseCategoryService)({ ...req.body, churchId });
        res.status(201).json({ success: true, data: result, message: "Expense category created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create expense category" });
    }
};
exports.createExpenseCategory = createExpenseCategory;
const getExpenseCategories = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, expenses_service_1.getExpenseCategoriesByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch expense categories" });
    }
};
exports.getExpenseCategories = getExpenseCategories;
const getExpenseCategoryById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, expenses_service_1.getExpenseCategoryByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Expense category not found" });
    }
};
exports.getExpenseCategoryById = getExpenseCategoryById;
const updateExpenseCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, expenses_service_1.getExpenseCategoryByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, expenses_service_1.updateExpenseCategoryService)(id, req.body);
        res.json({ success: true, data: result, message: "Expense category updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update expense category" });
    }
};
exports.updateExpenseCategory = updateExpenseCategory;
const deleteExpenseCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, expenses_service_1.getExpenseCategoryByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, expenses_service_1.deleteExpenseCategoryService)(id);
        res.json({ success: true, message: "Expense category deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete expense category" });
    }
};
exports.deleteExpenseCategory = deleteExpenseCategory;
const createExpense = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, expenses_service_1.createExpenseService)({ ...req.body, churchId });
        res.status(201).json({
            success: true,
            data: result,
            message: result.mpesaCheckoutRequestID
                ? "Expense created. STK Push sent to your phone."
                : "Expense created successfully"
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create expense" });
    }
};
exports.createExpense = createExpense;
const getExpenses = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, expenses_service_1.getExpensesByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch expenses" });
    }
};
exports.getExpenses = getExpenses;
const getExpenseById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, expenses_service_1.getExpenseByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Expense not found" });
    }
};
exports.getExpenseById = getExpenseById;
const updateExpense = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, expenses_service_1.getExpenseByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, expenses_service_1.updateExpenseService)(id, req.body);
        res.json({ success: true, data: result, message: "Expense updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update expense" });
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, expenses_service_1.getExpenseByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, expenses_service_1.deleteExpenseService)(id);
        res.json({ success: true, message: "Expense deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete expense" });
    }
};
exports.deleteExpense = deleteExpense;
const getExpensesByCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const category = await (0, expenses_service_1.getExpenseCategoryByIdService)(categoryId);
        if (category.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, expenses_service_1.getExpensesByCategoryService)(categoryId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch expenses" });
    }
};
exports.getExpensesByCategory = getExpensesByCategory;
const getExpensesByStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, expenses_service_1.getExpensesByStatusService)(status, churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch expenses" });
    }
};
exports.getExpensesByStatus = getExpensesByStatus;
const getExpensesSummary = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, expenses_service_1.getExpensesSummaryService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch expenses summary" });
    }
};
exports.getExpensesSummary = getExpensesSummary;
const getExpensesTotal = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, expenses_service_1.getExpensesTotalService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch expenses total" });
    }
};
exports.getExpensesTotal = getExpensesTotal;
const approveExpense = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const churchId = req.user?.churchId;
        const existing = await (0, expenses_service_1.getExpenseByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, expenses_service_1.approveExpenseService)(id, userId);
        res.json({ success: true, data: result, message: "Expense approved successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to approve expense" });
    }
};
exports.approveExpense = approveExpense;
const rejectExpense = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const churchId = req.user?.churchId;
        const existing = await (0, expenses_service_1.getExpenseByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, expenses_service_1.rejectExpenseService)(id, userId);
        res.json({ success: true, data: result, message: "Expense rejected successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to reject expense" });
    }
};
exports.rejectExpense = rejectExpense;
const getExpensesByDateRange = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        const { startDate, endDate } = req.query;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "startDate and endDate are required query parameters"
            });
        }
        const result = await (0, expenses_service_1.getExpensesByDateRangeService)(churchId, startDate, endDate);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch expenses" });
    }
};
exports.getExpensesByDateRange = getExpensesByDateRange;
