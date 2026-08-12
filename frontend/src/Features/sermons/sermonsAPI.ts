import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Sermon {
  sermonId: number;
  churchId: number;
  title: string;
  speaker: string;
  topic?: string;
  scripture?: string;
  description?: string;
  videoUrl?: string;
  videoPublicId?: string;
  audioUrl?: string;
  audioPublicId?: string;
  notes?: string;
  preachedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewSermon {
  churchId: number;
  title: string;
  speaker: string;
  topic?: string;
  scripture?: string;
  description?: string;
  videoUrl?: string;
  videoPublicId?: string;
  audioUrl?: string;
  audioPublicId?: string;
  notes?: string;
  preachedAt?: string;
}

const API_URL = `${ApiDomain}/sermons`;

export const fetchSermons = async (token: string): Promise<Sermon[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchSermonById = async (id: number, token: string): Promise<Sermon> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchSermonsByChurch = async (churchId: number, token: string): Promise<Sermon[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createSermon = async (data: NewSermon, token: string): Promise<Sermon> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateSermon = async (id: number, data: Partial<NewSermon>, token: string): Promise<Sermon> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteSermon = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};