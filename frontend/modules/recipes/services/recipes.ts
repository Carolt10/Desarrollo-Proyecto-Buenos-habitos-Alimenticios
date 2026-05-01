/**
 * Recipes API client service
 * Handles all recipe-related API calls
 */

import { apiClient } from "@frontend/shared/services/api";
import { Recipe } from "@shared/types/index";

export const recipesService = {
  getAll: () => apiClient.get<Recipe[]>("/recipes"),

  getById: (id: string) => apiClient.get<Recipe>(`/recipes/${id}`),

  create: (data: Omit<Recipe, "id" | "createdAt" | "updatedAt">) =>
    apiClient.post<Recipe>("/recipes", data),

  update: (id: string, data: Partial<Recipe>) => apiClient.put<Recipe>(`/recipes/${id}`, data),

  delete: (id: string) => apiClient.delete(`/recipes/${id}`),

  searchByCategory: (category: string) =>
    apiClient.get<Recipe[]>("/recipes", { params: { category } }),
};
