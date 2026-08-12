import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Event {
  registrations: any;
  eventId: number;
  churchId: number;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  status: string;
  isPublic: boolean;
  maxAttendees?: number;
  imageUrl?: string;
  imagePublicId?: string;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  gallery?: string[];
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewEvent {
  churchId: number;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  status?: string;
  isPublic?: boolean;
  maxAttendees?: number;
  imageUrl?: string;
  imagePublicId?: string;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  gallery?: string[];
  createdBy?: number;
}

export interface EventRegistration {
  eventTitle: string;
  eventStartDate: string;
  registrationId: number;
  eventId: number;
  memberId: number;
  attended: boolean;
  notes?: string;
  registrationImage?: string;
  fullName?: string;
  email?: string;
  createdAt: string;
}

export interface NewEventRegistration {
  eventId: number;
  memberId: number;
  attended?: boolean;
  notes?: string;
  registrationImage?: string;
}

const API_URL = `${ApiDomain}/events`;

export const fetchEvents = async (token: string): Promise<Event[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchEventById = async (id: number, token: string): Promise<Event> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchEventsByChurch = async (churchId: number, token: string): Promise<Event[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchPublishedEvents = async (token: string): Promise<Event[]> => {
  const response = await axios.get(`${API_URL}/published`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createEvent = async (data: NewEvent, token: string): Promise<Event> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateEvent = async (id: number, data: Partial<NewEvent>, token: string): Promise<Event> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteEvent = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const registerForEvent = async (data: NewEventRegistration, token: string): Promise<EventRegistration> => {
  const response = await axios.post(`${API_URL}/register`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchEventRegistrations = async (eventId: number, token: string): Promise<EventRegistration[]> => {
  const response = await axios.get(`${API_URL}/${eventId}/registrations`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchMemberEventRegistrations = async (memberId: number, token: string): Promise<EventRegistration[]> => {
  const response = await axios.get(`${API_URL}/member/${memberId}/registrations`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateEventRegistration = async (id: number, data: Partial<NewEventRegistration>, token: string): Promise<EventRegistration> => {
  const response = await axios.put(`${API_URL}/registration/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteEventRegistration = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/registration/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};