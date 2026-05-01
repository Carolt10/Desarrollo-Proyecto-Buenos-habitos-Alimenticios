import { Gamepad2, Trophy, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const educationalGames = [
  {
    emoji: "🍎",
    title: "Encuentra la Fruta",
    description: "Juego de memoria con frutas",
    rating: 4.8,
  },
  {
    emoji: "🥬",
    title: "Carrera de Vegetales",
    description: "Aprende sobre verduras",
    rating: 4.6,
  },
  {
    emoji: "👨‍🍳",
    title: "Chef Junior",
    description: "Comida saludable",
    rating: 4.9,
  },
  {
    emoji: "💰",
    title: "Puzzle Nutricional",
    description: "Arma el juego perfecto",
    rating: 4.7,
  },
]

const weekChallenges = [
  {
    title: "Come 5 Frutas Diferentes",
    progress: 50,
    color: "bg-green-500",
    points: "50 +",
  },
  {
    title: "Bebe 1 Vaso de Agua",
    progress: 100,
    color: "bg-blue-500",
    points: "30 +",
  },
  {
    title: "Prueba 3 Vegetables Nuevas",
    progress: 100,
    color: "bg-orange-500",
    points: "100 +",
  },
  {
    title: "Sin Azúcar por 3 Días",
    progress: 33,
    color: "bg-purple-500",
    points: "150 +",
  },
]

const printableActivities = [
  { title: "Colorear Frutas", icon: "🎨" },
  { title: "Sopa de Letras", icon: "📝" },
  { title: "Laberinto Saludable", icon: "🧩" },
  { title: "Leer Puntos", icon: "📖" },
  { title: "Recortables", icon: "✂️" },
  { title: "Crucigramas", icon: "🔤" },
  { title: "Bingo de Frutas", icon: "🎰" },
  { title: "Dibuja Libre", icon: "✏️" },
]

export default function Games() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orange-600 mb-2">Zona de Juegos para Niños</h1>
        <p className="text-gray-600">¡Aprende sobre alimentación saludable mientras te diviertes!</p>
      </div>

      {/* Score/Points */}
      <Card className="bg-yellow-100 border border-yellow-300 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700 font-semibold">Tu Puntuación</p>
            <div className="text-5xl font-bold text-yellow-600">1,250</div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <Gamepad2 className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
              <p className="text-xs text-gray-700">11 Juegos</p>
            </div>
            <div className="text-center">
              <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
              <p className="text-xs text-gray-700">3 Logros</p>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
              <p className="text-xs text-gray-700">Top 50</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Educational Games */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Juegos Educativos</h3>
        <div className="grid grid-cols-4 gap-4">
          {educationalGames.map((game) => (
            <Card key={game.title} className="p-4 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-3">{game.emoji}</div>
              <h4 className="font-bold text-gray-800 mb-1">{game.title}</h4>
              <p className="text-xs text-gray-600 mb-3">{game.description}</p>
              <div className="flex items-center justify-center gap-1 mb-3">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-700">{game.rating}</span>
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-sm">Jugar</Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Challenges */}
      <Card className="p-6 border-t-4 border-yellow-500">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Desafíos Semanales</h3>
        <div className="grid grid-cols-2 gap-4">
          {weekChallenges.map((challenge) => (
            <Card key={challenge.title} className="p-4 bg-orange-50 border border-orange-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800 text-sm">{challenge.title}</h4>
                <span className="text-xs font-bold text-orange-600">{challenge.points}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${challenge.color}`} style={{ width: `${challenge.progress}%` }} />
              </div>
              <p className="text-xs text-gray-600 mt-2">Progreso: {challenge.progress}%</p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Fun Videos */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Videos Divertidos</h3>
        <div className="grid grid-cols-3 gap-6">
          {["Las Aventuras de las Frutas", "El Duende de los Vegetales", "Los Superhéroes del Agua"].map((video) => (
            <Card key={video} className="overflow-hidden">
              <div className="relative h-40 bg-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition">
                <button className="bg-orange-600 p-3 rounded-full text-white hover:bg-orange-700">
                  <Zap className="w-6 h-6" />
                </button>
                <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">4:25</span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-gray-800 text-sm">{video}</p>
                <p className="text-xs text-gray-600">Ver Ahora</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Printable Activities */}
      <Card className="p-6 bg-purple-50 border border-purple-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Actividades para Imprimir</h3>
        <div className="grid grid-cols-4 gap-4">
          {printableActivities.map((activity) => (
            <Card key={activity.title} className="p-4 text-center border-purple-300 hover:shadow-lg transition">
              <div className="text-4xl mb-3">{activity.icon}</div>
              <p className="font-semibold text-gray-800 text-sm mb-3">{activity.title}</p>
              <Button
                variant="outline"
                className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 text-sm bg-transparent"
              >
                Descargar
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Healthy Mascot */}
      <Card className="p-6 border-l-4 border-green-500">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Mi Mascota Saludable</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-8xl mb-3">🥕</div>
            <p className="font-bold text-gray-800 text-lg">Zanahorio</p>
            <p className="text-xs text-gray-600 mb-4">Nivel 8</p>
            <div className="flex gap-2 justify-center mb-3">
              <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-xs">Alimentar</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs">Jugar</Button>
            </div>
            <Button variant="outline" className="w-full text-xs bg-transparent">
              Personalizar
            </Button>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Estadísticas</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold">Felicidad</span>
                  <span>90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "90%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold">Salud</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold">Energía</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Mis Logros</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { emoji: "🏆", label: "Primer Juego" },
                { emoji: "⭐", label: "100 Puntos" },
                { emoji: "🎯", label: "Experto" },
                { emoji: "📚", label: "Estudioso" },
                { emoji: "🌟", label: "Campeón" },
                { emoji: "🎊", label: "Especial" },
              ].map((achievement) => (
                <div key={achievement.label} className="text-center p-2 bg-orange-50 rounded-lg">
                  <div className="text-2xl mb-1">{achievement.emoji}</div>
                  <p className="text-xs text-gray-600">{achievement.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
