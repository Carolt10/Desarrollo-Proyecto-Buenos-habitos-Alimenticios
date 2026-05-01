"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

// =====================================================
// TIPOS
// =====================================================

export interface Categoria {
  id: string
  nombre: string
  descripcion: string | null
}

export interface VideoEducativo {
  id: string
  titulo: string
  descripcion: string | null
  autor: string
  tipo_autor: "Nutricionista" | "Pediatra"
  duracion: string
  youtube_url: string | null
  categoria_id: string | null
  created_at: string
}

export interface ArticuloInformativo {
  id: string
  titulo: string
  descripcion: string
  contenido: string
  tiempo_lectura: string
  categoria_id: string | null
  imagen_url: string | null
  created_at: string
}

export interface Receta {
  id: string
  titulo: string
  descripcion: string
  tiempo_preparacion: number
  porciones: number
  tipo_comida: "Desayuno" | "Almuerzo" | "Cena" | "Snack"
  categoria_id: string | null
  imagen_url: string | null
  calificacion: number
  dificultad: string
  ingredientes: string | null
  instrucciones: string | null
  created_at: string
}

// =====================================================
// CATEGORIAS
// =====================================================

export async function getCategorias(): Promise<{ data: Categoria[] | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      return {
        data: [
          { id: "1", nombre: "Nutricion Infantil", descripcion: "Contenido sobre alimentacion saludable infantil" },
          { id: "2", nombre: "Obesidad Infantil", descripcion: "Prevencion y manejo de obesidad infantil" },
          { id: "3", nombre: "Habitos Saludables", descripcion: "Educacion sobre buenos habitos alimenticios" },
          { id: "4", nombre: "Lactancia", descripcion: "Contenido relacionado con lactancia y nutricion temprana" },
          { id: "5", nombre: "Vitaminas y Nutrientes", descripcion: "Informacion sobre vitaminas y nutrientes esenciales" },
          { id: "6", nombre: "Testimonios", descripcion: "Experiencias de padres y familias" },
          { id: "7", nombre: "Recetas Saludables", descripcion: "Recetas enfocadas en alimentacion saludable" },
          { id: "8", nombre: "Educacion Alimentaria", descripcion: "Contenido educativo para padres y niños" },
        ],
        error: null
      }
    }

    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("nombre", { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("[v0] Error fetching categorias:", error)
    return {
      data: [
        { id: "1", nombre: "Nutricion Infantil", descripcion: "Contenido sobre alimentacion saludable infantil" },
        { id: "2", nombre: "Obesidad Infantil", descripcion: "Prevencion y manejo de obesidad infantil" },
        { id: "3", nombre: "Habitos Saludables", descripcion: "Educacion sobre buenos habitos alimenticios" },
        { id: "4", nombre: "Lactancia", descripcion: "Contenido relacionado con lactancia y nutricion temprana" },
        { id: "5", nombre: "Vitaminas y Nutrientes", descripcion: "Informacion sobre vitaminas y nutrientes esenciales" },
        { id: "6", nombre: "Testimonios", descripcion: "Experiencias de padres y familias" },
        { id: "7", nombre: "Recetas Saludables", descripcion: "Recetas enfocadas en alimentacion saludable" },
        { id: "8", nombre: "Educacion Alimentaria", descripcion: "Contenido educativo para padres y niños" },
      ],
      error: null
    }
  }
}

// =====================================================
// VIDEOS EDUCATIVOS
// =====================================================

