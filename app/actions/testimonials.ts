"use server"

import { createClient } from "@/lib/supabase/server"

export interface TestimonialData {
  name: string
  role: string
  quote: string
  rating: number
  achievement: string
  categoria_id: string
}

const testimonialMemoryStore: (TestimonialData & { id: string; created_at: string })[] = []

export async function createTestimonial(data: TestimonialData) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      console.log("[v0] Guardando testimonio en memoria")
      const newTestimonial = {
        id: Math.random().toString(36).substring(7),
        ...data,
        created_at: new Date().toISOString(),
      }
      testimonialMemoryStore.unshift(newTestimonial)
      return newTestimonial
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: testimonial, error } = await supabase
      .from("testimonios")
      .insert({
        name: data.name,
        role: data.role,
        quote: data.quote,
        rating: data.rating,
        achievement: data.achievement,
        categoria_id: data.categoria_id,
        user_id: user?.id || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating testimonial:", error)
      throw new Error(error.message)
    }

    return testimonial
  } catch (error) {
    console.error("[v0] Error en createTestimonial:", error)
    const newTestimonial = {
      id: Math.random().toString(36).substring(7),
      ...data,
      created_at: new Date().toISOString(),
    }
    testimonialMemoryStore.unshift(newTestimonial)
    return newTestimonial
  }
}

export async function getTestimonials() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      console.log("[v0] Leyendo testimonios de memoria")
      return testimonialMemoryStore
    }

    const { data: testimonials, error } = await supabase
      .from("testimonios")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching testimonials:", error)
      return testimonialMemoryStore
    }

    return testimonials || []
  } catch (error) {
    console.error("[v0] Error en getTestimonials:", error)
    return testimonialMemoryStore
  }
}
