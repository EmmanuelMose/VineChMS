import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Church {
  churchId: number;
  name: string;
  description?: string;
  logo?: string;
  logoPublicId?: string;
  website?: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  denomination?: string;
  foundedDate?: string;
  organizationId: number;
  maxMembers: number;
  createdBy?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewChurch {
  name: string;
  description?: string;
  logo?: string;
  logoPublicId?: string;
  website?: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  denomination?: string;
  foundedDate?: string;
  organizationId: number;
  maxMembers?: number;
  isActive?: boolean;
}

export interface ChurchMember {
  memberId: number;
  userId?: number;
  email: string;
  fullName: string;
  membershipNumber?: string;
  isActive: boolean;
  isBaptized: boolean;
  isLeader: boolean;
}

const API_URL = `${ApiDomain}/churches`;

export const fetchChurches = async (token: string): Promise<Church[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchChurchById = async (id: number, token: string): Promise<Church> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createChurch = async (data: NewChurch, token: string): Promise<Church> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateChurch = async (id: number, data: Partial<NewChurch>, token: string): Promise<Church> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteChurch = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchChurchMembers = async (id: number, token: string): Promise<ChurchMember[]> => {
  const response = await axios.get(`${API_URL}/${id}/members`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};