import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Position {
  positionId: number;
  name: string;
  description?: string;
  churchId?: number;
  organizationId?: number;
  largeOrganizationId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewPosition {
  name: string;
  description?: string;
  churchId?: number;
  organizationId?: number;
  largeOrganizationId?: number;
  isActive?: boolean;
}

const API_URL = `${ApiDomain}/positions`;

export const fetchPositions = async (token: string): Promise<Position[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPositionById = async (id: number, token: string): Promise<Position> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPositionsByChurch = async (churchId: number, token: string): Promise<Position[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPositionsByOrganization = async (organizationId: number, token: string): Promise<Position[]> => {
  const response = await axios.get(`${API_URL}/organization/${organizationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPositionsByLargeOrganization = async (largeOrganizationId: number, token: string): Promise<Position[]> => {
  const response = await axios.get(`${API_URL}/large-org/${largeOrganizationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createPosition = async (data: NewPosition, token: string): Promise<Position> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updatePosition = async (id: number, data: Partial<NewPosition>, token: string): Promise<Position> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deletePosition = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};