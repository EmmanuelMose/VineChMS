import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Department {
  departmentId: number;
  name: string;
  description?: string;
  type: string;
  parentDepartmentId?: number;
  largeOrganizationId?: number;
  organizationId?: number;
  churchId?: number;
  leaderId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewDepartment {
  name: string;
  description?: string;
  type: string;
  parentDepartmentId?: number;
  largeOrganizationId?: number;
  organizationId?: number;
  churchId?: number;
  leaderId?: number;
  isActive?: boolean;
}

export interface DepartmentMember {
  departmentMemberId: number;
  departmentId: number;
  memberId: number;
  positionId?: number;
  role?: string;
  isActive: boolean;
  joinedAt: string;
  fullName?: string;
  email?: string;
  positionName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewDepartmentMember {
  departmentId: number;
  memberId: number;
  positionId?: number;
  role?: string;
  isActive?: boolean;
}

const API_URL = `${ApiDomain}/departments`;

export const fetchDepartments = async (token: string): Promise<Department[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDepartmentById = async (id: number, token: string): Promise<Department> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDepartmentsByLargeOrganization = async (largeOrganizationId: number, token: string): Promise<Department[]> => {
  const response = await axios.get(`${API_URL}/large-org/${largeOrganizationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDepartmentsByOrganization = async (organizationId: number, token: string): Promise<Department[]> => {
  const response = await axios.get(`${API_URL}/organization/${organizationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDepartmentsByChurch = async (churchId: number, token: string): Promise<Department[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchSubDepartments = async (parentId: number, token: string): Promise<Department[]> => {
  const response = await axios.get(`${API_URL}/sub/${parentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createDepartment = async (data: NewDepartment, token: string): Promise<Department> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateDepartment = async (id: number, data: Partial<NewDepartment>, token: string): Promise<Department> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteDepartment = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addMemberToDepartment = async (data: NewDepartmentMember, token: string): Promise<DepartmentMember> => {
  const response = await axios.post(`${API_URL}/member`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDepartmentMembers = async (departmentId: number, token: string): Promise<DepartmentMember[]> => {
  const response = await axios.get(`${API_URL}/${departmentId}/members`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateDepartmentMember = async (id: number, data: Partial<NewDepartmentMember>, token: string): Promise<DepartmentMember> => {
  const response = await axios.put(`${API_URL}/member/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const removeMemberFromDepartment = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/member/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};