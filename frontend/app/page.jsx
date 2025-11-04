"use client"

import Navbar from "@/components/navbar"
import SearchBar from "@/components/search-bar"
import Footer from "@/components/footer"
import { ArrowRight, MessageSquare, Brain, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export default function Home() {
  const [heroRef, heroVisible] = useScrollAnimation({ threshold: 0.1 })
  const [processRef, processVisible] = useScrollAnimation({ threshold: 0.2 })
  const [inspirationRef, inspirationVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="relative border-b" ref={heroRef}>
          <div className="absolute inset-0 bg-[url('/minimalist-modern-house-plants.jpg')] bg-cover bg-center" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

          <div className="relative container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1
                className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] ${
                  heroVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
              >
                Encontrá tu casa en Argentina
              </h1>
              <p
                className={`text-xl md:text-2xl text-white mb-12 text-pretty drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)] ${
                  heroVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0"
                }`}
              >
                Buscá propiedades usando Inteligencia Artificial
              </p>

              <div className={heroVisible ? "animate-fade-in-up animation-delay-400" : "opacity-0"}>
                <SearchBar />
              </div>
            </div>
          </div>
        </div>

        <section className="py-16 md:py-24 bg-muted/30" ref={processRef}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  className={`text-4xl md:text-5xl font-bold text-primary mb-6 ${
                    processVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                >
                  Una nueva forma de encontrar tu hogar
                </h2>
                <p
                  className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto ${
                    processVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0"
                  }`}
                >
                  Nuestro proceso de búsqueda es simple, transparente y personalizado. Está diseñado para que puedas
                  darte cuenta (sin tener que llamar a nadie) si una propiedad es buena para vos.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                <div
                  className={`text-center ${processVisible ? "animate-fade-in-up animation-delay-300" : "opacity-0"}`}
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Buscá con tus propias palabras</h3>
                  <p className="text-muted-foreground mb-4">
                    Describí la casa que buscás y InmobIA entenderá exactamente lo que necesitás. Buscá lo que se te
                    ocurra, sin límites en tus palabras.
                  </p>
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-left text-muted-foreground">
                        <span className="font-semibold text-foreground">Ejemplo:</span> "Departamento luminoso cerca del
                        río, 2 dormitorios, con balcón"
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`text-center ${processVisible ? "animate-fade-in-up animation-delay-400" : "opacity-0"}`}
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">IA que entiende tus necesidades</h3>
                  <p className="text-muted-foreground mb-4">
                    Nuestra inteligencia artificial analiza tu búsqueda y encuentra propiedades que realmente coinciden
                    con lo que estás buscando.
                  </p>
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-left text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Procesamiento inteligente de lenguaje natural
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`text-center ${processVisible ? "animate-fade-in-up animation-delay-500" : "opacity-0"}`}
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Resultados precisos y relevantes</h3>
                  <p className="text-muted-foreground mb-4">
                    Recibí propiedades que realmente se ajustan a tu búsqueda, con toda la información que necesitás
                    para tomar una decisión.
                  </p>
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-left text-muted-foreground">
                        <span className="font-semibold text-foreground">Coincidencias exactas con tus criterios</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background" ref={inspirationRef}>
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2
                  className={`text-4xl md:text-5xl font-bold mb-4 ${
                    inspirationVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                >
                  Inspiración para tu búsqueda
                </h2>
                <p
                  className={`text-lg md:text-xl text-muted-foreground ${
                    inspirationVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0"
                  }`}
                >
                  Explora estas opciones populares para empezar tu búsqueda.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                  href="/resultados?q=departamento+moderno"
                  className={`group ${inspirationVisible ? "animate-scale-in animation-delay-300" : "opacity-0"}`}
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/modern-apartment-interior.jpg')] bg-cover bg-center transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">Departamento Moderno</h3>
                      <Button variant="secondary" className="bg-white/90 hover:bg-white text-foreground">
                        Explorar opciones
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/resultados?q=casa+con+pileta"
                  className={`group ${inspirationVisible ? "animate-scale-in animation-delay-400" : "opacity-0"}`}
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/house-with-pool.jpg')] bg-cover bg-center transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">Casa con pileta</h3>
                      <Button variant="secondary" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Explorar opciones
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/resultados?q=jardín+amplio"
                  className={`group ${inspirationVisible ? "animate-scale-in animation-delay-500" : "opacity-0"}`}
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/large-garden-property.jpg')] bg-cover bg-center transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">Jardín amplio</h3>
                      <Button variant="secondary" className="bg-white/90 hover:bg-white text-foreground">
                        Explorar opciones
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/resultados?q=con+terraza"
                  className={`group ${inspirationVisible ? "animate-scale-in animation-delay-600" : "opacity-0"}`}
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/property-with-terrace.jpg')] bg-cover bg-center transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">Con terraza</h3>
                      <Button variant="secondary" className="bg-white/90 hover:bg-white text-foreground">
                        Explorar opciones
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
