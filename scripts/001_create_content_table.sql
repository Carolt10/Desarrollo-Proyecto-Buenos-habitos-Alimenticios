-- =====================================================
-- EXTENSION NECESARIA PARA UUID
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- TABLA MAESTRA DE CATEGORIAS
-- =====================================================

CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE TESTIMONIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS testimonios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Relacion con tabla categorias
    categoria_id UUID NOT NULL
        REFERENCES categorias(id)
        ON DELETE RESTRICT,

    name TEXT NOT NULL,
    role TEXT NOT NULL,
    quote TEXT NOT NULL,

    rating INTEGER NOT NULL
        CHECK (rating >= 1 AND rating <= 5),

    achievement TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLAS PARA CONTENIDO EDUCATIVO
-- =====================================================

-- Videos educativos
CREATE TABLE IF NOT EXISTS videos_educativos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacion con tabla categorias
    categoria_id UUID NOT NULL
        REFERENCES categorias(id)
        ON DELETE RESTRICT,

    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,

    autor VARCHAR(100) NOT NULL,

    tipo_autor VARCHAR(50) NOT NULL
        CHECK (tipo_autor IN ('Nutricionista', 'Pediatra')),

    duracion VARCHAR(10) NOT NULL,
    youtube_url VARCHAR(500),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articulos informativos
CREATE TABLE IF NOT EXISTS articulos_informativos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacion con tabla categorias
    categoria_id UUID NOT NULL
        REFERENCES categorias(id)
        ON DELETE RESTRICT,

    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    contenido TEXT NOT NULL,
    tiempo_lectura VARCHAR(20) NOT NULL,
    imagen_url VARCHAR(500),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE RECETAS
-- =====================================================

CREATE TABLE IF NOT EXISTS recetas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacion con tabla categorias
    categoria_id UUID NOT NULL
        REFERENCES categorias(id)
        ON DELETE RESTRICT,

    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,

    tiempo_preparacion INTEGER NOT NULL, -- minutos
    porciones INTEGER NOT NULL,

    -- Categoria propia del tipo de comida
    tipo_comida VARCHAR(50) NOT NULL
        CHECK (
            tipo_comida IN (
                'Desayuno',
                'Almuerzo',
                'Cena',
                'Snack'
            )
        ),

    imagen_url VARCHAR(500),

    calificacion DECIMAL(2,1) DEFAULT 4.5,

    dificultad VARCHAR(20) DEFAULT 'Facil',

    ingredientes TEXT,
    instrucciones TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSERTAR CATEGORIAS GENERALES
-- =====================================================

INSERT INTO categorias (nombre, descripcion)
VALUES
    ('Nutricion Infantil', 'Contenido sobre alimentacion saludable infantil'),
    ('Obesidad Infantil', 'Prevencion y manejo de obesidad infantil'),
    ('Habitos Saludables', 'Educacion sobre buenos habitos alimenticios'),
    ('Lactancia', 'Contenido relacionado con lactancia y nutricion temprana'),
    ('Vitaminas y Nutrientes', 'Informacion sobre vitaminas y nutrientes esenciales'),
    ('Testimonios', 'Experiencias de padres y familias'),
    ('Recetas Saludables', 'Recetas enfocadas en alimentacion saludable'),
    ('Educacion Alimentaria', 'Contenido educativo para padres y niños')
ON CONFLICT (nombre) DO NOTHING;