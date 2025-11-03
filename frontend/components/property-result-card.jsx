'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, Home, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Muestra una propiedad con imágenes, precio, ubicación y tipo de operación.
 * Compatible con la respuesta del backend (campo `resultados`).
 */
export default function PropertyResultCard({ property, index }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const delayClass =
        index % 3 === 0
            ? 'fade-in'
            : index % 3 === 1
            ? 'fade-in-delay-1'
            : 'fade-in-delay-2';

    // 🖼️ Imágenes: usa el array del backend o placeholders
    const images =
        property.imagenes && property.imagenes.length > 0
            ? property.imagenes
            : [
                  `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(
                      property.tipo_propiedad?.nombre || 'propiedad moderna'
                  )}`,
              ];

    // 💰 Formatear precio de forma segura
    const formatPrice = (precio) => {
        if (!precio || isNaN(precio.monto)) return 'Consultar precio';
        const currency =
            precio.moneda === 'USD'
                ? 'US$'
                : precio.moneda === 'ARS'
                ? '$'
                : precio.moneda || 'ARS';
        const formatted = new Intl.NumberFormat('es-AR').format(precio.monto);
        return `${currency} ${formatted}`;
    };

    // 🧭 Navegación de imágenes
    const nextImage = (e) => {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        setCurrentImageIndex(
            (prev) => (prev - 1 + images.length) % images.length
        );
    };

    return (
        <Link
            href={`/propiedad/${property.id_propiedad}`}
            className={`block ${delayClass}`}
        >
            <Card
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 group`}
            >
                {/* ====================== */}
                {/* 📸 Imagen principal */}
                {/* ====================== */}
                <div className='relative h-64 w-full overflow-hidden bg-muted'>
                    <img
                        src={images[currentImageIndex] || '/placeholder.svg'}
                        alt={property.descripcion?.slice(0, 100) || 'Propiedad'}
                        className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                        loading='lazy'
                    />

                    {/* Tipo de operación (Venta, Alquiler, etc.) */}
                    {property.tipo_operacion?.nombre && (
                        <div className='absolute top-3 right-3'>
                            <Badge className='bg-primary text-primary-foreground shadow-md'>
                                {property.tipo_operacion.nombre}
                            </Badge>
                        </div>
                    )}

                    {/* Flechas de navegación */}
                    {images.length > 1 && (
                        <div className='absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <Button
                                variant='secondary'
                                size='icon'
                                className='h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg'
                                onClick={prevImage}
                            >
                                <ChevronLeft className='h-4 w-4' />
                            </Button>
                            <Button
                                variant='secondary'
                                size='icon'
                                className='h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg'
                                onClick={nextImage}
                            >
                                <ChevronRight className='h-4 w-4' />
                            </Button>
                        </div>
                    )}

                    {/* Indicadores de imagen */}
                    {images.length > 1 && (
                        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentImageIndex(idx);
                                    }}
                                    className={`h-1.5 rounded-full transition-all ${
                                        idx === currentImageIndex
                                            ? 'w-6 bg-white'
                                            : 'w-1.5 bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ====================== */}
                {/* 🏠 Información de la propiedad */}
                {/* ====================== */}
                <div className='p-5'>
                    {/* Precio y ubicación */}
                    <div className='mb-3'>
                        <h3 className='text-xl font-bold text-foreground mb-1'>
                            {formatPrice(property.precio)}
                        </h3>

                        <div className='flex items-center gap-2 text-sm text-muted-foreground capitalize'>
                            <MapPin className='h-4 w-4' />
                            <span>
                                {property.calle_altura
                                    ? `${property.calle_altura}, ${
                                          property.partido?.nombre || ''
                                      }`
                                    : property.partido?.nombre ||
                                      'Ubicación no disponible'}
                            </span>
                        </div>
                    </div>

                    {/* Tipo y descripción */}
                    <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                        <Home className='h-4 w-4' />
                        <span>
                            {property.tipo_propiedad?.nombre || 'Propiedad'} —{' '}
                            {property.inmobiliaria?.nombre ||
                                'Inmobiliaria no especificada'}
                        </span>
                    </div>

                    <p className='text-sm text-muted-foreground line-clamp-3 leading-relaxed'>
                        {property.descripcion ||
                            'Hermosa propiedad disponible para vos.'}
                    </p>
                </div>
            </Card>
        </Link>
    );
}
