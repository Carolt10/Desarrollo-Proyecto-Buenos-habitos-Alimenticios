-- =====================================================
-- TABLAS PARA CONTENIDO EDUCATIVO (ALERTAS Y CONCIENTIZACION)
-- =====================================================

-- Tabla para videos educativos (nutricionistas y pediatras)
CREATE TABLE IF NOT EXISTS videos_educativos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  autor VARCHAR(100) NOT NULL,
  tipo_autor VARCHAR(50) NOT NULL CHECK (tipo_autor IN ('Nutricionista', 'Pediatra')),
  duracion VARCHAR(10) NOT NULL,
  youtube_url VARCHAR(500),
  categoria VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para articulos informativos
CREATE TABLE IF NOT EXISTS articulos_informativos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  contenido TEXT NOT NULL,
  tiempo_lectura VARCHAR(20) NOT NULL,
  categoria VARCHAR(50),
  imagen_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA PARA RECETAS
-- =====================================================

CREATE TABLE IF NOT EXISTS recetas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  tiempo_preparacion INTEGER NOT NULL, -- en minutos
  porciones INTEGER NOT NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('Desayuno', 'Almuerzo', 'Cena', 'Snack')),
  imagen_url VARCHAR(500),
  calificacion DECIMAL(2,1) DEFAULT 4.5,
  dificultad VARCHAR(20) DEFAULT 'Facil',
  ingredientes TEXT,
  instrucciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE videos_educativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE articulos_informativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;

-- Politicas para videos_educativos
CREATE POLICY "Cualquiera puede ver videos" ON videos_educativos
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede crear videos" ON videos_educativos
  FOR INSERT WITH CHECK (true);

-- Politicas para articulos_informativos
CREATE POLICY "Cualquiera puede ver articulos" ON articulos_informativos
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede crear articulos" ON articulos_informativos
  FOR INSERT WITH CHECK (true);

-- Politicas para recetas
CREATE POLICY "Cualquiera puede ver recetas" ON recetas
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede crear recetas" ON recetas
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- DATOS INICIALES - VIDEOS EDUCATIVOS
-- =====================================================

