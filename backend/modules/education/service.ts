/**
 * Education Service
 * Contains business logic for education content
 */

import { educationRepository } from "./repository";
import { ApiException } from "@backend/shared/utils/errors";

export const educationService = {
  async getCategories() {
    return educationRepository.getCategories();
  },

  async getVideos() {
    return educationRepository.getVideos();
  },

  async createVideo(data: {
    titulo: string;
    descripcion: string;
    autor: string;
    tipo_autor: "Nutricionista" | "Pediatra";
    duracion: string;
    youtube_url: string;
    categoria_id: string;
  }) {
    // Validation
    if (!data.titulo?.trim()) {
      throw new ApiException(400, "El título es requerido");
    }
    if (!data.autor?.trim()) {
      throw new ApiException(400, "El autor es requerido");
    }

    return educationRepository.createVideo(data);
  },

  async getArticles() {
    return educationRepository.getArticles();
  },

  async createArticle(data: {
    titulo: string;
    descripcion: string;
    contenido: string;
    tiempo_lectura: string;
    categoria_id: string;
  }) {
    // Validation
    if (!data.titulo?.trim()) {
      throw new ApiException(400, "El título es requerido");
    }
    if (!data.contenido?.trim()) {
      throw new ApiException(400, "El contenido es requerido");
    }

    return educationRepository.createArticle(data);
  },
};
