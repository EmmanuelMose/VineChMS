import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface PrayerRequest {
  prayerRequestId: number;
  churchId: number;
  memberId: number;
  title: string;
  description: string;
  image?: string;
  imagePublicId?: string;
  status: string;
  visibility: string;
  answeredAt?: string;
  answerDescription?: string;
  prayerCount: number;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewPrayerRequest {
  churchId: number;
  memberId: number;
  title: string;
  description: string;
  image?: string;
  imagePublicId?: string;
  status?: string;
  visibility?: string;
}

export interface PrayerInteraction {
  interactionId: number;
  prayerRequestId: number;
  memberId: number;
  type: string;
  notes?: string;
  fullName?: string;
  createdAt: string;
}

export interface NewPrayerInteraction {
  prayerRequestId: number;
  memberId: number;
  type?: string;
  notes?: string;
}

const API_URL = `${ApiDomain}/prayer`;

export const fetchPrayerRequests = async (token: string): Promise<PrayerRequest[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPrayerRequestById = async (id: number, token: string): Promise<PrayerRequest> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPrayerRequestsByChurch = async (churchId: number, token: string): Promise<PrayerRequest[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createPrayerRequest = async (data: NewPrayerRequest, token: string): Promise<PrayerRequest> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updatePrayerRequest = async (id: number, data: Partial<NewPrayerRequest>, token: string): Promise<PrayerRequest> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deletePrayerRequest = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const prayForRequest = async (id: number, memberId: number, token: string): Promise<PrayerInteraction> => {
  const response = await axios.post(`${API_URL}/${id}/pray`, { memberId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPrayerInteractions = async (id: number, token: string): Promise<PrayerInteraction[]> => {
  const response = await axios.get(`${API_URL}/${id}/interactions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};