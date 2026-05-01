"use client"

import { useState } from "react"
import { BookOpen, Download, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const guides = [
  {
    id: "guia-etiquetas",
    title: "Guia Completa de Etiquetas",
    description: "17 paginas",
    size: "2.5 MB",
  },
  {
    id: "lista-compras",
    title: "Lista de Compras Saludables",
    description: "4 paginas",
    size: "1.2 MB",
  },
  {
    id: "porciones-edad",
    title: "Porciones Recomendadas por Edad",
    description: "9 paginas",
    size: "1.4 MB",
  },
  {
    id: "recetario-lunch",
    title: "Recetario de Lunch Escolares",
    description: "27 paginas",
    size: "2.3 MB",
  },
  {
    id: "calendario-frutas",
    title: "Calendario de Frutas de Temporada",
    description: "7 paginas",
    size: "800 kB",
  },
  {
    id: "infografia-nutricional",
    title: "Infografia Nutricional",
    description: "1 pagina",
    size: "500 kB",
  },
]

export default function Education() {
  const [downloading, setDownloading] = useState<string | null>(null)

  async function handleDownloadPDF(guideId: string, title: string) {
    setDownloading(guideId)
    
    try {
      // Generar un PDF dummy con contenido basico
      const pdfContent = generateDummyPDFContent(title)
      
      // Crear blob y descargar
      const blob = new Blob([pdfContent], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${guideId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al descargar:", error)
    } finally {
      setDownloading(null)
    }
  }

  function generateDummyPDFContent(title: string): string {
    // Contenido PDF basico (estructura minima de PDF)
    const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 300 >>
stream
BT
/F1 24 Tf
50 700 Td
(${title}) Tj
0 -40 Td
/F1 14 Tf
(Alimentacion Saludable Infantil) Tj
0 -30 Td
(-----------------------------------) Tj
0 -40 Td
/F1 12 Tf
(Este documento contiene informacion educativa sobre) Tj
0 -20 Td
(alimentacion saludable para ninos.) Tj
0 -40 Td
(Contenido:) Tj
0 -20 Td
(- Guias nutricionales) Tj
0 -20 Td
(- Recomendaciones de expertos) Tj
0 -20 Td
(- Consejos practicos para padres) Tj
0 -40 Td
(Para mas informacion visite nuestra plataforma.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000620 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
699
%%EOF`
    return content
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orange-600 mb-2">Guias de Educacion Nutricional</h1>
        <p className="text-gray-600">Informacion verificada por expertos sobre alimentacion infantil saludable</p>
      </div>

      {/* Reading Labels */}
      <Card className="p-6">
        <h3 className="text-2xl font-bold text-orange-600 mb-4">Como Leer Etiquetas Nutricionales</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Ejemplo de Etiqueta Nutricional</h4>
            <Card className="p-4 border-orange-300 bg-orange-50">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold">Informacion Nutricional</span>
                  <p className="text-xs text-gray-600">Porcion: 30g (1/2 taza)</p>
                  <p className="text-xs text-gray-600">Porciones por envase: 10</p>
                </div>
                <div className="border-t border-orange-200 pt-3">
                  <div className="flex justify-between">
                    <span>Calorias</span>
                    <span className="font-semibold">150</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grasa total</span>
                    <span className="font-semibold">8g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sodio</span>
                    <span className="font-semibold">450mg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbohidratos</span>
                    <span className="font-semibold">20g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>* Azucares</span>
                    <span className="font-semibold text-red-600">15g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proteinas</span>
                    <span className="font-semibold">3g</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Como Interpretarla</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Comienza por la porcion</p>
                  <p className="text-sm text-gray-600">Todos los numeros se basan en esta cantidad</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Identifica los nutrientes clave</p>
                  <p className="text-sm text-gray-600">Sodio, grasa y azucares son principales a monitorear</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Revisa el % diario recomendado</p>
                  <p className="text-sm text-gray-600">Ayuda a determinar si el nutriente es alto o bajo</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Compara productos similares</p>
                  <p className="text-sm text-gray-600">Elige opciones con menos azucar y sodio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Hidden Sugar Names */}
      <Card className="p-6 border-t-4 border-orange-600">
        <h3 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          Nombres Ocultos del Azucar
        </h3>
        <p className="text-gray-600 mb-4">
          El azucar se esconde bajo muchos nombres en las etiquetas. Aprende a identificarlos:
        </p>
        <div className="grid grid-cols-4 gap-3">
          {[
            "Jarabe de maiz",
            "Fructosa",
            "Dextrosa",
            "Maltosa",
            "Sacarosa",
            "Glucosa",
            "Mielaza",
            "Sirope",
            "Nectar de agave",
            "Miel de cana",
            "Azucar invertido",
            "Jugo de cana",
          ].map((name) => (
            <Card key={name} className="p-3 bg-red-50 border border-red-200 text-center">
              <p className="text-sm font-semibold text-red-600">{name}</p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Traffic Light System */}
      <Card className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Sistema de Semaforo Nutricional</h3>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              color: "green",
              title: "Verde - Consumo Libre",
              items: ["Frutas y verduras frescas", "Agua natural", "Legumbres", "Frutos secos sin sal"],
            },
            {
              color: "yellow",
              title: "Amarillo - Con Moderacion",
              items: ["Cereales integrales", "Lacteos bajos en grasa", "Carnes magras", "Pan integral"],
            },
            {
              color: "red",
              title: "Rojo - Limitar/Evitar",
              items: [
                "Refrescos y bebidas azucaradas",
                "Dulces y galletas",
                "Comida rapida",
                "Productos ultraprocesados",
              ],
            },
          ].map((system) => (
            <div
              key={system.title}
              className={`p-4 rounded-lg border-2 ${
                system.color === "green"
                  ? "border-green-500 bg-green-50"
                  : system.color === "yellow"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-red-500 bg-red-50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full mx-auto mb-3 ${
                  system.color === "green" ? "bg-green-500" : system.color === "yellow" ? "bg-yellow-500" : "bg-red-500"
                }`}
              />
              <h4
                className={`font-bold text-center mb-3 ${
                  system.color === "green"
                    ? "text-green-700"
                    : system.color === "yellow"
                      ? "text-yellow-700"
                      : "text-red-700"
                }`}
              >
                {system.title}
              </h4>
              <ul className="space-y-2">
                {system.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Downloadable Guides */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-orange-600" />
          Guias Descargables
        </h3>
        <div className="grid grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card key={guide.id} className="p-6 text-center hover:shadow-lg transition">
              <div className="bg-orange-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{guide.title}</h4>
              <p className="text-xs text-gray-600 mb-1">{guide.description}</p>
              <p className="text-xs text-gray-600 mb-4">{guide.size}</p>
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 text-sm"
                onClick={() => handleDownloadPDF(guide.id, guide.title)}
                disabled={downloading === guide.id}
              >
                {downloading === guide.id ? (
                  <>
                    <span className="animate-spin mr-2">...</span>
                    Descargando...
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3 mr-2" /> Descargar PDF
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Tips for Supermarket */}
      <Card className="bg-orange-600 text-white p-8">
        <h3 className="text-2xl font-bold mb-6">Consejos Rapidos para el Supermercado</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold mb-2">Compra el Perimetro</h4>
            <p className="text-sm opacity-90">
              Los alimentos frescos estan en los bordes del supermercado. El centro tiene mas productos procesados.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Lee los Primeros 3 Ingredientes</h4>
            <p className="text-sm opacity-90">
              Son los que estan en mayor cantidad en el producto. Si los primeros son azucar o quimicos, evitalo.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Menos de 5 Ingredientes</h4>
            <p className="text-sm opacity-90">
              Los mejores productos tienen listas cortas de ingredientes reconocibles.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Si no lo Pronuncias, no lo Compres</h4>
            <p className="text-sm opacity-90">
              Evita productos con ingredientes complicados y quimicos.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
