"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createTestimonial } from "@/app/actions/testimonials"
import { getCategorias, type Categoria } from "@/app/actions/content"

interface Testimonial {
  name: string
  role: string
  avatar: string
  quote: string
  rating: number
  achievement: string
}

interface ShareStoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (testimonial: Testimonial) => void
}

export function ShareStoryModal({ isOpen, onClose, onSubmit }: ShareStoryModalProps) {
  const [guardianName, setGuardianName] = useState("")
  const [guardianRole, setGuardianRole] = useState("madre")
  const [childName, setChildName] = useState("")
  const [rating, setRating] = useState(5)
  const [story, setStory] = useState("")
  const [achievement, setAchievement] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      getCategorias().then((res) => {
        if (res.data) setCategorias(res.data)
      })
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!guardianName.trim()) newErrors.guardianName = "El nombre del acudiente es requerido"
    if (!childName.trim()) newErrors.childName = "El nombre del niño es requerido"
    if (!story.trim()) newErrors.story = "La historia es requerida"
    if (!achievement.trim()) newErrors.achievement = "El logro es requerido"
    if (!categoriaId) newErrors.categoria = "Debes seleccionar una categoría"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      const newTestimonial: Testimonial = {
        name: guardianName,
        role: `${guardianRole} de ${childName}`,
        avatar: guardianName.charAt(0).toUpperCase(),
        quote: story,
        rating: rating,
        achievement: achievement,
      }

      await createTestimonial({
        name: guardianName,
        role: `${guardianRole} de ${childName}`,
        quote: story,
        rating: rating,
        achievement: achievement,
        categoria_id: categoriaId,
      })

      onSubmit(newTestimonial)
      setSuccess(true)

      setGuardianName("")
      setChildName("")
      setStory("")
      setAchievement("")
      setCategoriaId("")
      setRating(5)
      setErrors({})

      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("[v0] Error:", error)
      setErrors({ submit: "Error al guardar la historia. Intenta de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-orange-600">Comparte tu Historia</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-green-600">¡Gracias por compartir!</h3>
            <p className="text-gray-600">Tu historia ha sido guardada exitosamente</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Nombre del Acudiente</label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                disabled={isLoading}
              />
              {errors.guardianName && <p className="text-red-500 text-sm mt-1">{errors.guardianName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Relación</label>
                <select
                  value={guardianRole}
                  onChange={(e) => setGuardianRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  disabled={isLoading}
                >
                  <option value="madre">Madre de</option>
                  <option value="padre">Padre de</option>
                  <option value="abuelo">Abuelo de</option>
                  <option value="abuela">Abuela de</option>
                  <option value="acudiente">Acudiente de</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Nombre del Niño/a</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Nombre del niño"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  disabled={isLoading}
                />
                {errors.childName && <p className="text-red-500 text-sm mt-1">{errors.childName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Categoría</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                disabled={isLoading}
              >
                <option value="">Seleccionar categoría...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">¿Cuán útil fue tu experiencia?</label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    disabled={isLoading}
                    className="transition-transform hover:scale-110 disabled:opacity-50"
                  >
                    <Star className={`w-8 h-8 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Tu Historia</label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Cuéntanos tu experiencia. ¿Cómo ha cambiado la vida de tu hijo/a con hábitos saludables?"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none disabled:opacity-50"
                disabled={isLoading}
              />
              {errors.story && <p className="text-red-500 text-sm mt-1">{errors.story}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Logro o Resultado Alcanzado</label>
              <input
                type="text"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="Ej: Pérdida de 3kg, Mejor concentración en la escuela"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
                disabled={isLoading}
              />
              {errors.achievement && <p className="text-red-500 text-sm mt-1">{errors.achievement}</p>}
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent disabled:opacity-50"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Compartir Historia"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
