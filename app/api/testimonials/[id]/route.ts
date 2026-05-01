/**
 * Testimonials Individual Item API Route
 * GET: Retrieve a specific testimonial
 * DELETE: Delete a testimonial
 */

import { NextRequest, NextResponse } from "next/server";
import { testimonialsService } from "@backend/modules/testimonials/service";
import { successResponse, handleApiError } from "@backend/shared/utils/errors";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await testimonialsService.getTestimonialById(params.id);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Testimonio no encontrado" },
        { status: 404 },
      );
    }

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await testimonialsService.deleteTestimonial(params.id);
    return successResponse(null, "Testimonio eliminado exitosamente");
  } catch (error) {
    return handleApiError(error);
  }
}
