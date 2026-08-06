import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Leader {
  leaderId: number;
  memberId: number;
  positionId: number;
  positionName?: string;
  fullName?: string;
  email?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: number;
  approvedAt?: string;
  notes?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewLeader {
  memberId: number;
  positionId: number;
  startDate: string;
  endDate?: string;
  isActive?: boolean;
  isApproved?: boolean;
  notes?: string;
  profilePicture?: string;
}

export interface LeaderSummary {
  total: number;
  active: number;
  approved: number;
  pending: number;
  inactive: number;
}

const API_URL = `${ApiDomain}/leaders`;

export const fetchLeaders = async (token: string): Promise<Leader[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchLeaderById = async (id: number, token: string): Promise<Leader> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchLeadersByMember = async (memberId: number, token: string): Promise<Leader[]> => {
  const response = await axios.get(`${API_URL}/member/${memberId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchLeadersByPosition = async (positionId: number, token: string): Promise<Leader[]> => {
  const response = await axios.get(`${API_URL}/position/${positionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchLeadersByChurch = async (churchId: number, token: string): Promise<Leader[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createLeader = async (data: NewLeader, token: string): Promise<Leader> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateLeader = async (id: number, data: Partial<NewLeader>, token: string): Promise<Leader> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteLeader = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const approveLeader = async (id: number, token: string): Promise<Leader> => {
  const response = await axios.put(`${API_URL}/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const revokeLeaderApproval = async (id: number, token: string): Promise<Leader> => {
  const response = await axios.put(`${API_URL}/${id}/revoke`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchActiveLeaders = async (token: string): Promise<Leader[]> => {
  const response = await axios.get(`${API_URL}/status/active`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchApprovedLeaders = async (token: string): Promise<Leader[]> => {
  const response = await axios.get(`${API_URL}/status/approved`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchLeadersSummary = async (token: string): Promise<LeaderSummary> => {
  const response = await axios.get(`${API_URL}/summary/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};