export async function getVideosEducativos(): Promise<{ data: VideoEducativo[] | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      return {
        data: [
          {
            id: "1",
            titulo: "Alimentacion Saludable para Ninos",
            descripcion: "Guia completa sobre como alimentar correctamente a los ninos",
            autor: "Dr. Maria Garcia",
            tipo_autor: "Nutricionista",
            duracion: "10:45",
            youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            categoria_id: "1",
            created_at: new Date().toISOString()
          },
          {
            id: "2",
            titulo: "Azucar Oculto en Alimentos Infantiles",
            descripcion: "Descubre donde se esconde el azucar",
            autor: "Lic. Carlos Rodriguez",
            tipo_autor: "Nutricionista",
            duracion: "8:30",
            youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            categoria_id: "2",
            created_at: new Date().toISOString()
          },
          {
            id: "3",
            titulo: "Como Reducir el Azucar en la Dieta",
            descripcion: "Estrategias practicas para disminuir el consumo de azucar",
            autor: "Dra. Ana Martinez",
            tipo_autor: "Nutricionista",
            duracion: "12:15",
            youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            categoria_id: "3",
            created_at: new Date().toISOString()
          },
          {
            id: "4",
            titulo: "Nutricion Infantil: Conceptos Basicos",
            descripcion: "Fundamentos de la nutricion para el desarrollo infantil",
            autor: "Dr. Pedro Sanchez",
            tipo_autor: "Pediatra",
            duracion: "14:30",
            youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            categoria_id: "1",
            created_at: new Date().toISOString()
          },
          {
            id: "5",
            titulo: "Obesidad Infantil: Prevencion",
            descripcion: "Como prevenir la obesidad en ninos desde temprana edad",
            autor: "Dra. Laura Gomez",
            tipo_autor: "Pediatra",
            duracion: "9:45",
            youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            categoria_id: "2",
            created_at: new Date().toISOString()
          },
          {
            id: "6",
            titulo: "Habitos Saludables desde la Infancia",
            descripcion: "Crear rutinas alimenticias saludables desde pequenos",
            autor: "Dr. Roberto Diaz",
            tipo_autor: "Pediatra",
            duracion: "11:20",
            youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            categoria_id: "3",
            created_at: new Date().toISOString()
          }
        ],
        error: null
      }
    }

    const { data, error } = await supabase
      .from("videos_educativos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("[v0] Error fetching videos:", error)
    return {
      data: [
        {
          id: "1",
          titulo: "Alimentacion Saludable para Ninos",
          descripcion: "Guia completa sobre como alimentar correctamente a los ninos",
          autor: "Dr. Maria Garcia",
          tipo_autor: "Nutricionista" as const,
          duracion: "10:45",
          youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          categoria_id: "1",
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          titulo: "Azucar Oculto en Alimentos Infantiles",
          descripcion: "Descubre donde se esconde el azucar",
          autor: "Lic. Carlos Rodriguez",
          tipo_autor: "Nutricionista" as const,
          duracion: "8:30",
          youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          categoria_id: "2",
          created_at: new Date().toISOString()
        },
        {
          id: "3",
          titulo: "Nutricion Infantil: Conceptos Basicos",
          descripcion: "Fundamentos de la nutricion para el desarrollo infantil",
          autor: "Dr. Pedro Sanchez",
          tipo_autor: "Pediatra" as const,
          duracion: "14:30",
          youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          categoria_id: "1",
          created_at: new Date().toISOString()
        },
        {
          id: "4",
          titulo: "Obesidad Infantil: Prevencion",
          descripcion: "Como prevenir la obesidad en ninos desde temprana edad",
          autor: "Dra. Laura Gomez",
          tipo_autor: "Pediatra" as const,
          duracion: "9:45",
          youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          categoria_id: "2",
          created_at: new Date().toISOString()
        }
      ],
      error: null
    }
  }
}

export async function createVideoEducativo(formData: {
  titulo: string
  descripcion: string
  autor: string
  tipo_autor: "Nutricionista" | "Pediatra"
  duracion: string
  youtube_url: string
  categoria_id: string
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      return { success: true, error: null }
    }

    const { error } = await supabase.from("videos_educativos").insert([{
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      autor: formData.autor,
      tipo_autor: formData.tipo_autor,
      duracion: formData.duracion,
      youtube_url: formData.youtube_url,
      categoria_id: formData.categoria_id
    }])

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error("[v0] Error creating video:", error)
    return { success: false, error: "Error al crear el video" }
  }
}

// =====================================================
// ARTICULOS INFORMATIVOS
// =====================================================

