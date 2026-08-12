import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Visitor {
  visitorId: number;
  churchId: number;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  visitedDate: string;
  serviceId?: number;
  isMember: boolean;
  memberId?: number;
  notes?: string;
  serviceName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewVisitor {
  churchId: number;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  visitedDate?: string;
  serviceId?: number;
  isMember?: boolean;
  memberId?: number;
  notes?: string;
}

export interface ConvertVisitorData {
  role?: string;
  isActive?: boolean;
  notes?: string;
}

const API_URL = `${ApiDomain}/visitors`;

export const fetchVisitors = async (token: string): Promise<Visitor[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchVisitorById = async (id: number, token: string): Promise<Visitor> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchVisitorsByChurch = async (churchId: number, token: string): Promise<Visitor[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchVisitorsByService = async (serviceId: number, token: string): Promise<Visitor[]> => {
  const response = await axios.get(`${API_URL}/service/${serviceId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchVisitorsByDateRange = async (churchId: number, startDate: string, endDate: string, token: string): Promise<Visitor[]> => {
  const response = await axios.get(`${API_URL}/date-range/${churchId}?startDate=${startDate}&endDate=${endDate}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createVisitor = async (data: NewVisitor, token: string): Promise<Visitor> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateVisitor = async (id: number, data: Partial<NewVisitor>, token: string): Promise<Visitor> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteVisitor = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const convertVisitorToMember = async (id: number, data: ConvertVisitorData, token: string): Promise<{ member: any; visitor: any }> => {
  const response = await axios.post(`${API_URL}/${id}/convert`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};