/**
 * Testimonials API Routes
 * GET: Retrieve all testimonials
 * POST: Create new testimonial
 */

import { NextRequest, NextResponse } from "next/server";
import { testimonialsService } from "@backend/modules/testimonials/service";
import { successResponse, handleApiError } from "@backend/shared/utils/errors";

export async function GET(request: NextRequest) {
  try {
    const data = await testimonialsService.getTestimonials();
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await testimonialsService.createTestimonial({
      name: body.name,
      role: body.role,
      quote: body.quote,
      rating: body.rating,
      achievement: body.achievement,
      categoria_id: body.categoria_id,
      user_id: body.user_id,
    });

    return successResponse(result, "Testimonio creado exitosamente");
  } catch (error) {
    return handleApiError(error);
  }
}
