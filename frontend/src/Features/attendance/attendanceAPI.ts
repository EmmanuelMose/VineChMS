import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Attendance {
  churchId: number;
  attendanceId: number;
  memberId: number;
  serviceId: number;
  date: string;
  attended: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  fullName?: string;
  serviceName?: string;
  createdAt: string;
}

export interface NewAttendance {
  memberId: number;
  serviceId: number;
  date?: string;
  attended?: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  attendanceRate: number;
}

const API_URL = `${ApiDomain}/attendance`;

export const fetchAttendance = async (token: string): Promise<Attendance[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAttendanceById = async (id: number, token: string): Promise<Attendance> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAttendanceByMember = async (memberId: number, token: string): Promise<Attendance[]> => {
  const response = await axios.get(`${API_URL}/member/${memberId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAttendanceByService = async (serviceId: number, token: string): Promise<Attendance[]> => {
  const response = await axios.get(`${API_URL}/service/${serviceId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAttendanceByDate = async (date: string, token: string): Promise<Attendance[]> => {
  const response = await axios.get(`${API_URL}/date/${date}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAttendanceSummary = async (serviceId: number, token: string): Promise<AttendanceSummary> => {
  const response = await axios.get(`${API_URL}/summary/${serviceId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAttendanceByMemberAndService = async (memberId: number, serviceId: number, token: string): Promise<Attendance[]> => {
  const response = await axios.get(`${API_URL}/member/${memberId}/service/${serviceId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createAttendance = async (data: NewAttendance, token: string): Promise<Attendance> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateAttendance = async (id: number, data: Partial<NewAttendance>, token: string): Promise<Attendance> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteAttendance = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};