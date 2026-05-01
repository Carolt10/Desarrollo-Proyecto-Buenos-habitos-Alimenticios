"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Play, FileText, Plus, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  getVideosEducativos,
  getArticulosInformativos,
  createVideoEducativo,
  createArticuloInformativo,
  getCategorias,
  type VideoEducativo,
  type ArticuloInformativo,
  type Categoria
} from "@/app/actions/content"

interface AlertsProps {
  onNavigate?: (page: string) => void
}

export default function Alerts({ onNavigate }: AlertsProps) {
  const [videos, setVideos] = useState<VideoEducativo[]>([])
  const [articulos, setArticulos] = useState<ArticuloInformativo[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showArticleModal, setShowArticleModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoEducativo | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<ArticuloInformativo | null>(null)
  const [contentType, setContentType] = useState<"video" | "articulo">("video")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [categorias, setCategorias] = useState<Categoria[]>([])

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    autor: "",
    tipo_autor: "Nutricionista" as "Nutricionista" | "Pediatra",
    duracion: "",
    youtube_url: "",
    categoria_id: "",
    contenido: "",
    tiempo_lectura: ""
  })

  useEffect(() => {
    loadContent()
    getCategorias().then((res) => {
      if (res.data) setCategorias(res.data)
    })
  }, [])

  async function loadContent() {
    setLoading(true)
    const [videosRes, articulosRes] = await Promise.all([
      getVideosEducativos(),
      getArticulosInformativos()
    ])
    
    if (videosRes.data) setVideos(videosRes.data)
    if (articulosRes.data) setArticulos(articulosRes.data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (contentType === "video") {
        await createVideoEducativo({
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          autor: formData.autor,
          tipo_autor: formData.tipo_autor,
          duracion: formData.duracion,
          youtube_url: formData.youtube_url,
          categoria_id: formData.categoria_id
        })
      } else {
        await createArticuloInformativo({
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          contenido: formData.contenido,
          tiempo_lectura: formData.tiempo_lectura,
          categoria_id: formData.categoria_id
        })
      }

      setShowAddModal(false)
      setFormData({
        titulo: "",
        descripcion: "",
        autor: "",
        tipo_autor: "Nutricionista",
        duracion: "",
        youtube_url: "",
        categoria_id: "",
        contenido: "",
        tiempo_lectura: ""
      })
      loadContent()
    } catch (error) {
      console.error("Error al guardar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function openVideo(video: VideoEducativo) {
    setSelectedVideo(video)
    setShowVideoModal(true)
  }

  function openArticle(article: ArticuloInformativo) {
    setSelectedArticle(article)
    setShowArticleModal(true)
  }

  // Solo mostramos todos los videos sin clasificar por tipo de autor

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">Alerta y Concientizacion</h1>
        <p className="text-gray-600">Informacion verificada por expertos sobre alimentacion infantil saludable</p>
      </div>

      {/* Main Alert */}
      <Card className="bg-red-50 border-l-4 border-red-600 p-6">
        <div className="flex gap-4">
          <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Alerta Importante sobre el Azucar</h3>
            <p className="text-gray-700 mb-4">
              La OMS recomienda que los ninos no consuman mas de 25g de azucar al dia. El exceso de azucar esta relacionado
              con obesidad, diabetes tipo 2 y problemas cardiovasculares desde edades tempranas.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white">Leer el estudio completo</Button>
          </div>
        </div>
      </Card>

      {/* Videos Educativos */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Play className="w-6 h-6 text-orange-600" />
          Videos Educativos
        </h3>
        <div className="grid grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition">
              <div 
                className="relative h-40 bg-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition group"
                onClick={() => openVideo(video)}
              >
                <button className="bg-orange-600 p-4 rounded-full text-white hover:bg-orange-700 group-hover:scale-110 transition">
                  <Play className="w-6 h-6" />
                </button>
                <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                  {video.duracion}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm mb-1">{video.titulo}</p>
                <p className="text-xs text-gray-600 mb-2">{video.autor}</p>
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                  {video.categoria}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Informative Articles */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-600" />
          Articulos Informativos
        </h3>
        <div className="space-y-3">
          {articulos.map((article) => (
            <Card key={article.id} className="p-4 hover:shadow-lg transition flex gap-4">
              <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-1">{article.titulo}</h4>
                <p className="text-sm text-gray-600 mb-3">{article.descripcion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{article.tiempo_lectura}</span>
                  <Button 
                    variant="link" 
                    className="text-orange-600 text-xs h-auto p-0"
                    onClick={() => openArticle(article)}
                  >
                    Leer mas
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Important Data */}
      <Card className="bg-orange-600 text-white p-8">
        <div className="flex items-center gap-4 mb-6">
          <AlertCircle className="w-10 h-10" />
          <h3 className="text-2xl font-bold">Datos Importantes</h3>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-4xl font-bold mb-2">1 de 3</p>
            <p className="text-lg">Ninos tiene sobrepeso u obesidad</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">70%</p>
            <p className="text-lg">De productos infantiles tienen exceso de azucar</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">25g</p>
            <p className="text-lg">Es el limite diario de azucar recomendado</p>
          </div>
        </div>
      </Card>

      {/* More Information CTA */}
      <Card className="bg-blue-50 border border-blue-200 p-8 text-center">
        <h3 className="text-2xl font-bold text-blue-700 mb-3">Necesitas mas informacion?</h3>
        <p className="text-gray-700 mb-6">
          Consulta nuestras guias educativas para aprender a interpretar etiquetas nutricionales
        </p>
        <Button 
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => onNavigate?.("education")}
        >
          Ver Guias Educativas
        </Button>
      </Card>

      {/* Add Content Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          className="bg-orange-600 hover:bg-orange-700 rounded-full p-4 shadow-lg"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-6 h-6 mr-2" />
          Agregar Contenido
        </Button>
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Agregar Contenido Educativo</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content Type Selector */}
              <div className="flex gap-4 mb-6">
                <button
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                    contentType === "video" 
                      ? "border-orange-600 bg-orange-50 text-orange-600" 
                      : "border-gray-200 text-gray-600"
                  }`}
                  onClick={() => setContentType("video")}
                >
                  <Play className="w-5 h-5 mx-auto mb-1" />
                  Video
                </button>
                <button
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                    contentType === "articulo" 
                      ? "border-orange-600 bg-orange-50 text-orange-600" 
                      : "border-gray-200 text-gray-600"
                  }`}
                  onClick={() => setContentType("articulo")}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1" />
                  Articulo
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titulo *</label>
                  <Input
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Titulo del contenido"
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
                    placeholder="Breve descripcion del contenido"
                  />
                </div>

                {contentType === "video" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Autor *</label>
                        <Input
                          required
                          value={formData.autor}
                          onChange={(e) => setFormData({...formData, autor: e.target.value})}
                          placeholder="Nombre del autor"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Autor *</label>
                        <select
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.tipo_autor}
                          onChange={(e) => setFormData({...formData, tipo_autor: e.target.value as "Nutricionista" | "Pediatra"})}
                        >
                          <option value="Nutricionista">Nutricionista</option>
                          <option value="Pediatra">Pediatra</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duracion *</label>
                        <Input
                          required
                          value={formData.duracion}
                          onChange={(e) => setFormData({...formData, duracion: e.target.value})}
                          placeholder="Ej: 10:45"
                        />
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL de YouTube *</label>
                      <Input
                        required
                        value={formData.youtube_url}
                        onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                        placeholder="https://www.youtube.com/embed/..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Usa el formato embed: youtube.com/embed/VIDEO_ID</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contenido del Articulo *</label>
                      <textarea
                        required
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                        rows={6}
                        value={formData.contenido}
                        onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                        placeholder="Escribe el contenido completo del articulo..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de Lectura *</label>
                        <Input
                          required
                          value={formData.tiempo_lectura}
                          onChange={(e) => setFormData({...formData, tiempo_lectura: e.target.value})}
                          placeholder="Ej: 5 min lectura"
                        />
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
                  </>
                )}

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
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{selectedVideo.titulo}</h3>
              <button onClick={() => setShowVideoModal(false)} className="text-white hover:text-gray-300">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo.youtube_url || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                title={selectedVideo.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4 text-white">
              <p className="text-sm opacity-80">{selectedVideo.autor} - {selectedVideo.tipo_autor}</p>
              <p className="mt-2">{selectedVideo.descripcion}</p>
            </div>
          </div>
        </div>
      )}

      {/* Article Modal (Blog View) */}
      {showArticleModal && selectedArticle && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-8">
            <button 
              onClick={() => setShowArticleModal(false)} 
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a Alertas
            </button>

            <article>
              <header className="mb-8">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full mb-4">
                  {selectedArticle.categoria || "Nutricion"}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedArticle.titulo}</h1>
                <p className="text-xl text-gray-600">{selectedArticle.descripcion}</p>
                <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
                  <span>{selectedArticle.tiempo_lectura}</span>
                  <span>|</span>
                  <span>Alimentacion Saludable Infantil</span>
                </div>
              </header>

              <div className="prose prose-lg max-w-none">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8">
                  <p className="text-orange-800 font-medium">
                    La alimentacion saludable es fundamental para el desarrollo integral de los ninos. 
                    Este articulo te ayudara a tomar mejores decisiones para tu familia.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduccion</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {selectedArticle.descripcion} En este articulo exploraremos en profundidad este tema 
                  y proporcionaremos consejos practicos que puedes implementar desde hoy.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Por que es importante?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La nutricion infantil tiene un impacto directo en el desarrollo cognitivo, fisico y emocional 
                  de los ninos. Una alimentacion balanceada proporciona los nutrientes necesarios para:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Desarrollo cerebral optimo</li>
                  <li>Sistema inmunologico fuerte</li>
                  <li>Crecimiento saludable</li>
                  <li>Energia para actividades diarias</li>
                  <li>Prevencion de enfermedades cronicas</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recomendaciones practicas</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Implementar cambios en la alimentacion familiar no tiene que ser dificil. Aqui hay algunas 
                  estrategias que puedes comenzar a usar hoy:
                </p>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
                  <li>Incluye frutas y verduras en cada comida</li>
                  <li>Reduce el consumo de alimentos ultraprocesados</li>
                  <li>Ofrece agua como bebida principal</li>
                  <li>Involucra a los ninos en la preparacion de comidas</li>
                  <li>Establece horarios regulares para las comidas</li>
                </ol>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Recuerda</h3>
                  <p className="text-green-700">
                    Los cambios pequenos y consistentes son mas efectivos que los cambios drasticos. 
                    Comienza con un habito nuevo y ve agregando mas con el tiempo.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusion</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La alimentacion saludable es una inversion en el futuro de tus hijos. Con informacion 
                  adecuada y pequenos cambios en la rutina diaria, puedes marcar una gran diferencia 
                  en su salud y bienestar.
                </p>
              </div>

              <footer className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Articulo verificado por profesionales de la salud. Para mas informacion, 
                  consulta con tu pediatra o nutricionista.
                </p>
              </footer>
            </article>
          </div>
        </div>
      )}
    </div>
  )
}