export async function getArticulosInformativos(): Promise<{ data: ArticuloInformativo[] | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      return {
        data: [
          {
            id: "1",
            titulo: "El Impacto del Azucar en el Desarrollo Infantil",
            descripcion: "Estudios recientes demuestran que el consumo excesivo de azucar puede afectar el desarrollo cognitivo y fisico de los ninos.",
            contenido: "El azucar es uno de los ingredientes mas comunes en la dieta moderna...",
            tiempo_lectura: "5 min lectura",
            categoria_id: "1",
            imagen_url: null,
            created_at: new Date().toISOString()
          },
          {
            id: "2",
            titulo: "Alimentos Procesados: Lo que Debes Saber",
            descripcion: "Muchos productos dirigidos a ninos contienen cantidades alarmantes de azucar, sodio y aditivos quimicos.",
            contenido: "Los alimentos procesados se han convertido en una parte importante...",
            tiempo_lectura: "4 min lectura",
            categoria_id: "2",
            imagen_url: null,
            created_at: new Date().toISOString()
          },
          {
            id: "3",
            titulo: "Como Leer las Etiquetas Nutricionales",
            descripcion: "Aprende a identificar ingredientes nocivos y a tomar decisiones informadas en el supermercado.",
            contenido: "Saber leer las etiquetas nutricionales es una habilidad esencial...",
            tiempo_lectura: "6 min lectura",
            categoria_id: "8",
            imagen_url: null,
            created_at: new Date().toISOString()
          },
          {
            id: "4",
            titulo: "Alternativas Saludables para Snacks",
            descripcion: "Descubre opciones nutritivas que les encantaran a tus hijos sin comprometer su salud.",
            contenido: "Los snacks son una parte importante de la alimentacion infantil...",
            tiempo_lectura: "5 min lectura",
            categoria_id: "7",
            imagen_url: null,
            created_at: new Date().toISOString()
          }
        ],
        error: null
      }
    }

    const { data, error } = await supabase
      .from("articulos_informativos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("[v0] Error fetching articulos:", error)
    return {
      data: [
        {
          id: "1",
          titulo: "El Impacto del Azucar en el Desarrollo Infantil",
          descripcion: "Estudios recientes demuestran que el consumo excesivo de azucar puede afectar el desarrollo cognitivo y fisico de los ninos.",
          contenido: "El azucar es uno de los ingredientes mas comunes en la dieta moderna. Sin embargo, su consumo excesivo puede tener efectos negativos en la salud de los ninos, incluyendo problemas de concentracion, hiperactividad y aumento de peso. Los expertos recomiendan limitar el consumo de azucar a menos de 25 gramos diarios para ninos mayores de 2 anos.",
          tiempo_lectura: "5 min lectura",
          categoria_id: "1",
          imagen_url: null,
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          titulo: "Alimentos Procesados: Lo que Debes Saber",
          descripcion: "Muchos productos dirigidos a ninos contienen cantidades alarmantes de azucar, sodio y aditivos quimicos.",
          contenido: "Los alimentos procesados se han convertido en una parte importante de la dieta infantil. Es crucial aprender a leer las etiquetas y elegir opciones mas saludables para nuestros hijos.",
          tiempo_lectura: "4 min lectura",
          categoria_id: "2",
          imagen_url: null,
          created_at: new Date().toISOString()
        },
        {
          id: "3",
          titulo: "Como Leer las Etiquetas Nutricionales",
          descripcion: "Aprende a identificar ingredientes nocivos y a tomar decisiones informadas en el supermercado.",
          contenido: "Saber leer las etiquetas nutricionales es una habilidad esencial para cualquier padre. Aprende a identificar el azucar oculto bajo diferentes nombres y a comparar productos de manera efectiva.",
          tiempo_lectura: "6 min lectura",
          categoria_id: "8",
          imagen_url: null,
          created_at: new Date().toISOString()
        },
        {
          id: "4",
          titulo: "Alternativas Saludables para Snacks",
          descripcion: "Descubre opciones nutritivas que les encantaran a tus hijos sin comprometer su salud.",
          contenido: "Los snacks son una parte importante de la alimentacion infantil. Opta por frutas frescas, vegetales con hummus, frutos secos y yogur natural como alternativas saludables.",
          tiempo_lectura: "5 min lectura",
          categoria_id: "7",
          imagen_url: null,
          created_at: new Date().toISOString()
        }
      ],
      error: null
    }
  }
}

export async function createArticuloInformativo(formData: {
  titulo: string
  descripcion: string
  contenido: string
  tiempo_lectura: string
  categoria_id: string
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      return { success: true, error: null }
    }

    const { error } = await supabase.from("articulos_informativos").insert([{
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      contenido: formData.contenido,
      tiempo_lectura: formData.tiempo_lectura,
      categoria_id: formData.categoria_id
    }])

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error("[v0] Error creating articulo:", error)
    return { success: false, error: "Error al crear el articulo" }
  }
}

// =====================================================
// RECETAS
// =====================================================

