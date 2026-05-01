/**
 * Education API client service
 * Handles all education-related API calls
 */

import { apiClient } from "@frontend/shared/services/api";
import { EducationContent } from "@shared/types/index";

export const educationService = {
  getAll: () => apiClient.get<EducationContent[]>("/education"),

  getById: (id: string) => apiClient.get<EducationContent>(`/education/${id}`),

  create: (data: Omit<EducationContent, "id" | "createdAt" | "updatedAt">) =>
    apiClient.post<EducationContent>("/education", data),

  update: (id: string, data: Partial<EducationContent>) =>
    apiClient.put<EducationContent>(`/education/${id}`, data),

  delete: (id: string) => apiClient.delete(`/education/${id}`),

  getByCategory: (category: string) =>
    apiClient.get<EducationContent[]>("/education", { params: { category } }),
};
