/**
 * Testimonials Repository
 * Handles all database operations for testimonials
 */

import { getSupabaseClient } from "@backend/lib/supabase/client";

export interface TestimonialData {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  achievement: string;
  categoria_id: string;
  created_at: string;
  user_id?: string;
}

const testimonialMemoryStore: TestimonialData[] = [];

export const testimonialsRepository = {
  async getTestimonials(): Promise<TestimonialData[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("testimonios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("[v0] Error fetching testimonials:", error);
      return testimonialMemoryStore;
    }
  },

  async createTestimonial(data: Omit<TestimonialData, "id" | "created_at">): Promise<TestimonialData> {
    try {
      const supabase = getSupabaseClient();

      const { data: testimonial, error } = await supabase
        .from("testimonios")
        .insert({
          name: data.name,
          role: data.role,
          quote: data.quote,
          rating: data.rating,
          achievement: data.achievement,
          categoria_id: data.categoria_id,
          user_id: data.user_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return testimonial;
    } catch (error) {
      console.error("[v0] Error creating testimonial:", error);
      // Fallback to memory store
      const newTestimonial: TestimonialData = {
        id: Math.random().toString(36).substring(7),
        ...data,
        created_at: new Date().toISOString(),
      };
      testimonialMemoryStore.unshift(newTestimonial);
      return newTestimonial;
    }
  },

  async getTestimonialById(id: string): Promise<TestimonialData | null> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("testimonios")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error("[v0] Error fetching testimonial:", error);
      return testimonialMemoryStore.find((t) => t.id === id) || null;
    }
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("testimonios").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("[v0] Error deleting testimonial:", error);
      const index = testimonialMemoryStore.findIndex((t) => t.id === id);
      if (index > -1) {
        testimonialMemoryStore.splice(index, 1);
        return true;
      }
      return false;
    }
  },
};
