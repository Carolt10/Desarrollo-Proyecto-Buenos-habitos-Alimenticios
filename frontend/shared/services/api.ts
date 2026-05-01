/**
 * Shared API client for frontend
 * Handles all HTTP requests to backend API
 */

import { ApiResponse } from "@shared/types/index";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { params?: Record<string, string> } = {},
  ): Promise<ApiResponse<T>> {
    const { params, ...requestOptions } = options;

    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    try {
      const response = await fetch(url, {
        ...requestOptions,
        headers: {
          "Content-Type": "application/json",
          ...requestOptions.headers,
        },
      });

      const data = (await response.json()) as ApiResponse<T>;

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("[API Error]", error);
      throw error;
    }
  }

  get<T>(endpoint: string, options?: RequestInit & { params?: Record<string, string> }) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
