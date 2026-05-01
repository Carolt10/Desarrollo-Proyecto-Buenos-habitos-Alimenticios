/**
 * Testimonials API client service
 * Handles all testimonial-related API calls
 */

import { apiClient } from "@frontend/shared/services/api";
import { Testimonial } from "@shared/types/index";

export const testimonialsService = {
  getAll: () => apiClient.get<Testimonial[]>("/testimonials"),

  getById: (id: string) => apiClient.get<Testimonial>(`/testimonials/${id}`),

  create: (data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">) =>
    apiClient.post<Testimonial>("/testimonials", data),

  update: (id: string, data: Partial<Testimonial>) =>
    apiClient.put<Testimonial>(`/testimonials/${id}`, data),

  delete: (id: string) => apiClient.delete(`/testimonials/${id}`),
};
