import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface GivingCategory {
  categoryId: number;
  churchId: number;
  name: string;
  description?: string;
  image?: string;
  imagePublicId?: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewGivingCategory {
  churchId: number;
  name: string;
  description?: string;
  image?: string;
  imagePublicId?: string;
  type: string;
  isActive?: boolean;
}

export interface Giving {
  givingId: number;
  memberId: number;
  churchId: number;
  categoryId?: number;
  amount: string;
  currency: string;
  type: string;
  status: string;
  date: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  isAnonymous: boolean;
  receiptNumber?: string;
  receiptFile?: string;
  receiptFilePublicId?: string;
  mpesaCheckoutRequestID?: string;
  mpesaMerchantRequestID?: string;
  approvedBy?: number;
  approvedAt?: string;
  fullName?: string;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewGiving {
  memberId: number;
  churchId: number;
  categoryId?: number;
  amount: string;
  currency?: string;
  type: string;
  status?: string;
  date?: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  isAnonymous?: boolean;
  receiptNumber?: string;
  receiptFile?: string;
  receiptFilePublicId?: string;
  phoneNumber?: string; // <-- ADD THIS
}

export interface GivingSummary {
  total_amount: string;
  type: string;
  count: number;
}

export interface GivingTotal {
  total: string;
}

const API_URL = `${ApiDomain}/giving`;

export const fetchGivingCategories = async (token: string): Promise<GivingCategory[]> => {
  const response = await axios.get(`${API_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGivingCategoryById = async (id: number, token: string): Promise<GivingCategory> => {
  const response = await axios.get(`${API_URL}/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGivingCategoriesByChurch = async (churchId: number, token: string): Promise<GivingCategory[]> => {
  const response = await axios.get(`${API_URL}/categories/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createGivingCategory = async (data: NewGivingCategory, token: string): Promise<GivingCategory> => {
  const response = await axios.post(`${API_URL}/categories`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateGivingCategory = async (id: number, data: Partial<NewGivingCategory>, token: string): Promise<GivingCategory> => {
  const response = await axios.put(`${API_URL}/categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteGivingCategory = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchGiving = async (token: string): Promise<Giving[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGivingById = async (id: number, token: string): Promise<Giving> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGivingByMember = async (memberId: number, token: string): Promise<Giving[]> => {
  const response = await axios.get(`${API_URL}/member/${memberId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGivingByChurch = async (churchId: number, token: string): Promise<Giving[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGivingByType = async (churchId: number, type: string, token: string): Promise<Giving[]> => {
  const response = await axios.get(`${API_URL}/type/${churchId}/${type}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGivingSummary = async (churchId: number, token: string): Promise<GivingSummary[]> => {
  const response = await axios.get(`${API_URL}/summary/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGivingTotal = async (churchId: number, token: string): Promise<GivingTotal> => {
  const response = await axios.get(`${API_URL}/total/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGivingByDateRange = async (churchId: number, startDate: string, endDate: string, token: string): Promise<Giving[]> => {
  const response = await axios.get(`${API_URL}/date-range/${churchId}?startDate=${startDate}&endDate=${endDate}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createGiving = async (data: NewGiving, token: string): Promise<Giving> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateGiving = async (id: number, data: Partial<NewGiving>, token: string): Promise<Giving> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteGiving = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const approveGiving = async (id: number, token: string): Promise<Giving> => {
  const response = await axios.put(`${API_URL}/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const rejectGiving = async (id: number, token: string): Promise<Giving> => {
  const response = await axios.put(`${API_URL}/${id}/reject`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};