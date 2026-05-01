/**
 * Testimonials Service
 * Contains business logic for testimonials
 */

import { testimonialsRepository } from "./repository";
import { ApiException } from "@backend/shared/utils/errors";

export const testimonialsService = {
  async getTestimonials() {
    return testimonialsRepository.getTestimonials();
  },

  async getTestimonialById(id: string) {
    return testimonialsRepository.getTestimonialById(id);
  },

  async createTestimonial(data: {
    name: string;
    role: string;
    quote: string;
    rating: number;
    achievement: string;
    categoria_id: string;
    user_id?: string;
  }) {
    // Validation
    if (!data.name?.trim()) {
      throw new ApiException(400, "El nombre es requerido");
    }
    if (!data.quote?.trim()) {
      throw new ApiException(400, "El testimonio es requerido");
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new ApiException(400, "La calificación debe estar entre 1 y 5");
    }

    return testimonialsRepository.createTestimonial(data);
  },

  async deleteTestimonial(id: string) {
    const exists = await testimonialsRepository.getTestimonialById(id);
    if (!exists) {
      throw new ApiException(404, "Testimonio no encontrado");
    }

    return testimonialsRepository.deleteTestimonial(id);
  },
};
