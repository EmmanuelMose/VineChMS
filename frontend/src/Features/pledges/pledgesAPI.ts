import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Pledge {
  pledgeId: number;
  memberId: number;
  churchId: number;
  categoryId?: number;
  amount: string;
  currency: string;
  startDate: string;
  endDate: string;
  frequency: string;
  isFulfilled: boolean;
  fulfilledAt?: string;
  notes?: string;
  fullName?: string;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewPledge {
  memberId: number;
  churchId: number;
  categoryId?: number;
  amount: string;
  currency?: string;
  startDate: string;
  endDate: string;
  frequency?: string;
  isFulfilled?: boolean;
  notes?: string;
}

export interface PledgeSummary {
  total_pledges: number;
  total_amount: string;
  fulfilled_count: number;
  unfulfilled_count: number;
  fulfilled_amount: string;
  unfulfilled_amount: string;
}

const API_URL = `${ApiDomain}/pledges`;

export const fetchPledges = async (token: string): Promise<Pledge[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPledgeById = async (id: number, token: string): Promise<Pledge> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPledgesByMember = async (memberId: number, token: string): Promise<Pledge[]> => {
  const response = await axios.get(`${API_URL}/member/${memberId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPledgesByChurch = async (churchId: number, token: string): Promise<Pledge[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPledgesByCategory = async (categoryId: number, token: string): Promise<Pledge[]> => {
  const response = await axios.get(`${API_URL}/category/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchFulfilledPledges = async (churchId: number, token: string): Promise<Pledge[]> => {
  const response = await axios.get(`${API_URL}/fulfilled/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchUnfulfilledPledges = async (churchId: number, token: string): Promise<Pledge[]> => {
  const response = await axios.get(`${API_URL}/unfulfilled/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPledgesSummary = async (churchId: number, token: string): Promise<PledgeSummary> => {
  const response = await axios.get(`${API_URL}/summary/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createPledge = async (data: NewPledge, token: string): Promise<Pledge> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updatePledge = async (id: number, data: Partial<NewPledge>, token: string): Promise<Pledge> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deletePledge = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fulfillPledge = async (id: number, token: string): Promise<Pledge> => {
  const response = await axios.put(`${API_URL}/${id}/fulfill`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};