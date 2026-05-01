/**
 * Education Repository
 * Handles all database operations for education content
 */

import { getSupabaseClient } from "@backend/lib/supabase/client";

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
}

export interface VideoEducativo {
  id: string;
  titulo: string;
  descripcion: string | null;
  autor: string;
  tipo_autor: "Nutricionista" | "Pediatra";
  duracion: string;
  youtube_url: string | null;
  categoria_id: string | null;
  created_at: string;
}

export interface ArticuloInformativo {
  id: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  tiempo_lectura: string;
  categoria_id: string | null;
  imagen_url: string | null;
  created_at: string;
}

export const educationRepository = {
  // ===================== CATEGORIAS =====================
  async getCategories(): Promise<Categoria[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("[v0] Error fetching categories:", error);
      // Return mock data as fallback
      return [
        {
          id: "1",
          nombre: "Nutricion Infantil",
          descripcion: "Contenido sobre alimentacion saludable infantil",
        },
        {
          id: "2",
          nombre: "Obesidad Infantil",
          descripcion: "Prevencion y manejo de obesidad infantil",
        },
        {
          id: "3",
          nombre: "Habitos Saludables",
          descripcion: "Educacion sobre buenos habitos alimenticios",
        },
        {
          id: "4",
          nombre: "Lactancia",
          descripcion: "Contenido relacionado con lactancia y nutricion temprana",
        },
        {
          id: "5",
          nombre: "Vitaminas y Nutrientes",
          descripcion: "Informacion sobre vitaminas y nutrientes esenciales",
        },
      ];
    }
  },

  // ===================== VIDEOS =====================
  async getVideos(): Promise<VideoEducativo[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("videos_educativos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("[v0] Error fetching videos:", error);
      return [];
    }
  },

  async createVideo(data: Omit<VideoEducativo, "id" | "created_at">): Promise<VideoEducativo> {
    try {
      const supabase = getSupabaseClient();
      const { data: video, error } = await supabase
        .from("videos_educativos")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return video;
    } catch (error) {
      console.error("[v0] Error creating video:", error);
      throw error;
    }
  },

  // ===================== ARTICULOS =====================
  async getArticles(): Promise<ArticuloInformativo[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("articulos_informativos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("[v0] Error fetching articles:", error);
      return [];
    }
  },

  async createArticle(
    data: Omit<ArticuloInformativo, "id" | "created_at">,
  ): Promise<ArticuloInformativo> {
    try {
      const supabase = getSupabaseClient();
      const { data: article, error } = await supabase
        .from("articulos_informativos")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return article;
    } catch (error) {
      console.error("[v0] Error creating article:", error);
      throw error;
    }
  },
};
