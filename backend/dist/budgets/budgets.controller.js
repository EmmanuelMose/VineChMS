"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetsByDateRange = exports.getBudgetsByMonth = exports.getBudgetsTotal = exports.getMonthlyBudgets = exports.getAnnualBudgets = exports.getBudgetsByYear = exports.deleteBudget = exports.updateBudget = exports.getBudgetById = exports.getBudgets = exports.createBudget = void 0;
const budgets_service_1 = require("./budgets.service");
const createBudget = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, budgets_service_1.createBudgetService)({ ...req.body, churchId });
        res.status(201).json({ success: true, data: result, message: "Budget created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create budget" });
    }
};
exports.createBudget = createBudget;
const getBudgets = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, budgets_service_1.getBudgetsByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch budgets" });
    }
};
exports.getBudgets = getBudgets;
const getBudgetById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, budgets_service_1.getBudgetByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Budget not found" });
    }
};
exports.getBudgetById = getBudgetById;
const updateBudget = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, budgets_service_1.getBudgetByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, budgets_service_1.updateBudgetService)(id, req.body);
        res.json({ success: true, data: result, message: "Budget updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update budget" });
    }
};
exports.updateBudget = updateBudget;
const deleteBudget = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, budgets_service_1.getBudgetByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, budgets_service_1.deleteBudgetService)(id);
        res.json({ success: true, message: "Budget deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete budget" });
    }
};
exports.deleteBudget = deleteBudget;
const getBudgetsByYear = async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, budgets_service_1.getBudgetsByChurchAndYearService)(churchId, year);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch budgets" });
    }
};
exports.getBudgetsByYear = getBudgetsByYear;
const getAnnualBudgets = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, budgets_service_1.getAnnualBudgetsService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch annual budgets" });
    }
};
exports.getAnnualBudgets = getAnnualBudgets;
const getMonthlyBudgets = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, budgets_service_1.getMonthlyBudgetsService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch monthly budgets" });
    }
};
exports.getMonthlyBudgets = getMonthlyBudgets;
const getBudgetsTotal = async (req, res) => {
    try {
        const churchId = parseInt(req.params.churchId);
        const year = parseInt(req.params.year);
        const userChurchId = req.user?.churchId;
        if (churchId !== userChurchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, budgets_service_1.getBudgetsTotalService)(churchId, year);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch budgets total" });
    }
};
exports.getBudgetsTotal = getBudgetsTotal;
const getBudgetsByMonth = async (req, res) => {
    try {
        const churchId = parseInt(req.params.churchId);
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        const userChurchId = req.user?.churchId;
        if (churchId !== userChurchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, budgets_service_1.getBudgetsByMonthService)(churchId, year, month);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch budgets" });
    }
};
exports.getBudgetsByMonth = getBudgetsByMonth;
const getBudgetsByDateRange = async (req, res) => {
    try {
        const churchId = parseInt(req.params.churchId);
        const startYear = parseInt(req.params.startYear);
        const endYear = parseInt(req.params.endYear);
        const userChurchId = req.user?.churchId;
        if (churchId !== userChurchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, budgets_service_1.getBudgetsByDateRangeService)(churchId, startYear, endYear);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch budgets" });
    }
};
exports.getBudgetsByDateRange = getBudgetsByDateRange;
