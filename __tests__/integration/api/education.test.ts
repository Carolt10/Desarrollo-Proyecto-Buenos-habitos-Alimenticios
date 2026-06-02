/**
 * Integration tests: /api/education
 *
 * Qué se prueba:
 *   - Route → Service → Repositorio (mockeado)
 *   - Ramificación por query param ?type= (categories, videos, articles, sin tipo)
 *   - Ramificación por body.type en POST (video, article, tipo inválido)
 *   - Status codes y shape de respuesta HTTP reales
 *   - Propagación de errores de validación del service
 *
 * Solo se mockea la capa de repositorio (Supabase).
 * next/server NO se mockea — se usa el NextResponse real.
 */

import { vi, describe, it, expect } from "vitest";

vi.mock("@backend/modules/education/repository", () => ({
  educationRepository: {
    getCategories: vi.fn(),
    getVideos: vi.fn(),
    createVideo: vi.fn(),
    getArticles: vi.fn(),
    createArticle: vi.fn(),
  },
}));

import { GET, POST } from "@/app/api/education/route";
import { educationRepository } from "@backend/modules/education/repository";
import { NextRequest } from "next/server";

const mockRepo = vi.mocked(educationRepository);

// ─── Helpers ────────────────────────────────────────────────────────────────

const getRequest = (type?: string) => {
  const url = type
    ? `http://localhost/api/education?type=${type}`
    : "http://localhost/api/education";
  return new NextRequest(url);
};

