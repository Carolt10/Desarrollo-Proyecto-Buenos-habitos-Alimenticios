/**
 * Centralized error handling for API routes
 */

import { NextResponse } from "next/server";
import { ApiError } from "../types/api";

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiException";
  }
}

export const handleApiError = (error: unknown): NextResponse<ApiError> => {
  console.error("[API Error]", error);

  if (error instanceof ApiException) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: error.statusCode },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: "An unexpected error occurred",
    },
    { status: 500 },
  );
};

export const successResponse = <T>(data: T, message?: string) => {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: 200 },
  );
};

export const errorResponse = (statusCode: number, error: string) => {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: statusCode },
  );
};
