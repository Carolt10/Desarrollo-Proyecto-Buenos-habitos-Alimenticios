import { vi, describe, it, expect } from "vitest";

// Mock del repositorio antes de importar el servicio
vi.mock("@backend/modules/testimonials/repository", () => ({
  testimonialsRepository: {
    getTestimonials: vi.fn(),
    getTestimonialById: vi.fn(),
    createTestimonial: vi.fn(),
    deleteTestimonial: vi.fn(),
  },
}));

import { testimonialsService } from "@backend/modules/testimonials/service";
import { testimonialsRepository } from "@backend/modules/testimonials/repository";
import { ApiException } from "@backend/shared/utils/errors";

const mockRepo = vi.mocked(testimonialsRepository);

const datosValidos = {
  name: "María García",
  role: "Madre",
  quote: "Este programa cambió nuestra alimentación familiar.",
  rating: 5,
  achievement: "Bajó 8kg en 3 meses",
  categoria_id: "cat-001",
};

const testimonioCompleto = {
  id: "t-001",
  ...datosValidos,
  created_at: "2024-01-15T10:00:00Z",
};

describe("testimonialsService.getTestimonials", () => {
  it("delega al repositorio y retorna los datos", async () => {
    mockRepo.getTestimonials.mockResolvedValue([testimonioCompleto]);

    const resultado = await testimonialsService.getTestimonials();

    expect(mockRepo.getTestimonials).toHaveBeenCalledOnce();
    expect(resultado).toEqual([testimonioCompleto]);
  });

  it("retorna array vacío cuando no hay testimonios", async () => {
    mockRepo.getTestimonials.mockResolvedValue([]);

    const resultado = await testimonialsService.getTestimonials();

    expect(resultado).toEqual([]);
  });
});

describe("testimonialsService.getTestimonialById", () => {
  it("delega al repositorio con el id correcto", async () => {
    mockRepo.getTestimonialById.mockResolvedValue(testimonioCompleto);

    const resultado = await testimonialsService.getTestimonialById("t-001");

    expect(mockRepo.getTestimonialById).toHaveBeenCalledWith("t-001");
    expect(resultado).toBe(testimonioCompleto);
  });

  it("retorna null cuando el testimonio no existe", async () => {
    mockRepo.getTestimonialById.mockResolvedValue(null);

    const resultado = await testimonialsService.getTestimonialById("no-existe");

    expect(resultado).toBeNull();
  });
});

describe("testimonialsService.createTestimonial", () => {
  it("lanza ApiException 400 cuando el nombre está vacío", async () => {
    await expect(
      testimonialsService.createTestimonial({ ...datosValidos, name: "" })
    ).rejects.toThrow(new ApiException(400, "El nombre es requerido"));
  });

  it("lanza ApiException 400 cuando el nombre es solo espacios", async () => {
    await expect(
      testimonialsService.createTestimonial({ ...datosValidos, name: "   " })
    ).rejects.toThrow(ApiException);
  });

  it("lanza ApiException 400 cuando el quote está vacío", async () => {
    await expect(
      testimonialsService.createTestimonial({ ...datosValidos, quote: "" })
    ).rejects.toThrow(new ApiException(400, "El testimonio es requerido"));
  });

  it("lanza ApiException 400 cuando el quote es solo espacios", async () => {
    await expect(
      testimonialsService.createTestimonial({ ...datosValidos, quote: "  " })
    ).rejects.toThrow(ApiException);
  });

  it("lanza ApiException 400 cuando rating es menor a 1", async () => {
    await expect(
      testimonialsService.createTestimonial({ ...datosValidos, rating: 0 })
    ).rejects.toThrow(
      new ApiException(400, "La calificación debe estar entre 1 y 5")
    );
  });

  it("lanza ApiException 400 cuando rating es mayor a 5", async () => {
    await expect(
      testimonialsService.createTestimonial({ ...datosValidos, rating: 6 })
    ).rejects.toThrow(
      new ApiException(400, "La calificación debe estar entre 1 y 5")
    );
  });

  it("acepta rating igual a 1 (límite inferior)", async () => {
    mockRepo.createTestimonial.mockResolvedValue({
      ...testimonioCompleto,
      rating: 1,
    });

    await testimonialsService.createTestimonial({ ...datosValidos, rating: 1 });

    expect(mockRepo.createTestimonial).toHaveBeenCalled();
  });

  it("acepta rating igual a 5 (límite superior)", async () => {
    mockRepo.createTestimonial.mockResolvedValue(testimonioCompleto);

    await testimonialsService.createTestimonial({ ...datosValidos, rating: 5 });

    expect(mockRepo.createTestimonial).toHaveBeenCalled();
  });

  it("llama al repositorio con los datos válidos", async () => {
    mockRepo.createTestimonial.mockResolvedValue(testimonioCompleto);

    const resultado = await testimonialsService.createTestimonial(datosValidos);

    expect(mockRepo.createTestimonial).toHaveBeenCalledWith(datosValidos);
    expect(resultado).toBe(testimonioCompleto);
  });

  it("pasa user_id opcional al repositorio", async () => {
    const datosConUser = { ...datosValidos, user_id: "user-123" };
    mockRepo.createTestimonial.mockResolvedValue({
      ...testimonioCompleto,
      user_id: "user-123",
    });

    await testimonialsService.createTestimonial(datosConUser);

    expect(mockRepo.createTestimonial).toHaveBeenCalledWith(datosConUser);
  });
});

describe("testimonialsService.deleteTestimonial", () => {
  it("lanza ApiException 404 cuando el testimonio no existe", async () => {
    mockRepo.getTestimonialById.mockResolvedValue(null);

    await expect(
      testimonialsService.deleteTestimonial("no-existe")
    ).rejects.toThrow(new ApiException(404, "Testimonio no encontrado"));
  });

  it("verifica existencia antes de eliminar", async () => {
    mockRepo.getTestimonialById.mockResolvedValue(testimonioCompleto);
    mockRepo.deleteTestimonial.mockResolvedValue(true);

    await testimonialsService.deleteTestimonial("t-001");

    expect(mockRepo.getTestimonialById).toHaveBeenCalledWith("t-001");
  });

  it("elimina el testimonio cuando existe", async () => {
    mockRepo.getTestimonialById.mockResolvedValue(testimonioCompleto);
    mockRepo.deleteTestimonial.mockResolvedValue(true);

    const resultado = await testimonialsService.deleteTestimonial("t-001");

    expect(mockRepo.deleteTestimonial).toHaveBeenCalledWith("t-001");
    expect(resultado).toBe(true);
  });
});
