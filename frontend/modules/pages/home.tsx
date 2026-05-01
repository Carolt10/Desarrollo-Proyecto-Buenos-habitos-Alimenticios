"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Heart, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TestimonialCard } from "@/components/testimonial-card"
import { ShareStoryModal } from "@/components/share-story-modal"
import { getTestimonials } from "@/app/actions/testimonials"

interface Testimonial {
  name: string
  role: string
  avatar: string
  quote: string
  rating: number
  achievement: string
}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      name: "María González",
      role: "Madre de Sofía (7 años)",
      avatar: "M",
      quote:
        "Mi hija dejó de rechazar las verduras. Ahora pide ensaladas y ha ganado más energía para jugar. El cambio fue increíble.",
      rating: 5,
      achievement: "De rechazar verduras a comer 3 porciones diarias",
    },
    {
      name: "Carlos López",
      role: "Padre de Juan (9 años)",
      avatar: "C",
      quote:
        "Los hábitos saludables transformaron la salud de Juan. Bajó de peso, mejoró en la escuela y duerme mejor.",
      rating: 5,
      achievement: "Pérdida de 5kg y mejor concentración escolar",
    },
    {
      name: "Ana Martínez",
      role: "Madre de Laura (6 años)",
      avatar: "A",
      quote:
        "La plataforma nos ayudó a entender qué comer. Las recetas son fáciles y a Laura le encanta cocinar conmigo.",
      rating: 5,
      achievement: "Aprendió a cocinar recetas saludables en familia",
    },
    {
      name: "Luis Torres",
      role: "Padre de Diego (8 años)",
      avatar: "L",
      quote:
        "Pasamos de comer comida rápida a preparar comidas nutritivas. Toda la familia cambió sus hábitos. Recomendado 100%.",
      rating: 5,
      achievement: "Familia completa adopta hábitos saludables",
    },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const dbTestimonials = await getTestimonials()
        if (dbTestimonials && dbTestimonials.length > 0) {
          const formattedTestimonials = dbTestimonials.map((t: any) => ({
            name: t.name,
            role: t.role,
            avatar: t.name.charAt(0).toUpperCase(),
            quote: t.quote,
            rating: t.rating,
            achievement: t.achievement,
          }))
          setTestimonials([...formattedTestimonials, ...testimonials.slice(0, 4)])
        }
      } catch (error) {
        console.error("[v0] Error loading testimonials:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTestimonials()
  }, [])

  const handleAddTestimonial = (newTestimonial: Testimonial) => {
    setTestimonials([newTestimonial, ...testimonials])
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl p-12 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🍎</span>
        </div>
        <h1 className="text-4xl font-bold mb-3">Alimentación Saludable para Niños</h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Descubre cómo crear hábitos alimenticios saludables que transformarán el futuro de tus hijos
        </p>
        <div className="flex gap-4 justify-center">
          <Button className="bg-white text-orange-600 hover:bg-gray-100">
            Comenzar Ahora <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-orange-700 bg-transparent">
            Ver Vídeos
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">40%</div>
          <p className="text-sm text-gray-600">Sobrepeso infantil</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
          <p className="text-sm text-gray-600">Mejora con buenos hábitos</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">5</div>
          <p className="text-sm text-gray-600">Porciones frutas/día</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-4xl font-bold text-red-600 mb-2">15g</div>
          <p className="text-sm text-gray-600">Azúcar máx/día</p>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Good Habits */}
        <Card className="p-6 border-l-4 border-green-500">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Buenos Hábitos Alimenticios</h3>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Establecer horarios regulares de comida
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Incluir variedad de colores en cada plato
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Involucrar a los niños en la preparación
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Comer en familia sin distracciones
            </li>
          </ul>
          <Button
            variant="outline"
            className="w-full mt-4 text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent"
          >
            Leer más
          </Button>
        </Card>

        {/* Health Impact */}
        <Card className="p-6 border-l-4 border-red-500">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Repercusión en la Salud</h3>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-red-600 flex-shrink-0 mt-1">•</span>
              <span>
                <strong>Obesidad infantil:</strong> Aumenta riesgo de diabetes y problemas cardiovasculares
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 flex-shrink-0 mt-1">•</span>
              <span>
                <strong>Diabetes tipo 2:</strong> Cada vez más común en niños
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 flex-shrink-0 mt-1">•</span>
              <span>
                <strong>Problemas cardiovasculares:</strong> Presión alta desde temprana edad
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 flex-shrink-0 mt-1">•</span>
              <span>
                <strong>Desarrollo cognitivo:</strong> Mala alimentación afecta concentración
              </span>
            </li>
          </ul>
          <Button
            variant="outline"
            className="w-full mt-4 text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent"
          >
            Leer más
          </Button>
        </Card>
      </div>

      {/* Healthy Options */}
      <Card className="p-6">
        <h3 className="font-bold text-lg text-orange-600 mb-4">Opciones Saludables</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: "🍎", label: "Frutas", count: "34 opciones" },
            { icon: "🥬", label: "Verduras", count: "42 opciones" },
            { icon: "🍗", label: "Cenas", count: "28 opciones" },
            { icon: "🥜", label: "Snacks", count: "41 opciones" },
          ].map((option) => (
            <div key={option.label} className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-4xl mb-2">{option.icon}</div>
              <p className="font-semibold text-gray-800">{option.label}</p>
              <p className="text-sm text-gray-600">{option.count}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Benefits */}
      <Card className="p-6">
        <h3 className="font-bold text-lg text-green-600 mb-4">Beneficios de Alimentos Sanos</h3>
        <div className="space-y-4">
          {[
            { label: "Energía", value: 90, color: "bg-green-500" },
            { label: "Concentración", value: 85, color: "bg-blue-500" },
            { label: "Crecimiento", value: 95, color: "bg-orange-500" },
          ].map((benefit) => (
            <div key={benefit.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-800">{benefit.label}</span>
                <span className="text-gray-600">{benefit.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${benefit.color}`} style={{ width: `${benefit.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Testimonials and User Experiences Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-orange-600 mb-2">Historias de Cambio y Éxito</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conoce las experiencias reales de familias que han transformado sus hábitos alimenticios y mejorado la salud
            de sus hijos
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando historias...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6">
              {testimonials.map((testimonial, idx) => (
                <TestimonialCard key={idx} {...testimonial} />
              ))}
            </div>

            <Card className="p-8 bg-gradient-to-r from-green-50 to-orange-50 text-center border-green-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Tú también puedes lograr el cambio</h3>
              <p className="text-gray-600 mb-6">
                Únete a cientos de familias que ya están transformando la salud de sus hijos con hábitos alimenticios
                saludables
              </p>
              <Button onClick={() => setShowModal(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                Comparte tu Historia <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </>
        )}
      </div>

      <ShareStoryModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddTestimonial} />

      {/* CTA Section */}
      <div className="bg-orange-50 rounded-xl p-12 text-center border border-orange-200">
        <h3 className="text-2xl font-bold text-orange-600 mb-3">¿Listo para comenzar el cambio?</h3>
        <p className="text-gray-600 mb-6">
          Explora nuestros módulos de recetas saludables, guías educativas y actividades interactivas para niños
        </p>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
          Explorar Módulos <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
