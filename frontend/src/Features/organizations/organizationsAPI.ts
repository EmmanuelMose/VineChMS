import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface LargeOrganization {
  largeOrganizationId: number;
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
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  maxOrganizations: number;
  maxChurches: number;
  maxMembers: number;
  createdBy?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewLargeOrganization {
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
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  maxOrganizations?: number;
  maxChurches?: number;
  maxMembers?: number;
  isActive?: boolean;
}

export interface Organization {
  organizationId: number;
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
  largeOrganizationId: number;
  maxChurches: number;
  maxMembers: number;
  createdBy?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewOrganization {
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
  largeOrganizationId: number;
  maxChurches?: number;
  maxMembers?: number;
  isActive?: boolean;
}

const API_URL = `${ApiDomain}/organizations`;

export const fetchLargeOrganizations = async (token: string): Promise<LargeOrganization[]> => {
  const response = await axios.get(`${API_URL}/large`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchLargeOrganizationById = async (id: number, token: string): Promise<LargeOrganization> => {
  const response = await axios.get(`${API_URL}/large/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createLargeOrganization = async (data: NewLargeOrganization, token: string): Promise<LargeOrganization> => {
  const response = await axios.post(`${API_URL}/large`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateLargeOrganization = async (id: number, data: Partial<NewLargeOrganization>, token: string): Promise<LargeOrganization> => {
  const response = await axios.put(`${API_URL}/large/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteLargeOrganization = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/large/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchOrganizations = async (token: string): Promise<Organization[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchOrganizationById = async (id: number, token: string): Promise<Organization> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createOrganization = async (data: NewOrganization, token: string): Promise<Organization> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateOrganization = async (id: number, data: Partial<NewOrganization>, token: string): Promise<Organization> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteOrganization = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};