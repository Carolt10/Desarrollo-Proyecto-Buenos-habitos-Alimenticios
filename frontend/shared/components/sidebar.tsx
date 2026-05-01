"use client"

import { Home, AlertCircle, Utensils, BookOpen } from "lucide-react"

const navigationItems = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "alerts", label: "Alerta y Concienzación", icon: AlertCircle },
  { id: "recipes", label: "Recetas Saludables", icon: Utensils },
  { id: "education", label: "Guías de Educación", icon: BookOpen },
  // Secciones ocultas por solicitud del usuario
  // { id: "games", label: "Juegos", icon: Gamepad2 },
  // { id: "community", label: "Interacción Comunitaria", icon: Users },
]

const quickFilters = [
  { label: "Sin azúcar añadida", value: "no-sugar" },
  { label: "Vegetariano", value: "vegetarian" },
  { label: "Rápido (< 15 min)", value: "quick" },
]

export default function Sidebar({
  currentPage,
  onPageChange,
}: {
  currentPage: string
  onPageChange: (page: string) => void
}) {
  return (
    <aside className="w-32 bg-gray-50 border-r border-border h-screen overflow-y-auto flex flex-col">
      {/* Navigation */}
      <nav className="p-3 space-y-2 flex-1">
        <h3 className="text-xs font-bold text-gray-600 px-3 py-2 uppercase">Navegación</h3>
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                currentPage === item.id ? "bg-orange-600 text-white" : "text-gray-700 hover:bg-orange-100"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Quick Filters - Oculto por solicitud del usuario */}
      {/* 
      <div className="p-3 border-t border-border">
        <h3 className="text-xs font-bold text-gray-600 px-3 py-2 uppercase">Filtros Rapidos</h3>
        <div className="space-y-2">
          {quickFilters.map((filter) => (
            <label
              key={filter.value}
              className="flex items-center gap-2 px-3 py-2 text-xs cursor-pointer hover:bg-orange-100 rounded"
            >
              <input type="checkbox" className="w-3 h-3 rounded" />
              <span className="text-gray-700">{filter.label}</span>
            </label>
          ))}
        </div>
      </div>
      */}
    </aside>
  )
}
