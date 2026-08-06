import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Announcement {
  announcementId: number;
  churchId: number;
  title: string;
  content: string;
  imageUrl?: string;
  imagePublicId?: string;
  imagePosition?: string;
  isPublished: boolean;
  publishedAt?: string;
  expiresAt?: string;
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewAnnouncement {
  churchId: number;
  title: string;
  content: string;
  imageUrl?: string;
  imagePublicId?: string;
  imagePosition?: string;
  isPublished?: boolean;
  publishedAt?: string;
  expiresAt?: string;
  createdBy?: number;
}

const API_URL = `${ApiDomain}/announcements`;

export const fetchAnnouncements = async (token: string): Promise<Announcement[]> => {
  const response = await axios.get(`${API_URL}/published`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAllAnnouncements = async (token: string): Promise<Announcement[]> => {
  const response = await axios.get(`${API_URL}/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAnnouncementById = async (id: number, token: string): Promise<Announcement> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAnnouncementsByChurch = async (churchId: number, token: string): Promise<Announcement[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPublishedAnnouncementsByChurch = async (churchId: number, token: string): Promise<Announcement[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}/published`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchActiveAnnouncements = async (token: string): Promise<Announcement[]> => {
  const response = await axios.get(`${API_URL}/active`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createAnnouncement = async (data: NewAnnouncement, token: string): Promise<Announcement> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateAnnouncement = async (id: number, data: Partial<NewAnnouncement>, token: string): Promise<Announcement> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteAnnouncement = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const publishAnnouncement = async (id: number, token: string): Promise<Announcement> => {
  const response = await axios.put(`${API_URL}/${id}/publish`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const unpublishAnnouncement = async (id: number, token: string): Promise<Announcement> => {
  const response = await axios.put(`${API_URL}/${id}/unpublish`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};