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
import { recipesService } from "@frontend/modules/recipes/services/recipes";

const mockClient = vi.mocked(apiClient);

const respuestaVacia = { success: true, data: [] };
const respuestaItem = { success: true, data: { id: "1" } };

describe("recipesService", () => {
  describe("getAll", () => {
    it("llama a apiClient.get con /recipes", async () => {
      mockClient.get.mockResolvedValue(respuestaVacia);
      await recipesService.getAll();
      expect(mockClient.get).toHaveBeenCalledWith("/recipes");
    });

    it("retorna la respuesta del cliente", async () => {
      mockClient.get.mockResolvedValue(respuestaVacia);
      const result = await recipesService.getAll();
      expect(result).toBe(respuestaVacia);
    });
  });

  describe("getById", () => {
    it("llama a apiClient.get con el endpoint correcto", async () => {
      mockClient.get.mockResolvedValue(respuestaItem);
      await recipesService.getById("r-789");
      expect(mockClient.get).toHaveBeenCalledWith("/recipes/r-789");
    });
  });

  describe("create", () => {
    it("llama a apiClient.post con /recipes y los datos", async () => {
      const datos = { title: "Sopa de verduras", ingredients: ["zanahoria"] };
      mockClient.post.mockResolvedValue(respuestaItem);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await recipesService.create(datos as any);
      expect(mockClient.post).toHaveBeenCalledWith("/recipes", datos);
    });
  });

  describe("update", () => {
    it("llama a apiClient.put con el endpoint e id correcto", async () => {
      const datos = { title: "Receta actualizada" };
      mockClient.put.mockResolvedValue(respuestaItem);
      await recipesService.update("r-789", datos);
      expect(mockClient.put).toHaveBeenCalledWith("/recipes/r-789", datos);
    });
  });

  describe("delete", () => {
    it("llama a apiClient.delete con el endpoint correcto", async () => {
      mockClient.delete.mockResolvedValue({ success: true });
      await recipesService.delete("r-789");
      expect(mockClient.delete).toHaveBeenCalledWith("/recipes/r-789");
    });
  });

  describe("searchByCategory", () => {
    it("llama a apiClient.get con /recipes y el param de categoría", async () => {
      mockClient.get.mockResolvedValue(respuestaVacia);
      await recipesService.searchByCategory("sopas");
      expect(mockClient.get).toHaveBeenCalledWith("/recipes", {
        params: { category: "sopas" },
      });
    });
  });
});
