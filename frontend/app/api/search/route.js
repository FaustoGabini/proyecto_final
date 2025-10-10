import { NextResponse } from "next/server"

// Mock data for demonstration purposes
// In production, this would call your actual backend API
const mockProperties = [
  {
    id: 1,
    tipo_propiedad: "departamento",
    tipo_operacion: "venta",
    descripcion:
      "Hermoso departamento de 2 ambientes con vista al río Paraná. Amplio living comedor, cocina integrada y balcón.",
    ubicacion: "Rosario, Santa Fe",
    precio: 85000,
    moneda: "USD",
    image: "/modern-apartment-river-view.jpg",
  },
  {
    id: 2,
    tipo_propiedad: "departamento",
    tipo_operacion: "alquiler",
    descripcion: "Departamento luminoso de 3 ambientes en zona céntrica. Excelente ubicación cerca del río.",
    ubicacion: "Rosario Centro, Santa Fe",
    precio: 120000,
    moneda: "ARS",
    image: "/bright-apartment-downtown.jpg",
  },
  {
    id: 3,
    tipo_propiedad: "casa",
    tipo_operacion: "venta",
    descripcion: "Casa de 4 ambientes con patio y parrilla. Ideal para familias. Zona tranquila y segura.",
    ubicacion: "Fisherton, Rosario",
    precio: 150000,
    moneda: "USD",
    image: "/family-house-garden.png",
  },
  {
    id: 4,
    tipo_propiedad: "departamento",
    tipo_operacion: "venta",
    descripcion: "Monoambiente moderno con amenities. Gimnasio, piscina y seguridad 24hs.",
    ubicacion: "Puerto Norte, Rosario",
    precio: 65000,
    moneda: "USD",
    image: "/modern-studio-apartment.png",
  },
  {
    id: 5,
    tipo_propiedad: "departamento",
    tipo_operacion: "alquiler",
    descripcion: "Departamento de 2 ambientes con balcón y vista panorámica al río. Muy luminoso.",
    ubicacion: "Barrio Pichincha, Rosario",
    precio: 95000,
    moneda: "ARS",
    image: "/apartment-balcony-river-view.jpg",
  },
  {
    id: 6,
    tipo_propiedad: "casa",
    tipo_operacion: "venta",
    descripcion: "Casa quinta con amplio terreno, pileta y quincho. Perfecta para descanso.",
    ubicacion: "Funes, Santa Fe",
    precio: 180000,
    moneda: "USD",
    image: "/country-house-with-pool.jpg",
  },
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, you would call your actual backend API here
    // const response = await fetch(`YOUR_BACKEND_URL/api/search?q=${query}`)
    // const data = await response.json()

    // For now, return mock data
    // Filter based on query (simple implementation)
    const filteredProperties = mockProperties.filter((property) => {
      const searchText = query.toLowerCase()
      return (
        property.descripcion.toLowerCase().includes(searchText) ||
        property.ubicacion.toLowerCase().includes(searchText) ||
        property.tipo_propiedad.toLowerCase().includes(searchText) ||
        property.tipo_operacion.toLowerCase().includes(searchText)
      )
    })

    return NextResponse.json({
      properties: filteredProperties,
      total: filteredProperties.length,
      query,
    })
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
