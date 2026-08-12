import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface ExpenseCategory {
  categoryId: number;
  churchId: number;
  name: string;
  description?: string;
  image?: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewExpenseCategory {
  churchId: number;
  name: string;
  description?: string;
  image?: string;
  imagePublicId?: string;
  isActive?: boolean;
}

export interface Expense {
  expenseId: number;
  churchId: number;
  categoryId?: number;
  amount: string;
  currency: string;
  description: string;
  date: string;
  status: string;
  approvedBy?: number;
  approvedAt?: string;
  receiptUrl?: string;
  receiptPublicId?: string;
  notes?: string;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewExpense {
  churchId: number;
  categoryId?: number;
  amount: string;
  currency?: string;
  description: string;
  date?: string;
  status?: string;
  notes?: string;
  receiptUrl?: string;
  receiptPublicId?: string;
}

export interface ExpenseSummary {
  total_amount: string;
  status: string;
  count: number;
}

export interface ExpenseTotal {
  total: string;
}

const API_URL = `${ApiDomain}/expenses`;

export const fetchExpenseCategories = async (token: string): Promise<ExpenseCategory[]> => {
  const response = await axios.get(`${API_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchExpenseCategoryById = async (id: number, token: string): Promise<ExpenseCategory> => {
  const response = await axios.get(`${API_URL}/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchExpenseCategoriesByChurch = async (churchId: number, token: string): Promise<ExpenseCategory[]> => {
  const response = await axios.get(`${API_URL}/categories/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createExpenseCategory = async (data: NewExpenseCategory, token: string): Promise<ExpenseCategory> => {
  const response = await axios.post(`${API_URL}/categories`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateExpenseCategory = async (id: number, data: Partial<NewExpenseCategory>, token: string): Promise<ExpenseCategory> => {
  const response = await axios.put(`${API_URL}/categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteExpenseCategory = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchExpenses = async (token: string): Promise<Expense[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchExpenseById = async (id: number, token: string): Promise<Expense> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchExpensesByChurch = async (churchId: number, token: string): Promise<Expense[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchExpensesByCategory = async (categoryId: number, token: string): Promise<Expense[]> => {
  const response = await axios.get(`${API_URL}/category/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchExpensesByStatus = async (status: string, token: string): Promise<Expense[]> => {
  const response = await axios.get(`${API_URL}/status/${status}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchExpensesSummary = async (churchId: number, token: string): Promise<ExpenseSummary[]> => {
  const response = await axios.get(`${API_URL}/summary/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchExpensesTotal = async (churchId: number, token: string): Promise<ExpenseTotal> => {
  const response = await axios.get(`${API_URL}/total/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchExpensesByDateRange = async (churchId: number, startDate: string, endDate: string, token: string): Promise<Expense[]> => {
  const response = await axios.get(`${API_URL}/date-range/${churchId}?startDate=${startDate}&endDate=${endDate}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createExpense = async (data: NewExpense, token: string): Promise<Expense> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateExpense = async (id: number, data: Partial<NewExpense>, token: string): Promise<Expense> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteExpense = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const approveExpense = async (id: number, token: string): Promise<Expense> => {
  const response = await axios.put(`${API_URL}/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const rejectExpense = async (id: number, token: string): Promise<Expense> => {
  const response = await axios.put(`${API_URL}/${id}/reject`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};