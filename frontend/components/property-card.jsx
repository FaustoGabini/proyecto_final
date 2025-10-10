import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Home, DollarSign } from "lucide-react"

export default function PropertyCard({ property, index }) {
  const delayClass = index % 3 === 0 ? "fade-in" : index % 3 === 1 ? "fade-in-delay-1" : "fade-in-delay-2"

  // Format price with currency
  const formatPrice = (price, currency) => {
    if (!price) return "Consultar precio"
    const formattedPrice = new Intl.NumberFormat("es-AR").format(price)
    return `${currency || "ARS"} ${formattedPrice}`
  }

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${delayClass}`}>
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img
          src={
            property.image ||
            `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(property.tipo_propiedad || "propiedad")}`
          }
          alt={property.descripcion || "Propiedad"}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className="bg-primary text-primary-foreground shadow-md">{property.tipo_operacion || "Venta"}</Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-start gap-2 mb-3">
          <Home className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground capitalize">{property.tipo_propiedad || "Propiedad"}</h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {property.descripcion || "Hermosa propiedad disponible para vos"}
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">{property.ubicacion || "Ubicación a consultar"}</span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
          <span className="text-lg font-bold text-foreground">{formatPrice(property.precio, property.moneda)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
