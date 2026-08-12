import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface User {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  profilePicture?: string;
  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  occupation?: string;
  address?: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: string;
  organizationId?: number;
  churchId?: number;
  largeOrganizationId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RefreshResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  invitationToken: string;
}

export interface VerifyData {
  email: string;
  code: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyResetCodeData {
  email: string;
  code: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
}

export interface InviteMemberData {
  fullName: string;
  email: string;
  role: string;
  organizationId?: number;
  churchId?: number;
  largeOrganizationId?: number;
}

const API_URL = `${ApiDomain}/auth`;

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const refreshUser = async (token: string): Promise<RefreshResponse> => {
  const response = await axios.post(`${API_URL}/refresh`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

export const verifyUser = async (data: VerifyData): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${API_URL}/verify`, data);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordData): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${API_URL}/forgot-password`, data);
  return response.data;
};

export const verifyResetCode = async (data: VerifyResetCodeData): Promise<{ success: boolean }> => {
  const response = await axios.post(`${API_URL}/verify-reset-code`, data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordData): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${API_URL}/reset-password`, data);
  return response.data;
};

export const resendVerification = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${API_URL}/resend-verification`, { email });
  return response.data;
};

export const getCurrentUser = async (token: string): Promise<{ success: boolean; data: User }> => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const inviteMember = async (data: InviteMemberData, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${API_URL}/invite`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};