import { describe, it, expect } from "vitest";
import {
  validateRequired,
  validateEmail,
  validateMinLength,
  validateMaxLength,
  validateArrayNotEmpty,
  collectErrors,
} from "@backend/shared/utils/validators";

describe("validateRequired", () => {
  it("retorna error cuando el valor es null", () => {
    expect(validateRequired(null, "Nombre")).toBe("Nombre is required");
  });

  it("retorna error cuando el valor es undefined", () => {
    expect(validateRequired(undefined, "Email")).toBe("Email is required");
  });

  it("retorna error cuando el valor es string vacío", () => {
    expect(validateRequired("", "Campo")).toBe("Campo is required");
  });

  it("retorna error cuando el valor es solo espacios", () => {
    expect(validateRequired("   ", "Campo")).toBe("Campo is required");
  });

  it("retorna null para string válido", () => {
    expect(validateRequired("hola", "Campo")).toBeNull();
  });

  it("retorna null para valor numérico truthy", () => {
    expect(validateRequired(42, "Campo")).toBeNull();
  });

  it("incluye el nombre del campo en el mensaje de error", () => {
    expect(validateRequired(null, "Contraseña")).toBe("Contraseña is required");
  });

  it("retorna error para false (falsy)", () => {
    expect(validateRequired(false, "Campo")).toBe("Campo is required");
  });
});

describe("validateEmail", () => {
  it("retorna null para email válido", () => {
    expect(validateEmail("usuario@ejemplo.com")).toBeNull();
  });

  it("retorna error cuando falta el @", () => {
    expect(validateEmail("usuarioejemplo.com")).toBe("Invalid email format");
  });

  it("retorna error cuando falta el dominio", () => {
    expect(validateEmail("usuario@")).toBe("Invalid email format");
  });

  it("retorna error cuando hay espacios", () => {
    expect(validateEmail("usuario @ejemplo.com")).toBe("Invalid email format");
  });

  it("retorna error para string vacío", () => {
    expect(validateEmail("")).toBe("Invalid email format");
  });

  it("retorna null para email con subdominio", () => {
    expect(validateEmail("usuario@correo.ejemplo.com")).toBeNull();
  });

  it("retorna error cuando falta el punto en el dominio", () => {
    expect(validateEmail("usuario@dominio")).toBe("Invalid email format");
  });
});

describe("validateMinLength", () => {
  it("retorna error cuando el valor es más corto que el mínimo", () => {
    expect(validateMinLength("ab", 3, "Nombre")).toBe(
      "Nombre must be at least 3 characters"
    );
  });

  it("retorna null cuando el valor tiene exactamente el mínimo", () => {
    expect(validateMinLength("abc", 3, "Nombre")).toBeNull();
  });

  it("retorna null cuando el valor supera el mínimo", () => {
    expect(validateMinLength("abcd", 3, "Nombre")).toBeNull();
  });

  it("incluye el nombre del campo y el número en el mensaje", () => {
    expect(validateMinLength("x", 5, "Descripción")).toBe(
      "Descripción must be at least 5 characters"
    );
  });
});

describe("validateMaxLength", () => {
  it("retorna error cuando el valor supera el máximo", () => {
    expect(validateMaxLength("abcd", 3, "Nombre")).toBe(
      "Nombre must not exceed 3 characters"
    );
  });

  it("retorna null cuando el valor tiene exactamente el máximo", () => {
    expect(validateMaxLength("abc", 3, "Nombre")).toBeNull();
  });

  it("retorna null cuando el valor es menor que el máximo", () => {
    expect(validateMaxLength("ab", 3, "Nombre")).toBeNull();
  });

  it("incluye el nombre del campo y el número en el mensaje", () => {
    expect(validateMaxLength("123456", 5, "Código")).toBe(
      "Código must not exceed 5 characters"
    );
  });
});

describe("validateArrayNotEmpty", () => {
  it("retorna error para array vacío", () => {
    expect(validateArrayNotEmpty([], "Ingredientes")).toBe(
      "Ingredientes must contain at least one item"
    );
  });

  it("retorna error cuando no es un array", () => {
    expect(
      validateArrayNotEmpty("no-es-array" as unknown as unknown[], "Ítems")
    ).toBe("Ítems must contain at least one item");
  });

  it("retorna null para array con elementos", () => {
    expect(validateArrayNotEmpty([1, 2, 3], "Ingredientes")).toBeNull();
  });

  it("retorna null para array con un único elemento", () => {
    expect(validateArrayNotEmpty(["uno"], "Lista")).toBeNull();
  });

  it("incluye el nombre del campo en el mensaje", () => {
    expect(validateArrayNotEmpty([], "Categorías")).toBe(
      "Categorías must contain at least one item"
    );
  });
});

describe("collectErrors", () => {
  it("filtra los valores null", () => {
    expect(collectErrors([null, "error1", null])).toEqual(["error1"]);
  });

  it("retorna array vacío cuando todos son null", () => {
    expect(collectErrors([null, null, null])).toEqual([]);
  });

  it("retorna todos los errores cuando ninguno es null", () => {
    expect(collectErrors(["error1", "error2"])).toEqual(["error1", "error2"]);
  });

  it("retorna array vacío para entrada vacía", () => {
    expect(collectErrors([])).toEqual([]);
  });

  it("preserva el orden de los errores", () => {
    expect(collectErrors(["primero", null, "tercero"])).toEqual([
      "primero",
      "tercero",
    ]);
  });
});
