/**
 * Integration tests: /api/testimonials y /api/testimonials/[id]
 *
 * Qué se prueba:
 *   - Route → Service → Repositorio (mockeado)
 *   - Parseo de body JSON
 *   - Status codes y shape de respuesta HTTP reales
 *   - Propagación de errores del service al response
 *
 * Solo se mockea la capa de repositorio (Supabase).
 * next/server NO se mockea — se usa el NextResponse real.
 */

import { vi, describe, it, expect } from "vitest";

vi.mock("@backend/modules/testimonials/repository", () => ({
  testimonialsRepository: {
    getTestimonials: vi.fn(),
    getTestimonialById: vi.fn(),
    createTestimonial: vi.fn(),
    deleteTestimonial: vi.fn(),
  },
}));

import { GET, POST } from "@/app/api/testimonials/route";
import {
  GET as GET_BY_ID,
  DELETE,
} from "@/app/api/testimonials/[id]/route";
import { testimonialsRepository } from "@backend/modules/testimonials/repository";
import { NextRequest } from "next/server";

const mockRepo = vi.mocked(testimonialsRepository);

// ─── Helpers ────────────────────────────────────────────────────────────────

const getRequest = () =>
  new NextRequest("http://localhost/api/testimonials");

const postRequest = (body: unknown) =>
  new NextRequest("http://localhost/api/testimonials", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

const idParams = (id: string) => ({ params: { id } });

// ─── Datos de prueba ─────────────────────────────────────────────────────────

const testimonioBase = {
  id: "t-001",
  name: "María García",
  role: "Madre",
  quote: "Este programa cambió nuestra alimentación familiar.",
  rating: 5,
  achievement: "Bajó 8kg en 3 meses",
  categoria_id: "cat-001",
  created_at: "2024-01-15T10:00:00Z",
};

const payloadValido = {
  name: "Juan Pérez",
  role: "Padre",
  quote: "Muy recomendado para familias.",
  rating: 4,
  achievement: "Mejores hábitos en casa",
  categoria_id: "cat-001",
};

// ─── GET /api/testimonials ───────────────────────────────────────────────────

describe("GET /api/testimonials", () => {
  it("retorna 200 y la lista de testimonios", async () => {
    mockRepo.getTestimonials.mockResolvedValue([testimonioBase]);

    const response = await GET(getRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([testimonioBase]);
  });

  it("retorna 200 con array vacío cuando no hay testimonios", async () => {
    mockRepo.getTestimonials.mockResolvedValue([]);

    const response = await GET(getRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  it("retorna 500 cuando el servicio lanza un error inesperado", async () => {
    mockRepo.getTestimonials.mockRejectedValue(new Error("DB connection failed"));

    const response = await GET(getRequest());
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
  });
});

// ─── POST /api/testimonials ──────────────────────────────────────────────────

describe("POST /api/testimonials", () => {
  it("crea un testimonio con datos válidos y retorna 200", async () => {
    const creado = { ...testimonioBase, ...payloadValido };
    mockRepo.createTestimonial.mockResolvedValue(creado);

    const response = await POST(postRequest(payloadValido));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Testimonio creado exitosamente");
    expect(body.data).toEqual(creado);
  });

  it("retorna 400 cuando el nombre está vacío", async () => {
    const response = await POST(
      postRequest({ ...payloadValido, name: "" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("El nombre es requerido");
  });

  it("retorna 400 cuando el testimonio (quote) está vacío", async () => {
    const response = await POST(
      postRequest({ ...payloadValido, quote: "" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("El testimonio es requerido");
  });

  it("retorna 400 cuando el rating es menor a 1", async () => {
    const response = await POST(
      postRequest({ ...payloadValido, rating: 0 })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("La calificación debe estar entre 1 y 5");
  });

  it("retorna 400 cuando el rating es mayor a 5", async () => {
    const response = await POST(
      postRequest({ ...payloadValido, rating: 6 })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("acepta user_id opcional en el body", async () => {
    const creado = { ...testimonioBase, user_id: "u-123" };
    mockRepo.createTestimonial.mockResolvedValue(creado);

    const response = await POST(
      postRequest({ ...payloadValido, user_id: "u-123" })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });
});

// ─── GET /api/testimonials/[id] ──────────────────────────────────────────────

describe("GET /api/testimonials/[id]", () => {
  it("retorna 200 y el testimonio cuando existe", async () => {
    mockRepo.getTestimonialById.mockResolvedValue(testimonioBase);

    const req = new NextRequest("http://localhost/api/testimonials/t-001");
    const response = await GET_BY_ID(req, idParams("t-001"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(testimonioBase);
  });

  it("retorna 404 cuando el testimonio no existe", async () => {
    mockRepo.getTestimonialById.mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/testimonials/no-existe");
    const response = await GET_BY_ID(req, idParams("no-existe"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Testimonio no encontrado");
  });

  it("retorna 500 cuando el repositorio lanza error inesperado", async () => {
    mockRepo.getTestimonialById.mockRejectedValue(new Error("DB timeout"));

    const req = new NextRequest("http://localhost/api/testimonials/t-001");
    const response = await GET_BY_ID(req, idParams("t-001"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
  });
});

// ─── DELETE /api/testimonials/[id] ───────────────────────────────────────────

describe("DELETE /api/testimonials/[id]", () => {
  it("elimina el testimonio cuando existe y retorna 200", async () => {
    mockRepo.getTestimonialById.mockResolvedValue(testimonioBase);
    mockRepo.deleteTestimonial.mockResolvedValue(true);

    const req = new NextRequest("http://localhost/api/testimonials/t-001", {
      method: "DELETE",
    });
    const response = await DELETE(req, idParams("t-001"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Testimonio eliminado exitosamente");
  });

  it("retorna 404 cuando el testimonio no existe", async () => {
    mockRepo.getTestimonialById.mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/testimonials/no-existe",
      { method: "DELETE" }
    );
    const response = await DELETE(req, idParams("no-existe"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Testimonio no encontrado");
  });
});
