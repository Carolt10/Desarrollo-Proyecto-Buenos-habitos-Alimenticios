/**
 * Centralized environment configuration for backend
 * All environment variables are validated and typed here
 */

export const getEnv = () => {
  const env = {
    // Supabase
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

    // Node environment
    NODE_ENV: process.env.NODE_ENV || "development",

    // App configuration
    APP_URL: process.env.APP_URL || "http://localhost:3000",
  };

  // Validate required variables
  const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];
  const missing = required.filter((key) => !env[key as keyof typeof env]);

  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return env;
};

export type Env = ReturnType<typeof getEnv>;
