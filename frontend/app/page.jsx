'use client';

import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import SearchBar from '@/components/search-bar';
import Footer from '@/components/footer';
import { MessageSquare, Sparkles, Target } from 'lucide-react';
import { useSearchProperties } from '@/hooks/use-search-properties';
import PropertyResultCard from '@/components/property-result-card';
import { Loader2 } from 'lucide-react';

export default function Home() {
    // 🧠 Hook de búsqueda
    const { data, properties, loading, error, searchProperties } =
        useSearchProperties();

    // 🔹 Cargar propiedades destacadas al inicio
    useEffect(() => {
        searchProperties('vista al río', 1); // ejemplo de búsqueda destacada
    }, []);

    return (
        <div className='min-h-screen flex flex-col'>
            <Navbar />

            <main className='flex-1'>
                {/* HERO PRINCIPAL */}
                <div className='relative border-b'>
                    <div className="absolute inset-0 bg-[url('/minimalist-modern-house-plants.jpg')] bg-cover bg-center" />
                    <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50' />

                    <div className='relative container mx-auto px-4 py-20 md:py-32'>
                        <div className='max-w-4xl mx-auto text-center'>
                            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]'>
                                Encontrá tu casa en Argentina
                            </h1>
                            <p className='text-xl md:text-2xl text-white mb-12 text-pretty drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]'>
                                Buscá propiedades usando Inteligencia Artificial
                            </p>

                            <SearchBar />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN EXPLICATIVA */}
                <section className='py-16 md:py-24 bg-background'>
                    <div className='container mx-auto px-4'>
                        <div className='max-w-6xl mx-auto'>
                            <div className='mb-16'>
                                <h2 className='text-4xl md:text-5xl font-bold text-primary mb-6 text-balance'>
                                    Una nueva forma de encontrar tu hogar
                                </h2>
                                <p className='text-lg md:text-xl text-muted-foreground max-w-3xl text-pretty'>
                                    Nuestro proceso de búsqueda es simple,
                                    transparente y personalizado. Está diseñado
                                    para que puedas darte cuenta (sin tener que
                                    llamar a nadie) si una propiedad es buena
                                    para vos.
                                </p>
                            </div>

                            <div className='grid md:grid-cols-3 gap-8 md:gap-12'>
                                {/* Paso 1 */}
                                <div className='space-y-4'>
                                    <div className='w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center'>
                                        <span className='text-2xl font-bold text-primary'>
                                            1
                                        </span>
                                    </div>
                                    <h3 className='text-xl font-semibold'>
                                        Buscá con tus propias palabras
                                    </h3>
                                    <p className='text-muted-foreground'>
                                        Describí la casa que buscás y InmoIA
                                        entenderá exactamente lo que necesitás.
                                        Buscá lo que se te ocurra, sin límites
                                        en tus palabras.
                                    </p>
                                    <div className='pt-2'>
                                        <div className='bg-muted/50 border rounded-lg p-4'>
                                            <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                                                <MessageSquare className='h-4 w-4' />
                                                <span>Ejemplo:</span>
                                            </div>
                                            <p className='text-sm font-medium'>
                                                Departamento en Rosario, 3
                                                ambientes, moderno, con balcón
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Paso 2 */}
                                <div className='space-y-4'>
                                    <div className='w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center'>
                                        <span className='text-2xl font-bold text-primary'>
                                            2
                                        </span>
                                    </div>
                                    <h3 className='text-xl font-semibold'>
                                        IA que entiende tus necesidades
                                    </h3>
                                    <p className='text-muted-foreground'>
                                        Nuestra inteligencia artificial analiza
                                        tu búsqueda y encuentra propiedades que
                                        realmente coinciden con lo que estás
                                        buscando.
                                    </p>
                                    <div className='pt-2'>
                                        <div className='bg-muted/50 border rounded-lg p-4 flex items-center gap-3'>
                                            <Sparkles className='h-8 w-8 text-primary' />
                                            <p className='text-sm'>
                                                Procesamiento inteligente de
                                                lenguaje natural
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Paso 3 */}
                                <div className='space-y-4'>
                                    <div className='w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center'>
                                        <span className='text-2xl font-bold text-primary'>
                                            3
                                        </span>
                                    </div>
                                    <h3 className='text-xl font-semibold'>
                                        Resultados precisos y relevantes
                                    </h3>
                                    <p className='text-muted-foreground'>
                                        Recibí propiedades que realmente se
                                        ajustan a tu búsqueda, con toda la
                                        información que necesitás para tomar una
                                        decisión.
                                    </p>
                                    <div className='pt-2'>
                                        <div className='bg-muted/50 border rounded-lg p-4 flex items-center gap-3'>
                                            <Target className='h-8 w-8 text-primary' />
                                            <p className='text-sm'>
                                                Coincidencias exactas con tus
                                                criterios
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============================== */}
                {/* 🏡 PROPIEDADES DESTACADAS */}
                {/* ============================== */}
                <section className='py-20 bg-muted/30 border-t border-border/40'>
                    <div className='container mx-auto px-4'>
                        <h2 className='text-3xl md:text-4xl font-bold text-foreground text-center mb-10'>
                            Propiedades destacadas
                        </h2>

                        {loading && (
                            <div className='flex flex-col items-center justify-center py-20'>
                                <Loader2 className='h-10 w-10 animate-spin text-primary mb-4' />
                                <p className='text-muted-foreground'>
                                    Cargando propiedades...
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className='text-center py-12'>
                                <p className='text-destructive font-medium'>
                                    Ocurrió un error al cargar las propiedades
                                    destacadas.
                                </p>
                            </div>
                        )}

                        {!loading && !error && properties.length > 0 && (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {properties
                                    .slice(0, 6)
                                    .map((property, index) => (
                                        <PropertyResultCard
                                            key={property.id_propiedad || index}
                                            property={property}
                                            index={index}
                                        />
                                    ))}
                            </div>
                        )}

                        {!loading && !error && properties.length === 0 && (
                            <p className='text-center text-muted-foreground py-12'>
                                No se encontraron propiedades destacadas por el
                                momento.
                            </p>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
