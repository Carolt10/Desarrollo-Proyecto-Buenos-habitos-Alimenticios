/**
 * Recipe domain types
 */

export interface RecipeData {
  id: string;
  titulo: string;
  descripcion: string;
  tiempo_preparacion: number;
  porciones: number;
  tipo_comida: "Desayuno" | "Almuerzo" | "Cena" | "Snack";
  categoria_id: string | null;
  imagen_url: string | null;
  calificacion: number;
  dificultad: string;
  ingredientes: string | null;
  instrucciones: string | null;
  created_at: string;
}
