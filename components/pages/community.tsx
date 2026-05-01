import { MessageSquare, ThumbsUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const communityRecipes = [
  {
    author: "María González",
    avatar: "M",
    title: "Bowl de Azúcar-Cerenal",
    description: "Una deliciosa crema suave para toda la familia que encantará a todos los comensales",
    image: "/healthy-breakfast-bowl.png",
    likes: 124,
    comments: 24,
  },
  {
    author: "Sofía Ruiz",
    avatar: "S",
    title: "Ensaladas Nutritivas",
    description:
      "Una deliciosa y nutritiva opción para toda la familia que encantará a todos los comensales a grecja y pequeñas.",
    image: "/fresh-colorful-salad.jpg",
    likes: 89,
    comments: 15,
  },
  {
    author: "Rosa Flores",
    avatar: "R",
    title: "Ensalada de Frutas Tropicales",
    description:
      "Una deliciosa y nutritiva opción para toda la familia que encantará a todos los comensales a grecja y pequeñas.",
    image: "/tropical-fruit-salad.jpg",
    likes: 156,
    comments: 32,
  },
]

const members = [
  { name: "María González", initials: "M", recipes: "8 recetas compartidas" },
  { name: "Carlos Ruiz", initials: "C", recipes: "5 recetas compartidas" },
  { name: "Ana Pérez", initials: "A", recipes: "12 recetas compartidas" },
  { name: "Luis Martín", initials: "L", recipes: "7 recetas compartidas" },
]

const testimonials = [
  {
    author: "María G.",
    initials: "M",
    rating: 5,
    text: "Mi hijo ahora más saludable gracias a tus recetas disfrute y creativas de esta comunidad.",
  },
  {
    author: "Carlos R.",
    initials: "C",
    rating: 4.8,
    text: "Las guías educativas me ayudaron mucho en el mejoramiento. Ahora todos hablamos importancia.",
  },
  {
    author: "Ana P.",
    initials: "A",
    rating: 5,
    text: "Excelente plataforma, muy amigable. Mi hijo como más variedad y le encanta probar cosas nuevas.",
  },
  {
    author: "Luis M.",
    initials: "L",
    rating: 4.9,
    text: "Esencial para adquirir la alimentación saudable administración infantil saludable que buscaba en experiencias.",
  },
]

export default function Community() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orange-600 mb-2">Comunidad y Recetas</h1>
        <p className="text-gray-600">Comparte las recetas saludables y descubre inspiraciones de otros padres</p>
      </div>

      {/* Share Recipe Form */}
      <Card className="p-6 border-l-4 border-green-500">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          Comparte Tu Receta Saludable
        </h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Receta</label>
            <Input placeholder="Ej: Desayuno Energético Completo" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tiempo (min)</label>
              <Input type="number" placeholder="15" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Comida</label>
              <select className="w-full border border-border rounded-lg px-3 py-2">
                <option>Desayuno</option>
                <option>Almuerzo</option>
                <option>Cena</option>
                <option>Snack</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Porciones</label>
              <Input type="number" placeholder="4" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
            <select className="w-full border border-border rounded-lg px-3 py-2">
              <option value="">Seleccionar categoría...</option>
              <option>Nutricion Infantil</option>
              <option>Obesidad Infantil</option>
              <option>Habitos Saludables</option>
              <option>Lactancia</option>
              <option>Vitaminas y Nutrientes</option>
              <option>Testimonios</option>
              <option>Recetas Saludables</option>
              <option>Educacion Alimentaria</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredientes</label>
            <textarea
              placeholder="Lista los ingredientes, uno por línea"
              className="w-full border border-border rounded-lg px-3 py-2 min-h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Instrucciones de Preparación</label>
            <textarea
              placeholder="Describe los pasos para preparar la receta..."
              className="w-full border border-border rounded-lg px-3 py-2 min-h-32"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Beneficios Nutricionales (Opcional)
            </label>
            <textarea
              placeholder="Menciona los beneficios saludables de esta receta..."
              className="w-full border border-border rounded-lg px-3 py-2 min-h-20"
            />
          </div>
          <div className="flex gap-3">
            <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" /> Publicar Receta
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Cancelar
            </Button>
          </div>
        </form>
      </Card>

      {/* Filter and Sort */}
      <div className="flex gap-2 flex-wrap">
        {["Más Recientes", "Más Populares", "Mejor Valoradas"].map((filter) => (
          <Button
            key={filter}
            variant="outline"
            className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
          >
            {filter}
          </Button>
        ))}
        <Button className="ml-auto bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" /> Añadir Receta
        </Button>
      </div>

      {/* Community Recipes */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recetas de la Comunidad</h3>
        <div className="grid grid-cols-3 gap-6">
          {communityRecipes.map((recipe, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-lg transition">
              <div className="relative h-40 overflow-hidden bg-gray-200">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {recipe.avatar}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{recipe.author}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{recipe.title}</h3>
                <p className="text-xs text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                <div className="flex gap-4 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> {recipe.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {recipe.comments}
                  </div>
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-sm">Ver Receta</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Members */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Miembros Destacados</h3>
        <div className="grid grid-cols-4 gap-4">
          {members.map((member) => (
            <Card key={member.name} className="p-4 text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {member.initials}
              </div>
              <h4 className="font-bold text-gray-800">{member.name}</h4>
              <p className="text-xs text-gray-600 mb-3">{member.recipes}</p>
              <Button variant="outline" className="w-full text-orange-600 border-orange-600 text-sm bg-transparent">
                Ver perfil
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Stats */}
      <Card className="bg-orange-600 text-white p-8">
        <h3 className="text-2xl font-bold mb-8">Nuestra Comunidad Crece</h3>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold mb-2">5,240</div>
            <p className="text-lg">Miembros Activos</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">1,850</div>
            <p className="text-lg">Recetas Compartidas</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">12,500</div>
            <p className="text-lg">Interacciones Positivas</p>
          </div>
        </div>
      </Card>

      {/* Testimonials */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Experiencias de la Comunidad</h3>
        <div className="space-y-4">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="p-4 border-l-4 border-orange-500">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {testimonial.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">{testimonial.author}</span>
                    <span className="text-yellow-500">
                      {"★".repeat(Math.floor(testimonial.rating))} ({testimonial.rating})
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{testimonial.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Join CTA */}
      <Card className="bg-blue-50 border border-blue-200 p-8 text-center">
        <h3 className="text-2xl font-bold text-blue-700 mb-3">¡Únete a Nuestra Comunidad</h3>
        <p className="text-gray-700 mb-6">
          Recibe recordatorios semanales, tips de alimentación saludable y acceso a contenido exclusivo
        </p>
        <Input type="email" placeholder="tucorreo@email.com" className="max-w-md mx-auto mb-4" />
        <Button className="bg-orange-600 hover:bg-orange-700">Suscribirse</Button>
      </Card>
    </div>
  )
}
