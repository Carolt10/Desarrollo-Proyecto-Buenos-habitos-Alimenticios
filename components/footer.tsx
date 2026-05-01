import { Mail, Phone, Clock, Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 mb-8">
        {/* About */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">Sobre Nosotros</h4>
          <p className="text-sm text-gray-600">
            Promovemos hábitos alimenticios saludables en niños mediante educación, recetas e herramientas interactivas
            para padres y familias.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Contacto</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:contacto@alimentacionsana.com" className="hover:text-orange-600">
                contacto@alimentacionsana.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Tel: +57 318 4896120</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Lunes - Viernes: 9:00 - 18:00</span>
            </div>
          </div>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Síguenos</h4>
          <div className="flex gap-4">
            <a href="#" className="bg-orange-600 p-2 rounded-full text-white hover:bg-orange-700">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="bg-orange-600 p-2 rounded-full text-white hover:bg-orange-700">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="bg-orange-600 p-2 rounded-full text-white hover:bg-orange-700">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6 text-center text-sm text-gray-600">
        <p>© 2025 Alimentación Saludable Infantil. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
