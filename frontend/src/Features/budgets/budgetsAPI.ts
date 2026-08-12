import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Budget {
  budgetId: number;
  churchId: number;
  name: string;
  description?: string;
  amount: string;
  currency: string;
  year: number;
  month?: number;
  isAnnual: boolean;
  attachment?: string;
  attachmentPublicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewBudget {
  churchId: number;
  name: string;
  description?: string;
  amount: string;
  currency?: string;
  year: number;
  month?: number;
  isAnnual?: boolean;
  attachment?: string;
  attachmentPublicId?: string;
}

export interface BudgetTotal {
  total_amount: string;
  count: number;
}

const API_URL = `${ApiDomain}/budgets`;

export const fetchBudgets = async (token: string): Promise<Budget[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchBudgetById = async (id: number, token: string): Promise<Budget> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchBudgetsByChurch = async (churchId: number, token: string): Promise<Budget[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchBudgetsByYear = async (year: number, token: string): Promise<Budget[]> => {
  const response = await axios.get(`${API_URL}/year/${year}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchBudgetsByChurchAndYear = async (churchId: number, year: number, token: string): Promise<Budget[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}/year/${year}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAnnualBudgets = async (churchId: number, token: string): Promise<Budget[]> => {
  const response = await axios.get(`${API_URL}/annual/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchMonthlyBudgets = async (churchId: number, token: string): Promise<Budget[]> => {
  const response = await axios.get(`${API_URL}/monthly/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchBudgetsTotal = async (churchId: number, year: number, token: string): Promise<BudgetTotal> => {
  const response = await axios.get(`${API_URL}/total/${churchId}/year/${year}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchBudgetsByMonth = async (churchId: number, year: number, month: number, token: string): Promise<Budget[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}/year/${year}/month/${month}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchBudgetsByDateRange = async (churchId: number, startYear: number, endYear: number, token: string): Promise<Budget[]> => {
  const response = await axios.get(`${API_URL}/date-range/${churchId}/${startYear}/${endYear}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createBudget = async (data: NewBudget, token: string): Promise<Budget> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateBudget = async (id: number, data: Partial<NewBudget>, token: string): Promise<Budget> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteBudget = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};