const postRequest = (body: unknown) =>
  new NextRequest("http://localhost/api/education", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

// ─── Datos de prueba ─────────────────────────────────────────────────────────

const categorias = [
  { id: "cat-1", name: "Nutrición" },
  { id: "cat-2", name: "Hábitos" },
];

const videos = [
  {
    id: "v-1",
    titulo: "Alimentación en la infancia",
    autor: "Dra. López",
    duracion: "10:00",
  },
];

const articulos = [
  {
    id: "a-1",
    titulo: "Guía de nutrición",
    tiempo_lectura: "5 min",
  },
];

const payloadVideoValido = {
  type: "video",
  titulo: "Nutrición para bebés",
  descripcion: "Guía completa",
  autor: "Dra. García",
  tipo_autor: "Nutricionista",
  duracion: "15:00",
  youtube_url: "https://youtube.com/watch?v=abc",
  categoria_id: "cat-1",
};

const payloadArticuloValido = {
  type: "article",
  titulo: "Hábitos alimenticios saludables",
  descripcion: "Cómo crear rutinas",
  contenido: "El contenido completo del artículo...",
  tiempo_lectura: "7 min",
  categoria_id: "cat-1",
};

// ─── GET /api/education?type=categories ──────────────────────────────────────

describe("GET /api/education?type=categories", () => {
  it("retorna 200 y las categorías", async () => {
    mockRepo.getCategories.mockResolvedValue(categorias);

    const response = await GET(getRequest("categories"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(categorias);
    expect(mockRepo.getCategories).toHaveBeenCalledOnce();
  });

  it("no llama a getVideos ni getArticles", async () => {
    mockRepo.getCategories.mockResolvedValue(categorias);

    await GET(getRequest("categories"));

    expect(mockRepo.getVideos).not.toHaveBeenCalled();
    expect(mockRepo.getArticles).not.toHaveBeenCalled();
  });
});

// ─── GET /api/education?type=videos ──────────────────────────────────────────

describe("GET /api/education?type=videos", () => {
  it("retorna 200 y los videos", async () => {
    mockRepo.getVideos.mockResolvedValue(videos);

    const response = await GET(getRequest("videos"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(videos);
    expect(mockRepo.getVideos).toHaveBeenCalledOnce();
  });

  it("no llama a getCategories ni getArticles", async () => {
    mockRepo.getVideos.mockResolvedValue(videos);

    await GET(getRequest("videos"));

    expect(mockRepo.getCategories).not.toHaveBeenCalled();
    expect(mockRepo.getArticles).not.toHaveBeenCalled();
  });
});

// ─── GET /api/education?type=articles ────────────────────────────────────────

describe("GET /api/education?type=articles", () => {
  it("retorna 200 y los artículos", async () => {
    mockRepo.getArticles.mockResolvedValue(articulos);

    const response = await GET(getRequest("articles"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(articulos);
    expect(mockRepo.getArticles).toHaveBeenCalledOnce();
  });
});

// ─── GET /api/education (sin type) ───────────────────────────────────────────

describe("GET /api/education (sin query param)", () => {
  it("retorna 200 con categories, videos y articles combinados", async () => {
    mockRepo.getCategories.mockResolvedValue(categorias);
    mockRepo.getVideos.mockResolvedValue(videos);
    mockRepo.getArticles.mockResolvedValue(articulos);

    const response = await GET(getRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual({ categories: categorias, videos, articles: articulos });
  });

  it("llama a los tres métodos del repositorio en paralelo", async () => {
    mockRepo.getCategories.mockResolvedValue([]);
    mockRepo.getVideos.mockResolvedValue([]);
    mockRepo.getArticles.mockResolvedValue([]);

    await GET(getRequest());

    expect(mockRepo.getCategories).toHaveBeenCalledOnce();
    expect(mockRepo.getVideos).toHaveBeenCalledOnce();
    expect(mockRepo.getArticles).toHaveBeenCalledOnce();
  });

  it("retorna 500 si uno de los repositorios falla", async () => {
    mockRepo.getCategories.mockResolvedValue(categorias);
    mockRepo.getVideos.mockRejectedValue(new Error("DB error"));
    mockRepo.getArticles.mockResolvedValue(articulos);

    const response = await GET(getRequest());
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
  });
});

// ─── POST /api/education (video) ─────────────────────────────────────────────

describe("POST /api/education — video", () => {
  it("crea un video con datos válidos y retorna 200", async () => {
    const { type, ...datosVideo } = payloadVideoValido;
    const videoCreado = { id: "v-nuevo", ...datosVideo };
    mockRepo.createVideo.mockResolvedValue(videoCreado);

    const response = await POST(postRequest(payloadVideoValido));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Video creado exitosamente");
    expect(body.data).toEqual(videoCreado);
  });

  it("retorna 400 cuando el título del video está vacío", async () => {
    const response = await POST(
      postRequest({ ...payloadVideoValido, titulo: "" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("El título es requerido");
  });

  it("retorna 400 cuando el autor del video está vacío", async () => {
    const response = await POST(
      postRequest({ ...payloadVideoValido, autor: "" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("El autor es requerido");
  });
});

// ─── POST /api/education (article) ───────────────────────────────────────────

describe("POST /api/education — article", () => {
  it("crea un artículo con datos válidos y retorna 200", async () => {
    const { type, ...datosArticulo } = payloadArticuloValido;
    const articuloCreado = { id: "a-nuevo", ...datosArticulo };
    mockRepo.createArticle.mockResolvedValue(articuloCreado);

    const response = await POST(postRequest(payloadArticuloValido));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Artículo creado exitosamente");
    expect(body.data).toEqual(articuloCreado);
  });

  it("retorna 400 cuando el título del artículo está vacío", async () => {
    const response = await POST(
      postRequest({ ...payloadArticuloValido, titulo: "" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("El título es requerido");
  });

  it("retorna 400 cuando el contenido del artículo está vacío", async () => {
    const response = await POST(
      postRequest({ ...payloadArticuloValido, contenido: "" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("El contenido es requerido");
  });
});

// ─── POST /api/education (tipo inválido) ─────────────────────────────────────

describe("POST /api/education — tipo inválido", () => {
  it("retorna 400 cuando no se envía type", async () => {
    const response = await POST(
      postRequest({ titulo: "Sin tipo", descripcion: "Test" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Tipo de contenido no válido");
  });

  it("retorna 400 cuando type es desconocido", async () => {
    const response = await POST(
      postRequest({ type: "podcast", titulo: "Test" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Tipo de contenido no válido");
  });
});
