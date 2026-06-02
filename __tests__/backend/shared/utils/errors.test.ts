import { vi, describe, it, expect, beforeEach } from "vitest";
import { NextResponse } from "next/server";
import {
  ApiException,
  handleApiError,
  successResponse,
  errorResponse,
} from "@backend/shared/utils/errors";

// next/server is mocked globally in vitest.setup.ts
const mockNextResponseJson = vi.mocked(NextResponse.json);

describe("ApiException", () => {
  it("establece statusCode, message y name correctamente", () => {
    const error = new ApiException(400, "Solicitud inválida");
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Solicitud inválida");
    expect(error.name).toBe("ApiException");
  });

  it("acepta data opcional", () => {
    const data = { campo: "nombre" };
    const error = new ApiException(422, "Error de validación", data);
    expect(error.data).toBe(data);
  });

  it("data es undefined cuando no se pasa", () => {
    const error = new ApiException(500, "Error interno");
    expect(error.data).toBeUndefined();
  });

  it("es una instancia de Error", () => {
    const error = new ApiException(404, "No encontrado");
    expect(error).toBeInstanceOf(Error);
  });

  it("es una instancia de ApiException", () => {
    const error = new ApiException(404, "No encontrado");
    expect(error).toBeInstanceOf(ApiException);
  });
});

describe("handleApiError", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("maneja ApiException con statusCode y mensaje correcto", () => {
    handleApiError(new ApiException(400, "Solicitud inválida"));
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: false, error: "Solicitud inválida" },
      { status: 400 }
    );
  });

  it("maneja ApiException 404", () => {
    handleApiError(new ApiException(404, "No encontrado"));
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: false, error: "No encontrado" },
      { status: 404 }
    );
  });

  it("maneja Error genérico con status 500", () => {
    handleApiError(new Error("Falló algo"));
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: false, error: "Falló algo" },
      { status: 500 }
    );
  });

  it("maneja error desconocido con mensaje genérico", () => {
    handleApiError("error como string");
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  });

  it("maneja error null con mensaje genérico", () => {
    handleApiError(null);
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  });
});

describe("successResponse", () => {
  it("retorna status 200 con success true y datos", () => {
    const data = { id: "1", nombre: "Test" };
    successResponse(data);
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: true, data, message: undefined },
      { status: 200 }
    );
  });

  it("incluye message cuando se proporciona", () => {
    successResponse({ id: "1" }, "Creado exitosamente");
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: true, data: { id: "1" }, message: "Creado exitosamente" },
      { status: 200 }
    );
  });

  it("funciona con arrays", () => {
    const data = [{ id: "1" }, { id: "2" }];
    successResponse(data);
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: true, data, message: undefined },
      { status: 200 }
    );
  });
});

describe("errorResponse", () => {
  it("retorna el status code y mensaje de error correctos", () => {
    errorResponse(404, "Recurso no encontrado");
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: false, error: "Recurso no encontrado" },
      { status: 404 }
    );
  });

  it("maneja status 422 con mensaje de validación", () => {
    errorResponse(422, "Datos inválidos");
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: false, error: "Datos inválidos" },
      { status: 422 }
    );
  });

  it("maneja status 401 no autorizado", () => {
    errorResponse(401, "No autorizado");
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { success: false, error: "No autorizado" },
      { status: 401 }
    );
  });
});