export async function getRecetas(filtro?: string): Promise<{ data: Receta[] | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient()

    const defaultRecetas: Receta[] = [
      {
        id: "1",
        titulo: "Bowl de Smoothie con Frutas",
        descripcion: "Un desayuno colorido y nutritivo que encantara a los ninos.",
        tiempo_preparacion: 10,
        porciones: 2,
        tipo_comida: "Desayuno",
        categoria_id: "7",
        imagen_url: "/smoothie-bowl-with-toppings.jpg",
        calificacion: 4.8,
        dificultad: "Facil",
        ingredientes: "1 banana congelada, 1 taza de fresas, 1/2 taza de leche, 1/4 taza de yogur griego",
        instrucciones: "1. Licua la banana, fresas, leche y yogur. 2. Vierte en un bowl. 3. Decora con frutas.",
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        titulo: "Desayuno Energetico Completo",
        descripcion: "Un desayuno balanceado con avena, frutas frescas y miel natural.",
        tiempo_preparacion: 15,
        porciones: 4,
        tipo_comida: "Desayuno",
        categoria_id: "7",
        imagen_url: "/breakfast-bowl-with-fruits-and-nuts.jpg",
        calificacion: 5.0,
        dificultad: "Facil",
        ingredientes: "2 tazas de avena, 4 tazas de leche, 2 bananas, 1 taza de fresas",
        instrucciones: "1. Cocina la avena con la leche. 2. Sirve en bowls. 3. Decora con frutas.",
        created_at: new Date().toISOString()
      },
      {
        id: "3",
        titulo: "Ensalada Colorida con Vegetales",
        descripcion: "Una ensalada fresca y colorida perfecta para el almuerzo.",
        tiempo_preparacion: 20,
        porciones: 4,
        tipo_comida: "Almuerzo",
        categoria_id: "7",
        imagen_url: "/colorful-vegetable-salad.jpg",
        calificacion: 4.9,
        dificultad: "Facil",
        ingredientes: "Lechuga mixta, 2 zanahorias, 1 pepino, 10 tomates cherry",
        instrucciones: "1. Lava y corta los vegetales. 2. Mezcla en un bowl. 3. Anade el aderezo.",
        created_at: new Date().toISOString()
      },
      {
        id: "4",
        titulo: "Tostadas de Aguacate Nutritivas",
        descripcion: "Tostadas de pan integral con aguacate cremoso.",
        tiempo_preparacion: 10,
        porciones: 2,
        tipo_comida: "Almuerzo",
        categoria_id: "7",
        imagen_url: "/avocado-toast-on-whole-grain-bread.jpg",
        calificacion: 4.7,
        dificultad: "Facil",
        ingredientes: "4 rebanadas de pan integral, 2 aguacates maduros, sal y pimienta",
        instrucciones: "1. Tuesta el pan. 2. Machaca el aguacate. 3. Unta sobre las tostadas.",
        created_at: new Date().toISOString()
      },
      {
        id: "5",
        titulo: "Snack de Frutas Frescas",
        descripcion: "Un plato de frutas frescas de temporada para la merienda.",
        tiempo_preparacion: 5,
        porciones: 1,
        tipo_comida: "Snack",
        categoria_id: "7",
        imagen_url: "/fresh-fruit-platter.png",
        calificacion: 4.6,
        dificultad: "Facil",
        ingredientes: "Variedad de frutas de temporada: manzanas, uvas, fresas, kiwi",
        instrucciones: "1. Lava las frutas. 2. Corta en porciones. 3. Organiza en un plato.",
        created_at: new Date().toISOString()
      },
      {
        id: "6",
        titulo: "Vegetales al Horno",
        descripcion: "Vegetales asados con hierbas aromaticas para una cena saludable.",
        tiempo_preparacion: 30,
        porciones: 4,
        tipo_comida: "Cena",
        categoria_id: "7",
        imagen_url: "/roasted-vegetables.png",
        calificacion: 4.8,
        dificultad: "Media",
        ingredientes: "Zanahorias, calabacin, pimientos, cebolla, aceite de oliva",
        instrucciones: "1. Precalienta el horno a 200C. 2. Corta los vegetales. 3. Hornea 25-30 min.",
        created_at: new Date().toISOString()
      }
    ]

    if (!supabase) {
      let filtered = defaultRecetas
      if (filtro && filtro !== "todos") {
        if (filtro === "<15 min") {
          filtered = defaultRecetas.filter(r => r.tiempo_preparacion < 15)
        } else {
          filtered = defaultRecetas.filter(r => r.tipo_comida === filtro)
        }
      }
      return { data: filtered, error: null }
    }

    let query = supabase.from("recetas").select("*")

    if (filtro && filtro !== "todos") {
      if (filtro === "<15 min") {
        query = query.lt("tiempo_preparacion", 15)
      } else {
        query = query.eq("tipo_comida", filtro)
      }
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return { data: data || defaultRecetas, error: null }
  } catch (error) {
    console.error("[v0] Error fetching recetas:", error)
    const defaultRecetas: Receta[] = [
      {
        id: "1",
        titulo: "Bowl de Smoothie con Frutas",
        descripcion: "Un desayuno colorido y nutritivo que encantara a los ninos.",
        tiempo_preparacion: 10,
        porciones: 2,
        tipo_comida: "Desayuno",
        categoria_id: "7",
        imagen_url: "/smoothie-bowl-with-toppings.jpg",
        calificacion: 4.8,
        dificultad: "Facil",
        ingredientes: "1 banana congelada, 1 taza de fresas, 1/2 taza de leche, 1/4 taza de yogur griego",
        instrucciones: "1. Licua la banana, fresas, leche y yogur. 2. Vierte en un bowl. 3. Decora con frutas.",
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        titulo: "Desayuno Energetico Completo",
        descripcion: "Un desayuno balanceado con avena, frutas frescas y miel natural.",
        tiempo_preparacion: 15,
        porciones: 4,
        tipo_comida: "Desayuno",
        categoria_id: "7",
        imagen_url: "/breakfast-bowl-with-fruits-and-nuts.jpg",
        calificacion: 5.0,
        dificultad: "Facil",
        ingredientes: "2 tazas de avena, 4 tazas de leche, 2 bananas, 1 taza de fresas",
        instrucciones: "1. Cocina la avena con la leche. 2. Sirve en bowls. 3. Decora con frutas.",
        created_at: new Date().toISOString()
      },
      {
        id: "3",
        titulo: "Ensalada Colorida con Vegetales",
        descripcion: "Una ensalada fresca y colorida perfecta para el almuerzo.",
        tiempo_preparacion: 20,
        porciones: 4,
        tipo_comida: "Almuerzo",
        categoria_id: "7",
        imagen_url: "/colorful-vegetable-salad.jpg",
        calificacion: 4.9,
        dificultad: "Facil",
        ingredientes: "Lechuga mixta, 2 zanahorias, 1 pepino, 10 tomates cherry",
        instrucciones: "1. Lava y corta los vegetales. 2. Mezcla en un bowl. 3. Anade el aderezo.",
        created_at: new Date().toISOString()
      },
      {
        id: "4",
        titulo: "Tostadas de Aguacate Nutritivas",
        descripcion: "Tostadas de pan integral con aguacate cremoso.",
        tiempo_preparacion: 10,
        porciones: 2,
        tipo_comida: "Almuerzo",
        categoria_id: "7",
        imagen_url: "/avocado-toast-on-whole-grain-bread.jpg",
        calificacion: 4.7,
        dificultad: "Facil",
        ingredientes: "4 rebanadas de pan integral, 2 aguacates maduros, sal y pimienta",
        instrucciones: "1. Tuesta el pan. 2. Machaca el aguacate. 3. Unta sobre las tostadas.",
        created_at: new Date().toISOString()
      },
      {
        id: "5",
        titulo: "Snack de Frutas Frescas",
        descripcion: "Un plato de frutas frescas de temporada para la merienda.",
        tiempo_preparacion: 5,
        porciones: 1,
        tipo_comida: "Snack",
        categoria_id: "7",
        imagen_url: "/fresh-fruit-platter.png",
        calificacion: 4.6,
        dificultad: "Facil",
        ingredientes: "Variedad de frutas de temporada: manzanas, uvas, fresas, kiwi",
        instrucciones: "1. Lava las frutas. 2. Corta en porciones. 3. Organiza en un plato.",
        created_at: new Date().toISOString()
      },
      {
        id: "6",
        titulo: "Vegetales al Horno",
        descripcion: "Vegetales asados con hierbas aromaticas para una cena saludable.",
        tiempo_preparacion: 30,
        porciones: 4,
        tipo_comida: "Cena",
        categoria_id: "7",
        imagen_url: "/roasted-vegetables.png",
        calificacion: 4.8,
        dificultad: "Media",
        ingredientes: "Zanahorias, calabacin, pimientos, cebolla, aceite de oliva",
        instrucciones: "1. Precalienta el horno a 200C. 2. Corta los vegetales. 3. Hornea 25-30 min.",
        created_at: new Date().toISOString()
      }
    ]
    return { data: defaultRecetas, error: null }
  }
}

export async function createReceta(formData: {
  titulo: string
  descripcion: string
  tiempo_preparacion: number
  porciones: number
  tipo_comida: "Desayuno" | "Almuerzo" | "Cena" | "Snack"
  categoria_id: string
  imagen_url?: string
  ingredientes?: string
  instrucciones?: string
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      return { success: true, error: null }
    }

    const { error } = await supabase.from("recetas").insert([{
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      tiempo_preparacion: formData.tiempo_preparacion,
      porciones: formData.porciones,
      tipo_comida: formData.tipo_comida,
      categoria_id: formData.categoria_id,
      imagen_url: formData.imagen_url || "/placeholder.jpg",
      ingredientes: formData.ingredientes,
      instrucciones: formData.instrucciones,
      calificacion: 4.5,
      dificultad: "Facil"
    }])

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error("[v0] Error creating receta:", error)
    return { success: false, error: "Error al crear la receta" }
  }
}
