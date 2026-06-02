import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { ApiClient } from "@frontend/shared/services/api";

describe("ApiClient", () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient("/api");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const mockRespuestaExitosa = (data: unknown) => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data }),
    } as Response);
  };

  const mockRespuestaError = (status: number, error: string) => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status,
      json: async () => ({ success: false, error }),
    } as Response);
  };

  describe("constructor", () => {
    it("usa /api como baseUrl por defecto", async () => {
      const clientDefault = new ApiClient();
      mockRespuestaExitosa([]);
      await clientDefault.get("/recetas");
      expect(fetch).toHaveBeenCalledWith(
        "/api/recetas",
        expect.anything()
      );
    });

    it("acepta una baseUrl personalizada", async () => {
      const clientCustom = new ApiClient("https://api.ejemplo.com");
      mockRespuestaExitosa([]);
      await clientCustom.get("/recetas");
      expect(fetch).toHaveBeenCalledWith(
        "https://api.ejemplo.com/recetas",
        expect.anything()
      );
    });
  });

  describe("get", () => {
    it("llama a fetch con método GET y la URL correcta", async () => {
      mockRespuestaExitosa([]);
      await client.get("/recetas");
      expect(fetch).toHaveBeenCalledWith(
        "/api/recetas",
        expect.objectContaining({ method: "GET" })
      );
    });

    it("agrega query params a la URL", async () => {
      mockRespuestaExitosa([]);
      await client.get("/recetas", { params: { categoria: "sopas" } });
      expect(fetch).toHaveBeenCalledWith(
        "/api/recetas?categoria=sopas",
        expect.anything()
      );
    });

    it("agrega múltiples query params", async () => {
      mockRespuestaExitosa([]);
      await client.get("/recetas", {
        params: { categoria: "sopas", page: "1" },
      });
      const urlLlamada = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(urlLlamada).toContain("categoria=sopas");
      expect(urlLlamada).toContain("page=1");
    });

    it("retorna los datos parseados de la respuesta", async () => {
      const datos = [{ id: "1", titulo: "Sopa de zanahoria" }];
      mockRespuestaExitosa(datos);
      const resultado = await client.get("/recetas");
      expect(resultado.data).toEqual(datos);
    });

    it("incluye Content-Type application/json", async () => {
      mockRespuestaExitosa([]);
      await client.get("/recetas");
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });
  });

  describe("post", () => {
    it("llama a fetch con método POST y body serializado", async () => {
      mockRespuestaExitosa({ id: "1" });
      const body = { titulo: "Nueva receta" };
      await client.post("/recetas", body);
      expect(fetch).toHaveBeenCalledWith(
        "/api/recetas",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(body),
        })
      );
    });

    it("puede enviarse sin body", async () => {
      mockRespuestaExitosa({ id: "1" });
      await client.post("/recetas");
      expect(fetch).toHaveBeenCalledWith(
        "/api/recetas",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  describe("put", () => {
    it("llama a fetch con método PUT y body serializado", async () => {
      mockRespuestaExitosa({ id: "1" });
      const body = { titulo: "Receta actualizada" };
      await client.put("/recetas/1", body);
      expect(fetch).toHaveBeenCalledWith(
        "/api/recetas/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(body),
        })
      );
    });
  });

  describe("delete", () => {
    it("llama a fetch con método DELETE", async () => {
      mockRespuestaExitosa(null);
      await client.delete("/recetas/1");
      expect(fetch).toHaveBeenCalledWith(
        "/api/recetas/1",
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  describe("manejo de errores", () => {
    it("lanza error cuando la respuesta no es ok", async () => {
      mockRespuestaError(404, "No encontrado");
      await expect(client.get("/recetas/999")).rejects.toThrow("No encontrado");
    });

    it("lanza error con código HTTP cuando no hay mensaje de error", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ success: false }),
      } as Response);
      await expect(client.get("/recetas")).rejects.toThrow("HTTP 500");
    });

    it("re-lanza errores de red", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("Error de red"));
      await expect(client.get("/recetas")).rejects.toThrow("Error de red");
    });
  });
});
