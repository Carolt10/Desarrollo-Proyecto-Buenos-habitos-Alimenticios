const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://szfyqejikjyzdcnmtjkx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZnlxZWppa2p5emRjbm10amt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTI0MjUsImV4cCI6MjA5MzE4ODQyNX0.R3VbY46kciIvw5eUU3YJxsKB4GXrrgufjVy2NuvmwIE'
)

async function check() {
  const tables = ['testimonios', 'videos_educativos', 'articulos_informativos', 'recetas']
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    console.log(`${table}: ${error ? error.message : count + ' registros'}`)
  }
}

check()
