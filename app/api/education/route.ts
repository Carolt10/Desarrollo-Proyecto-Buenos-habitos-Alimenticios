/**
 * Education API Routes
 * GET: Retrieve all education content (categories, videos, articles)
 * POST: Create new education content
 */

import { NextRequest, NextResponse } from "next/server";
import { educationService } from "@backend/modules/education/service";
import { successResponse, handleApiError } from "@backend/shared/utils/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "categories") {
      const data = await educationService.getCategories();
      return successResponse(data);
    }

    if (type === "videos") {
      const data = await educationService.getVideos();
      return successResponse(data);
    }

    if (type === "articles") {
      const data = await educationService.getArticles();
      return successResponse(data);
    }

    // Return all if no type specified
    const [categories, videos, articles] = await Promise.all([
      educationService.getCategories(),
      educationService.getVideos(),
      educationService.getArticles(),
    ]);

    return successResponse({ categories, videos, articles });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === "video") {
      const result = await educationService.createVideo(data);
      return successResponse(result, "Video creado exitosamente");
    }

    if (type === "article") {
      const result = await educationService.createArticle(data);
      return successResponse(result, "Artículo creado exitosamente");
    }

    return NextResponse.json(
      { success: false, error: "Tipo de contenido no válido" },
      { status: 400 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
