"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Heart, Clock, Users, Plus, X, ArrowLeft, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getRecetas, createReceta, getCategorias, type Receta, type Categoria } from "@/app/actions/content"

export default function Recipes() {
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRecipeDetail, setShowRecipeDetail] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Receta | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [categorias, setCategorias] = useState<Categoria[]>([])

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tiempo_preparacion: 15,
    porciones: 4,
    tipo_comida: "Desayuno" as "Desayuno" | "Almuerzo" | "Cena" | "Snack",
    categoria_id: "",
    imagen_url: "",
    ingredientes: "",
    instrucciones: ""
  })

  const filters = ["Desayuno", "Almuerzo", "Cena", "Snack", "<15 min"]

  useEffect(() => {
    loadRecetas()
    getCategorias().then((res) => {
      if (res.data) setCategorias(res.data)
    })
  }, [activeFilter])

  async function loadRecetas() {
    setLoading(true)
    const filtro = activeFilter === "todos" ? undefined : 
                   activeFilter === "Cena" ? "Cena" :
                   activeFilter === "Snack" ? "Snack" :
                   activeFilter
    const { data } = await getRecetas(filtro)
    if (data) {
      setRecetas(data)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createReceta({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tiempo_preparacion: formData.tiempo_preparacion,
        porciones: formData.porciones,
        tipo_comida: formData.tipo_comida,
        categoria_id: formData.categoria_id,
        imagen_url: formData.imagen_url || "/placeholder.jpg",
        ingredientes: formData.ingredientes,
        instrucciones: formData.instrucciones
      })

      setShowAddModal(false)
      setFormData({
        titulo: "",
        descripcion: "",
        tiempo_preparacion: 15,
        porciones: 4,
        tipo_comida: "Desayuno",
        categoria_id: "",
        imagen_url: "",
        ingredientes: "",
        instrucciones: ""
      })
      loadRecetas()
    } catch (error) {
      console.error("Error al guardar receta:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleFilterClick(filter: string) {
    if (activeFilter === filter) {
      setActiveFilter("todos")
    } else {
      setActiveFilter(filter)
    }
  }

  function openRecipeDetail(recipe: Receta) {
    setSelectedRecipe(recipe)
    setShowRecipeDetail(true)
  }

  const filteredRecetas = recetas.filter(r => 
    r.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const featuredRecipe = recetas.find(r => r.calificacion >= 4.9) || recetas[0]

  const categoryCounts = {
    Desayuno: recetas.filter(r => r.tipo_comida === "Desayuno").length || 24,
    Almuerzo: recetas.filter(r => r.tipo_comida === "Almuerzo").length || 32,
    Cena: recetas.filter(r => r.tipo_comida === "Cena").length || 28,
    Snack: recetas.filter(r => r.tipo_comida === "Snack").length || 41
  }

  if (loading && recetas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-orange-600 mb-2">Recetas Saludables y Rapidas</h1>
          <p className="text-gray-600">
            Opciones nutritivas que optimizan tu tiempo y priorizan la alimentacion infantil
          </p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Anadir Receta
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Buscar recetas..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" className="border-orange-600 text-orange-600 bg-transparent">
            <Filter className="w-4 h-4 mr-2" /> Filtros
          </Button>
        </div>

        {/* Recipe Filter Tags */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === filter
                  ? "bg-orange-600 text-white"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
              }`}
            >
              {filter}
            </button>
          ))}
          {activeFilter !== "todos" && (
            <button
              onClick={() => setActiveFilter("todos")}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </Card>

      {/* Featured Recipe */}
      {featuredRecipe && activeFilter === "todos" && (
        <Card className="p-6 border-l-4 border-orange-600">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <img 
                src={featuredRecipe.imagen_url || "/featured-healthy-breakfast.jpg"} 
                alt={featuredRecipe.titulo} 
                className="w-full h-64 object-cover rounded-lg" 
              />
              <div className="mt-4 bg-orange-100 text-orange-600 inline-block px-3 py-1 rounded-full text-sm font-semibold">
                Receta Destacada
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{featuredRecipe.titulo}</h2>
              <p className="text-gray-600 mb-4">{featuredRecipe.descripcion}</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>{featuredRecipe.tiempo_preparacion} min</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>{featuredRecipe.porciones} personas</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Heart className="w-4 h-4 text-orange-600" />
                  <span className="text-yellow-500">
                    {"★".repeat(Math.floor(featuredRecipe.calificacion))} ({featuredRecipe.calificacion})
                  </span>
                </div>
              </div>
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => openRecipeDetail(featuredRecipe)}
              >
                Ver receta completa
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Category Cards */}
      {activeFilter === "todos" && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { emoji: "🍳", label: "Desayunos", count: `${categoryCounts.Desayuno} recetas`, filter: "Desayuno" },
            { emoji: "🥗", label: "Almuerzos", count: `${categoryCounts.Almuerzo} recetas`, filter: "Almuerzo" },
            { emoji: "🍽️", label: "Cenas", count: `${categoryCounts.Cena} recetas`, filter: "Cena" },
            { emoji: "🍎", label: "Snacks", count: `${categoryCounts.Snack} opciones`, filter: "Snack" },
          ].map((cat) => (
            <Button
              key={cat.label}
              variant="outline"
              className={`h-24 flex flex-col items-center justify-center border-orange-200 bg-transparent hover:bg-orange-50 ${
                activeFilter === cat.filter ? "bg-orange-50 border-orange-600" : ""
              }`}
              onClick={() => handleFilterClick(cat.filter)}
            >
              <span className="text-3xl mb-2">{cat.emoji}</span>
              <span className="font-semibold text-gray-800">{cat.label}</span>
              <span className="text-xs text-gray-600">{cat.count}</span>
            </Button>
          ))}
        </div>
      )}

      {/* All Recipes Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {activeFilter === "todos" ? "Todas las Recetas" : `Recetas de ${activeFilter}`}
        </h3>
        {filteredRecetas.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No se encontraron recetas con los filtros seleccionados.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredRecetas.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition">
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={recipe.imagen_url || "/placeholder.svg"}
                    alt={recipe.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-700">{recipe.calificacion}</span>
                  </div>
                   <div className="absolute top-2 left-2">
                     <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                       {recipe.tipo_comida}
                     </span>
                   </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-gray-500 font-medium">{recipe.dificultad}</span>
                  <h3 className="font-bold text-gray-800 mb-2 mt-1">{recipe.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.descripcion}</p>
                  <div className="flex gap-4 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {recipe.tiempo_preparacion} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {recipe.porciones} personas
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
                    onClick={() => openRecipeDetail(recipe)}
                  >
                    Ver receta
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cooking Tips */}
      <Card className="bg-green-50 border border-green-200 p-6">
        <h3 className="font-bold text-green-700 mb-4">Consejos para Cocinar con Ninos</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Seguridad Primero</h4>
            <p className="text-sm text-gray-600">
              Supervisa siempre a los ninos cerca de cuchillos y fuego. Asigna tareas apropiadas para su edad.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Hazlo Divertido</h4>
            <p className="text-sm text-gray-600">
              Convierte la cocina en un juego. Usa cortadores de formas y deja que decoren los platos.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Ensena Nutricion</h4>
            <p className="text-sm text-gray-600">
              Explica los beneficios de cada ingrediente mientras cocinan juntos.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Se Paciente</h4>
            <p className="text-sm text-gray-600">
              El resultado puede no ser perfecto, pero el proceso de aprendizaje es invaluable.
            </p>
          </div>
        </div>
      </Card>

      {/* Add Recipe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Anadir Nueva Receta</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titulo de la Receta *</label>
                  <Input
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ej: Bowl de Smoothie Tropical"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion *</label>
                  <textarea
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Breve descripcion de la receta..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de Preparacion (min) *</label>
                    <Input
                      required
                      type="number"
                      min="1"
                      value={formData.tiempo_preparacion}
                      onChange={(e) => setFormData({...formData, tiempo_preparacion: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Porciones *</label>
                    <Input
                      required
                      type="number"
                      min="1"
                      value={formData.porciones}
                      onChange={(e) => setFormData({...formData, porciones: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Comida *</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={formData.tipo_comida}
                      onChange={(e) => setFormData({...formData, tipo_comida: e.target.value as "Desayuno" | "Almuerzo" | "Cena" | "Snack"})}
                    >
                      <option value="Desayuno">Desayuno</option>
                      <option value="Almuerzo">Almuerzo</option>
                      <option value="Cena">Cena</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={formData.categoria_id}
                      onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
                    >
                      <option value="">Seleccionar categoría...</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                  <Input
                    value={formData.imagen_url}
                    onChange={(e) => setFormData({...formData, imagen_url: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Opcional. Deja vacio para usar imagen por defecto.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                    rows={3}
                    value={formData.ingredientes}
                    onChange={(e) => setFormData({...formData, ingredientes: e.target.value})}
                    placeholder="Lista de ingredientes separados por coma..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instrucciones</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                    rows={4}
                    value={formData.instrucciones}
                    onChange={(e) => setFormData({...formData, instrucciones: e.target.value})}
                    placeholder="Pasos para preparar la receta..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar Receta"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {showRecipeDetail && selectedRecipe && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <button 
              onClick={() => setShowRecipeDetail(false)} 
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a Recetas
            </button>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <img 
                  src={selectedRecipe.imagen_url || "/placeholder.jpg"} 
                  alt={selectedRecipe.titulo}
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="flex gap-2 mt-4">
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedRecipe.tipo_comida}
                  </span>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedRecipe.dificultad}
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedRecipe.titulo}</h1>
                <p className="text-gray-600 text-lg mb-6">{selectedRecipe.descripcion}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">{selectedRecipe.tiempo_preparacion}</p>
                    <p className="text-sm text-gray-600">minutos</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">{selectedRecipe.porciones}</p>
                    <p className="text-sm text-gray-600">porciones</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">{selectedRecipe.calificacion}</p>
                    <p className="text-sm text-gray-600">calificacion</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Ingredientes
                </h2>
                <Card className="p-6 bg-gray-50">
                  {selectedRecipe.ingredientes ? (
                    <ul className="space-y-3">
                      {selectedRecipe.ingredientes.split(",").map((ingrediente, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700">{ingrediente.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">2 tazas de ingrediente principal</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">1 taza de frutas frescas</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">1/2 taza de leche o alternativa vegetal</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">Miel o endulzante natural al gusto</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">Toppings: granola, semillas, frutos secos</span>
                      </li>
                    </ul>
                  )}
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Instrucciones
                </h2>
                <Card className="p-6 bg-gray-50">
                  {selectedRecipe.instrucciones ? (
                    <ol className="space-y-4">
                      {selectedRecipe.instrucciones.split(/\d+\./).filter(Boolean).map((paso, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{paso.trim()}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ol className="space-y-4">
                      <li className="flex gap-3">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                        <span className="text-gray-700">Prepara todos los ingredientes y lavelos bien.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                        <span className="text-gray-700">Corta las frutas en trozos pequenos.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                        <span className="text-gray-700">Mezcla los ingredientes principales en un bowl.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                        <span className="text-gray-700">Decora con los toppings de tu preferencia.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                        <span className="text-gray-700">Sirve inmediatamente y disfruta!</span>
                      </li>
                    </ol>
                  )}
                </Card>
              </div>
            </div>

            <Card className="mt-8 p-6 bg-green-50 border border-green-200">
              <h3 className="font-bold text-green-800 mb-2">Consejo Nutricional</h3>
              <p className="text-green-700">
                Esta receta es rica en vitaminas y minerales esenciales para el desarrollo infantil. 
                Puedes adaptar los ingredientes segun las preferencias de tu hijo, siempre manteniendo 
                el balance nutricional.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
