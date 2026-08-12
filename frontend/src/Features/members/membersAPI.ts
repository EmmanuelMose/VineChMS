import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Member {
  memberId: number;
  userId?: number;
  email: string;
  fullName: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  occupation?: string;
  address?: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  churchId?: number;
  organizationId?: number;
  largeOrganizationId?: number;
  membershipNumber?: string;
  membershipDate?: string;
  role: string;
  isActive: boolean;
  isBaptized: boolean;
  baptismDate?: string;
  isConfirmed: boolean;
  confirmationDate?: string;
  isLeader: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpgradeResponse {
  success: boolean;
  data: {
    member: Member;
    user: any;
  };
  message: string;
  newToken?: string;
  updatedUser?: {
    userId: number;
    email: string;
    fullName: string;
    role: string;
    churchId?: number;
    organizationId?: number;
    largeOrganizationId?: number;
    isActive: boolean;
    isVerified: boolean;
  };
}

const API_URL = `${ApiDomain}/members`;

export const fetchMembers = async (token: string): Promise<Member[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchMemberById = async (id: number, token: string): Promise<Member> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchMemberByUserId = async (userId: number, token: string): Promise<Member> => {
  const response = await axios.get(`${API_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateMember = async (id: number, data: Partial<Member>, token: string): Promise<Member> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const upgradeMemberRole = async (id: number, role: string, token: string): Promise<UpgradeResponse> => {
  const response = await axios.put(`${API_URL}/${id}/upgrade`, { role }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteMember = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};