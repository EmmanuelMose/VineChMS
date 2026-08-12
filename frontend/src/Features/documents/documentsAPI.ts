import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export interface Document {
  documentId: number;
  churchId: number;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  filePublicId?: string;
  fileSize?: number;
  fileType?: string;
  documentType?: string;
  visibility: "public" | "members_only" | "leadership_only" | "private";
  thumbnail?: string;
  thumbnailPublicId?: string;
  uploadedBy?: number;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewDocument {
  churchId: number;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  filePublicId?: string;
  fileSize?: number;
  fileType?: string;
  documentType?: string;
  visibility?: "public" | "members_only" | "leadership_only" | "private";
  thumbnail?: string;
  thumbnailPublicId?: string;
  uploadedBy?: number;
  version?: number;
  isActive?: boolean;
}

const API_URL = `${ApiDomain}/documents`;

export const fetchDocuments = async (token: string): Promise<Document[]> => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchAllDocuments = async (token: string): Promise<Document[]> => {
  const response = await axios.get(`${API_URL}/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDocumentById = async (id: number, token: string): Promise<Document> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDocumentsByChurch = async (churchId: number, token: string): Promise<Document[]> => {
  const response = await axios.get(`${API_URL}/church/${churchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDocumentsByType = async (documentType: string, token: string): Promise<Document[]> => {
  const response = await axios.get(`${API_URL}/type/${documentType}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDocumentsByVisibility = async (visibility: string, token: string): Promise<Document[]> => {
  const response = await axios.get(`${API_URL}/visibility/${visibility}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDocumentsByUploader = async (uploadedBy: number, token: string): Promise<Document[]> => {
  const response = await axios.get(`${API_URL}/uploader/${uploadedBy}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchActiveDocuments = async (token: string): Promise<Document[]> => {
  const response = await axios.get(`${API_URL}/active`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchInactiveDocuments = async (token: string): Promise<Document[]> => {
  const response = await axios.get(`${API_URL}/inactive`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const fetchDocumentsCount = async (token: string): Promise<any> => {
  const response = await axios.get(`${API_URL}/count`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const createDocument = async (data: NewDocument, token: string): Promise<Document> => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateDocument = async (id: number, data: Partial<NewDocument>, token: string): Promise<Document> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const deleteDocument = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const hardDeleteDocument = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}/permanent`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const restoreDocument = async (id: number, token: string): Promise<Document> => {
  const response = await axios.put(`${API_URL}/${id}/restore`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};