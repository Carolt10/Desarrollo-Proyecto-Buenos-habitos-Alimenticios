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
import { educationService } from "@frontend/modules/education/services/education";

const mockClient = vi.mocked(apiClient);

const respuestaVacia = { success: true, data: [] };
const respuestaItem = { success: true, data: { id: "1" } };

describe("educationService", () => {
  describe("getAll", () => {
    it("llama a apiClient.get con /education", async () => {
      mockClient.get.mockResolvedValue(respuestaVacia);
      await educationService.getAll();
      expect(mockClient.get).toHaveBeenCalledWith("/education");
    });

    it("retorna la respuesta del cliente", async () => {
      mockClient.get.mockResolvedValue(respuestaVacia);
      const result = await educationService.getAll();
      expect(result).toBe(respuestaVacia);
    });
  });

  describe("getById", () => {
    it("llama a apiClient.get con el endpoint correcto", async () => {
      mockClient.get.mockResolvedValue(respuestaItem);
      await educationService.getById("e-456");
      expect(mockClient.get).toHaveBeenCalledWith("/education/e-456");
    });
  });

  describe("create", () => {
    it("llama a apiClient.post con /education y los datos", async () => {
      const datos = { title: "Artículo de nutrición", content: "Contenido..." };
      mockClient.post.mockResolvedValue(respuestaItem);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await educationService.create(datos as any);
      expect(mockClient.post).toHaveBeenCalledWith("/education", datos);
    });
  });

  describe("update", () => {
    it("llama a apiClient.put con el endpoint e id correcto", async () => {
      const datos = { title: "Actualizado" };
      mockClient.put.mockResolvedValue(respuestaItem);
      await educationService.update("e-456", datos);
      expect(mockClient.put).toHaveBeenCalledWith("/education/e-456", datos);
    });
  });

  describe("delete", () => {
    it("llama a apiClient.delete con el endpoint correcto", async () => {
      mockClient.delete.mockResolvedValue({ success: true });
      await educationService.delete("e-456");
      expect(mockClient.delete).toHaveBeenCalledWith("/education/e-456");
    });
  });

  describe("getByCategory", () => {
    it("llama a apiClient.get con /education y el param de categoría", async () => {
      mockClient.get.mockResolvedValue(respuestaVacia);
      await educationService.getByCategory("nutricion");
      expect(mockClient.get).toHaveBeenCalledWith("/education", {
        params: { category: "nutricion" },
      });
    });
  });
});
