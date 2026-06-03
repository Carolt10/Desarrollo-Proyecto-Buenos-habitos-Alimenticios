import { vi, describe, it, expect } from "vitest";

vi.mock("@frontend/shared/services/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { apiClient } from "@frontend/shared/services/api";
import { testimonialsService } from "@frontend/modules/testimonials/services/testimonials";

const mockClient = vi.mocked(apiClient);

const respuestaVacia = { success: true, data: [] };
const respuestaItem = { success: true, data: { id: "1" } };

describe("testimonialsService", () => {
  describe("getAll", () => {
    it("llama a apiClient.get con /testimonials", async () => {
      mockClient.get.mockResolvedValue(respuestaVacia);
      await testimonialsService.getAll();
      expect(mockClient.get).toHaveBeenCalledWith("/testimonials");
    });

    it("retorna la respuesta del cliente", async () => {
      mockClient.get.mockResolvedValue(respuestaVacia);
      const result = await testimonialsService.getAll();
      expect(result).toBe(respuestaVacia);
    });
  });

  describe("getById", () => {
    it("llama a apiClient.get con el endpoint correcto", async () => {
      mockClient.get.mockResolvedValue(respuestaItem);
      await testimonialsService.getById("t-123");
      expect(mockClient.get).toHaveBeenCalledWith("/testimonials/t-123");
    });
  });

  describe("create", () => {
    it("llama a apiClient.post con /testimonials y los datos", async () => {
      const datos = { authorName: "Juan", content: "Excelente" };
      mockClient.post.mockResolvedValue(respuestaItem);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await testimonialsService.create(datos as any);
      expect(mockClient.post).toHaveBeenCalledWith("/testimonials", datos);
    });
  });

  describe("update", () => {
    it("llama a apiClient.put con el endpoint e id correcto", async () => {
      const datos = { content: "Actualizado" };
      mockClient.put.mockResolvedValue(respuestaItem);
      await testimonialsService.update("t-123", datos);
      expect(mockClient.put).toHaveBeenCalledWith("/testimonials/t-123", datos);
    });
  });

  describe("delete", () => {
    it("llama a apiClient.delete con el endpoint correcto", async () => {
      mockClient.delete.mockResolvedValue({ success: true });
      await testimonialsService.delete("t-123");
      expect(mockClient.delete).toHaveBeenCalledWith("/testimonials/t-123");
    });
  });
});