INSERT INTO videos_educativos (titulo, descripcion, autor, tipo_autor, duracion, youtube_url, categoria) VALUES
('Alimentacion Saludable para Ninos', 'Guia completa sobre como alimentar correctamente a los ninos', 'Dr. Maria Garcia', 'Nutricionista', '10:45', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Educacion'),
('Azucar Oculto en Alimentos Infantiles', 'Descubre donde se esconde el azucar en los productos para ninos', 'Lic. Carlos Rodriguez', 'Nutricionista', '8:30', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Prevencion'),
('Como Reducir el Azucar en la Dieta', 'Estrategias practicas para disminuir el consumo de azucar', 'Dra. Ana Martinez', 'Nutricionista', '12:15', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Consejos'),
('Nutricion Infantil: Conceptos Basicos', 'Fundamentos de la nutricion para el desarrollo infantil', 'Dr. Pedro Sanchez', 'Pediatra', '14:30', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Salud'),
('Obesidad Infantil: Prevencion', 'Como prevenir la obesidad en ninos desde temprana edad', 'Dra. Laura Gomez', 'Pediatra', '9:45', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Prevencion'),
('Habitos Saludables desde la Infancia', 'Crear rutinas alimenticias saludables desde pequenos', 'Dr. Roberto Diaz', 'Pediatra', '11:20', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Habitos');

-- =====================================================
-- DATOS INICIALES - ARTICULOS INFORMATIVOS
-- =====================================================

INSERT INTO articulos_informativos (titulo, descripcion, contenido, tiempo_lectura, categoria) VALUES
('El Impacto del Azucar en el Desarrollo Infantil', 
 'Estudios recientes demuestran que el consumo excesivo de azucar puede afectar el desarrollo cognitivo y fisico de los ninos.',
 'El azucar es uno de los ingredientes mas comunes en la dieta moderna, especialmente en productos dirigidos a ninos. Sin embargo, su consumo excesivo puede tener consecuencias significativas en el desarrollo infantil.

## Efectos en el Desarrollo Cognitivo

Investigaciones recientes han demostrado que el alto consumo de azucar puede afectar:
- La capacidad de concentracion
- La memoria a corto plazo
- El rendimiento academico
- El comportamiento y la regulacion emocional

## Efectos en el Desarrollo Fisico

El exceso de azucar tambien impacta el cuerpo de los ninos:
- Mayor riesgo de obesidad infantil
- Problemas dentales como caries
- Alteraciones en el metabolismo
- Mayor riesgo de diabetes tipo 2

## Recomendaciones

La Organizacion Mundial de la Salud recomienda que los ninos no consuman mas de 25 gramos de azucar al dia. Para lograr esto:
1. Lee las etiquetas nutricionales
2. Evita bebidas azucaradas
3. Ofrece frutas frescas como snacks
4. Prepara comidas caseras

Recuerda que pequenos cambios en la alimentacion pueden tener grandes impactos en la salud de tus hijos.',
 '5 min lectura', 'Nutricion'),

('Alimentos Procesados: Lo que Debes Saber', 
 'Muchos productos dirigidos a ninos contienen cantidades alarmantes de azucar, sodio y aditivos quimicos.',
 'Los alimentos procesados se han convertido en una parte importante de la dieta moderna. Sin embargo, es crucial entender que no todos los alimentos procesados son iguales y algunos pueden ser perjudiciales para la salud de los ninos.

## Que son los Alimentos Ultraprocesados?

Son productos industriales que contienen ingredientes que normalmente no usarias en tu cocina:
- Jarabes de maiz de alta fructosa
- Aceites hidrogenados
- Colorantes artificiales
- Conservadores quimicos
- Potenciadores de sabor

## Por que son Problematicos?

Estos productos suelen tener:
- Alto contenido de azucar oculto
- Exceso de sodio
- Grasas trans daninas
- Bajo valor nutricional
- Aditivos que pueden causar hiperactividad

## Como Identificarlos

Revisa las etiquetas y evita productos que:
- Tengan mas de 5 ingredientes
- Contengan nombres que no puedas pronunciar
- Listen azucar entre los primeros 3 ingredientes
- Tengan colores muy brillantes artificiales

## Alternativas Saludables

Opta por alimentos frescos y minimamente procesados como frutas, verduras, legumbres y granos enteros.',
 '4 min lectura', 'Salud'),

('Como Leer las Etiquetas Nutricionales', 
 'Aprende a identificar ingredientes nocivos y a tomar decisiones informadas en el supermercado.',
 'Saber leer las etiquetas nutricionales es una habilidad esencial para cualquier padre que quiera cuidar la alimentacion de sus hijos. Aqui te ensenamos como hacerlo de manera efectiva.

## Seccion 1: Tamano de la Porcion

Lo primero que debes revisar es el tamano de la porcion. Todos los valores nutricionales se basan en esta cantidad. Si tu hijo come el doble, debe duplicar todos los valores.

## Seccion 2: Calorias

Las calorias indican la energia que proporciona el alimento. Para ninos de 4-8 anos, se recomiendan aproximadamente 1,200-1,400 calorias diarias.

## Seccion 3: Nutrientes a Limitar

Estos nutrientes deben mantenerse bajos:
- **Grasas saturadas**: No mas del 10% de calorias diarias
- **Sodio**: Menos de 2,300 mg al dia
- **Azucares anadidos**: Menos de 25g al dia

## Seccion 4: Nutrientes a Buscar

Estos nutrientes son beneficiosos:
- **Fibra**: Ayuda a la digestion
- **Vitaminas**: Esenciales para el desarrollo
- **Minerales**: Como calcio y hierro

## Consejos Practicos

1. Compara productos similares
2. Busca opciones con menos ingredientes
3. Evita productos con azucar como primer ingrediente
4. Prefiere granos integrales sobre refinados',
 '6 min lectura', 'Educacion'),

('Alternativas Saludables para Snacks', 
 'Descubre opciones nutritivas que les encantaran a tus hijos sin comprometer su salud.',
 'Los snacks son una parte importante de la alimentacion infantil, pero elegir opciones saludables puede ser un desafio. Aqui te presentamos alternativas deliciosas y nutritivas.

## Frutas Frescas

Las frutas son el snack perfecto:
- Manzanas con mantequilla de mani
- Bananas congeladas
- Uvas (cortadas para ninos pequenos)
- Fresas con yogur natural

## Vegetales Crujientes

Los vegetales tambien pueden ser divertidos:
- Palitos de zanahoria con hummus
- Pepinos con limon
- Tomates cherry
- Apio con queso crema

## Opciones con Proteina

Para snacks mas sustanciosos:
- Huevos duros
- Queso en cubos
- Edamames
- Nueces y semillas (para mayores de 4 anos)

## Snacks Caseros

Preparar en casa es siempre mejor:
- Palomitas de maiz naturales
- Galletas de avena caseras
- Barritas de granola sin azucar anadida
- Smoothies de frutas naturales

## Tips para el Exito

1. Involucra a los ninos en la preparacion
2. Presenta los alimentos de forma divertida
3. Ofrece opciones, no imposiciones
4. Se paciente con nuevos sabores',
 '5 min lectura', 'Recetas');

-- =====================================================
-- DATOS INICIALES - RECETAS
-- =====================================================

INSERT INTO recetas (titulo, descripcion, tiempo_preparacion, porciones, categoria, imagen_url, calificacion, dificultad, ingredientes, instrucciones) VALUES
('Bowl de Smoothie con Frutas', 
 'Un desayuno colorido y nutritivo que encantara a los ninos. Lleno de vitaminas y antioxidantes.',
 10, 2, 'Desayuno', '/smoothie-bowl-with-toppings.jpg', 4.8, 'Facil',
 '1 banana congelada, 1 taza de fresas, 1/2 taza de leche, 1/4 taza de yogur griego, Toppings: granola, frutas frescas, semillas de chia',
 '1. Licua la banana, fresas, leche y yogur hasta obtener una consistencia espesa. 2. Vierte en un bowl. 3. Decora con granola, frutas frescas y semillas. 4. Sirve inmediatamente.'),

('Desayuno Energetico Completo', 
 'Un desayuno balanceado con avena, frutas frescas, frutos secos y miel natural. Rico en fibra y proteinas.',
 15, 4, 'Desayuno', '/breakfast-bowl-with-fruits-and-nuts.jpg', 5.0, 'Facil',
 '2 tazas de avena, 4 tazas de leche, 2 bananas, 1 taza de fresas, 1/4 taza de nueces, 2 cucharadas de miel, Canela al gusto',
 '1. Cocina la avena con la leche a fuego medio. 2. Anade la canela mientras se cocina. 3. Sirve en bowls y decora con frutas picadas. 4. Anade las nueces y un chorrito de miel.'),

('Ensalada Colorida con Vegetales', 
 'Una ensalada fresca y colorida perfecta para el almuerzo. Rica en vitaminas y minerales esenciales.',
 20, 4, 'Almuerzo', '/colorful-vegetable-salad.jpg', 4.9, 'Facil',
 'Lechuga mixta, 2 zanahorias ralladas, 1 pepino, 10 tomates cherry, 1/2 taza de maiz, Aderezo de limon y aceite de oliva',
 '1. Lava y corta todos los vegetales. 2. Mezcla en un bowl grande. 3. Prepara el aderezo con limon, aceite y sal. 4. Anade el aderezo justo antes de servir.'),

('Tostadas de Aguacate Nutritivas', 
 'Tostadas de pan integral con aguacate cremoso, perfectas para un almuerzo rapido y saludable.',
 10, 2, 'Almuerzo', '/avocado-toast-on-whole-grain-bread.jpg', 4.7, 'Facil',
 '4 rebanadas de pan integral, 2 aguacates maduros, Sal y pimienta, Jugo de limon, Tomates cherry para decorar',
 '1. Tuesta el pan integral. 2. Machaca el aguacate con limon, sal y pimienta. 3. Unta el aguacate sobre las tostadas. 4. Decora con tomates cherry cortados.'),

('Snack de Frutas Frescas', 
 'Un plato de frutas frescas de temporada, perfecto para la merienda de los ninos.',
 5, 1, 'Snack', '/fresh-fruit-platter.png', 4.6, 'Facil',
 'Variedad de frutas de temporada: manzanas, uvas, fresas, kiwi, mango',
 '1. Lava todas las frutas. 2. Corta en porciones adecuadas para ninos. 3. Organiza de forma atractiva en un plato. 4. Sirve con yogur natural para dipping.'),

('Vegetales al Horno', 
 'Vegetales asados con hierbas aromaticas, una cena saludable que toda la familia disfrutara.',
 30, 4, 'Cena', '/roasted-vegetables.png', 4.8, 'Media',
 'Zanahorias, calabacin, pimientos, cebolla, aceite de oliva, hierbas provenzales, sal',
 '1. Precalienta el horno a 200C. 2. Corta los vegetales en trozos. 3. Mezcla con aceite y hierbas. 4. Hornea por 25-30 minutos hasta que esten dorados.');
