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

import { educationService } from "@backend/modules/education/service";
import { educationRepository } from "@backend/modules/education/repository";
import { ApiException } from "@backend/shared/utils/errors";

const mockRepo = vi.mocked(educationRepository);

const datosVideoValidos = {
  titulo: "Nutrición para bebés",
  descripcion: "Guía completa de alimentación en los primeros años",
  autor: "Dra. López",
  tipo_autor: "Nutricionista" as const,
  duracion: "12:30",
  youtube_url: "https://youtube.com/watch?v=ejemplo123",
  categoria_id: "cat-nutricion",
};

const datosArticuloValidos = {
  titulo: "Alimentación saludable en la infancia",
  descripcion: "Cómo crear hábitos alimenticios positivos",
  contenido: "El contenido completo del artículo sobre nutrición infantil...",
  tiempo_lectura: "8 min",
  categoria_id: "cat-habitos",
};

describe("educationService.getCategories", () => {
  it("delega al repositorio y retorna categorías", async () => {
    const categorias = [
      { id: "cat-1", name: "Nutrición" },
      { id: "cat-2", name: "Hábitos" },
    ];
    mockRepo.getCategories.mockResolvedValue(categorias);

    const resultado = await educationService.getCategories();

    expect(mockRepo.getCategories).toHaveBeenCalledOnce();
    expect(resultado).toBe(categorias);
  });

  it("retorna array vacío cuando no hay categorías", async () => {
    mockRepo.getCategories.mockResolvedValue([]);

    const resultado = await educationService.getCategories();

    expect(resultado).toEqual([]);
  });
});

describe("educationService.getVideos", () => {
  it("delega al repositorio y retorna videos", async () => {
    const videos = [{ id: "v-1", titulo: "Video 1" }];
    mockRepo.getVideos.mockResolvedValue(videos);

    const resultado = await educationService.getVideos();

    expect(mockRepo.getVideos).toHaveBeenCalledOnce();
    expect(resultado).toBe(videos);
  });

  it("retorna array vacío cuando no hay videos", async () => {
    mockRepo.getVideos.mockResolvedValue([]);

    const resultado = await educationService.getVideos();

    expect(resultado).toEqual([]);
  });
});

describe("educationService.createVideo", () => {
  it("lanza ApiException 400 cuando el título está vacío", async () => {
    await expect(
      educationService.createVideo({ ...datosVideoValidos, titulo: "" })
    ).rejects.toThrow(new ApiException(400, "El título es requerido"));
  });

  it("lanza ApiException 400 cuando el título es solo espacios", async () => {
    await expect(
      educationService.createVideo({ ...datosVideoValidos, titulo: "   " })
    ).rejects.toThrow(ApiException);
  });

  it("lanza ApiException 400 cuando el autor está vacío", async () => {
    await expect(
      educationService.createVideo({ ...datosVideoValidos, autor: "" })
    ).rejects.toThrow(new ApiException(400, "El autor es requerido"));
  });

  it("lanza ApiException 400 cuando el autor es solo espacios", async () => {
    await expect(
      educationService.createVideo({ ...datosVideoValidos, autor: "   " })
    ).rejects.toThrow(ApiException);
  });

  it("llama al repositorio con datos válidos", async () => {
    const videoCreado = { id: "v-001", ...datosVideoValidos };
    mockRepo.createVideo.mockResolvedValue(videoCreado);

    const resultado = await educationService.createVideo(datosVideoValidos);

    expect(mockRepo.createVideo).toHaveBeenCalledWith(datosVideoValidos);
    expect(resultado).toBe(videoCreado);
  });

  it("acepta tipo_autor Pediatra", async () => {
    const datosConPediatra = {
      ...datosVideoValidos,
      tipo_autor: "Pediatra" as const,
    };
    mockRepo.createVideo.mockResolvedValue({ id: "v-002", ...datosConPediatra });

    await educationService.createVideo(datosConPediatra);

    expect(mockRepo.createVideo).toHaveBeenCalledWith(datosConPediatra);
  });
});

describe("educationService.getArticles", () => {
  it("delega al repositorio y retorna artículos", async () => {
    const articulos = [{ id: "a-1", titulo: "Artículo 1" }];
    mockRepo.getArticles.mockResolvedValue(articulos);

    const resultado = await educationService.getArticles();

    expect(mockRepo.getArticles).toHaveBeenCalledOnce();
    expect(resultado).toBe(articulos);
  });

  it("retorna array vacío cuando no hay artículos", async () => {
    mockRepo.getArticles.mockResolvedValue([]);

    const resultado = await educationService.getArticles();

    expect(resultado).toEqual([]);
  });
});

describe("educationService.createArticle", () => {
  it("lanza ApiException 400 cuando el título está vacío", async () => {
    await expect(
      educationService.createArticle({ ...datosArticuloValidos, titulo: "" })
    ).rejects.toThrow(new ApiException(400, "El título es requerido"));
  });

  it("lanza ApiException 400 cuando el título es solo espacios", async () => {
    await expect(
      educationService.createArticle({ ...datosArticuloValidos, titulo: "   " })
    ).rejects.toThrow(ApiException);
  });

  it("lanza ApiException 400 cuando el contenido está vacío", async () => {
    await expect(
      educationService.createArticle({ ...datosArticuloValidos, contenido: "" })
    ).rejects.toThrow(new ApiException(400, "El contenido es requerido"));
  });

  it("lanza ApiException 400 cuando el contenido es solo espacios", async () => {
    await expect(
      educationService.createArticle({
        ...datosArticuloValidos,
        contenido: "   ",
      })
    ).rejects.toThrow(ApiException);
  });

  it("llama al repositorio con datos válidos", async () => {
    const articuloCreado = { id: "a-001", ...datosArticuloValidos };
    mockRepo.createArticle.mockResolvedValue(articuloCreado);

    const resultado =
      await educationService.createArticle(datosArticuloValidos);

    expect(mockRepo.createArticle).toHaveBeenCalledWith(datosArticuloValidos);
    expect(resultado).toBe(articuloCreado);
  });
});
