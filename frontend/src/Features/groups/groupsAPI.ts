import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Group {
  groupId: number;
  churchId: number;
  name: string;
  description?: string;
  type?: string;
  leaderId?: number;
  meetingDay?: number;
  meetingTime?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewGroup {
  churchId: number;
  name: string;
  description?: string;
  type?: string;
  leaderId?: number;
  meetingDay?: number;
  meetingTime?: string;
  location?: string;
  isActive?: boolean;
}

export interface GroupMember {
  groupMemberId: number;
  groupId: number;
  memberId: number;
  joinedAt: string;
  isActive: boolean;
  role?: string;
  fullName?: string;
  email?: string;
  createdAt: string;
}

export interface NewGroupMember {
  groupId: number;
  memberId: number;
  role?: string;
  isActive?: boolean;
}

export interface GroupJoinRequest {
  requestId: number;
  groupId: number;
  memberId: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  memberName?: string;
  memberEmail?: string;
  groupName?: string;
}

export interface NewGroupJoinRequest {
  groupId: number;
  memberId: number;
  message?: string;
}

const API_URL = `${ApiDomain}/groups`;

export const fetchGroups = async (token: string): Promise<Group[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGroupById = async (id: number, token: string): Promise<Group> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGroupsByChurch = async (churchId: number, token: string): Promise<Group[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchActiveGroups = async (token: string): Promise<Group[]> => {
  const response = await axios.get(`${API_URL}/active`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createGroup = async (data: NewGroup, token: string): Promise<Group> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateGroup = async (id: number, data: Partial<NewGroup>, token: string): Promise<Group> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteGroup = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addMemberToGroup = async (data: NewGroupMember, token: string): Promise<GroupMember> => {
  const response = await axios.post(`${API_URL}/member`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGroupMembers = async (groupId: number, token: string): Promise<GroupMember[]> => {
  const response = await axios.get(`${API_URL}/${groupId}/members`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchMemberGroups = async (memberId: number, token: string): Promise<GroupMember[]> => {
  const response = await axios.get(`${API_URL}/member/${memberId}/groups`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateGroupMember = async (id: number, data: Partial<NewGroupMember>, token: string): Promise<GroupMember> => {
  const response = await axios.put(`${API_URL}/member/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const removeMemberFromGroup = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/member/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const requestToJoinGroup = async (data: NewGroupJoinRequest, token: string): Promise<GroupJoinRequest> => {
  const response = await axios.post(`${API_URL}/request`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchGroupJoinRequests = async (groupId: number, token: string): Promise<GroupJoinRequest[]> => {
  const response = await axios.get(`${API_URL}/requests/${groupId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchMyJoinRequests = async (token: string): Promise<GroupJoinRequest[]> => {
  const response = await axios.get(`${API_URL}/my-requests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const approveJoinRequest = async (requestId: number, token: string): Promise<GroupJoinRequest> => {
  const response = await axios.put(`${API_URL}/requests/${requestId}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const rejectJoinRequest = async (requestId: number, token: string): Promise<GroupJoinRequest> => {
  const response = await axios.put(`${API_URL}/requests/${requestId}/reject`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};