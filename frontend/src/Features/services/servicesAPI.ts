import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Service {
  serviceId: number;
  churchId: number;
  name: string;
  description?: string;
  dayOfWeek: number;
  startTime: string;
  endTime?: string;
  serviceType?: string;
  attendanceType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewService {
  churchId: number;
  name: string;
  description?: string;
  dayOfWeek: number;
  startTime: string;
  endTime?: string;
  serviceType?: string;
  attendanceType?: string;
  isActive?: boolean;
}

const API_URL = `${ApiDomain}/services`;

export const fetchServices = async (token: string): Promise<Service[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchServiceById = async (id: number, token: string): Promise<Service> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchServicesByChurch = async (churchId: number, token: string): Promise<Service[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchActiveServices = async (token: string): Promise<Service[]> => {
  const response = await axios.get(`${API_URL}/status/active`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchServicesByDay = async (dayOfWeek: number, token: string): Promise<Service[]> => {
  const response = await axios.get(`${API_URL}/day/${dayOfWeek}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createService = async (data: NewService, token: string): Promise<Service> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateService = async (id: number, data: Partial<NewService>, token: string): Promise<Service> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteService = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};