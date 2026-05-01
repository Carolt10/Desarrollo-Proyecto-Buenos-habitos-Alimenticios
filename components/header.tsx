"use client"

import { Menu, Search, Apple } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Header({
  sidebarOpen,
  onToggleSidebar,
}: {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}) {
  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo and Toggle */}
        <div className="flex items-center gap-4">
          <button onClick={onToggleSidebar} className="p-2 hover:bg-orange-100 rounded-lg transition">
            <Menu className="w-5 h-5 text-orange-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 p-2 rounded-full">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-800">Alimentación Saludable Infantil</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Buscar" className="pl-10 bg-gray-100 border-0" />
          </div>
        </div>
      </div>
    </header>
  )
}
