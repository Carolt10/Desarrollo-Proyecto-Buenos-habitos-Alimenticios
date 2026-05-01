/**
 * Centralized Supabase client
 * BACKEND ONLY - Never expose to frontend
 * All database access goes through this single client
 */

import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@backend/shared/config/env";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const env = getEnv();

    supabaseClient = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY!);
  }

  return supabaseClient;
};

/**
 * Get typed Supabase client for a specific table
 */
export const getSupabaseTable = <T extends Record<string, unknown>>(tableName: string) => {
  const client = getSupabaseClient();
  return client.from(tableName).select<"*", T>("*");
};

export default getSupabaseClient;
