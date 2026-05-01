import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"

interface TestimonialProps {
  name: string
  role: string
  avatar: string
  quote: string
  rating: number
  achievement: string
}

export function TestimonialCard({ name, role, avatar, quote, rating, achievement }: TestimonialProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-orange-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
          {avatar}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-4 italic">"{quote}"</p>
      <div className="bg-white p-3 rounded-lg border border-orange-200">
        <p className="text-sm text-orange-600 font-semibold">🎯 Logro: {achievement}</p>
      </div>
    </Card>
  )
}
