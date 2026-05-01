import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn("[v0] Las variables de Supabase no están configuradas. Los testimonios se guardarán en memoria.")
    return null
  }

  return createBrowserClient(url, key)
}
