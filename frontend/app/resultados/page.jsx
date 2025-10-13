'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import PropertyResultCard from '@/components/property-result-card';
import { useSearchProperties } from '@/hooks/use-search-properties';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResultadosPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q');
    const servicios = searchParams.get('servicios');
    const tipoPropiedad = searchParams.get('tipo_propiedad');

    const [page, setPage] = useState(1);
    const { data, properties, loading, error, searchProperties } =
        useSearchProperties();

    useEffect(() => {
        // Si existe 'servicios' o 'query', pasamos un objeto para construir la query string
        if (query || servicios || tipoPropiedad) {
            const opts = {};
            if (query) opts.q = query;
            if (servicios) opts.servicios = servicios;
            if (tipoPropiedad) opts.tipo_propiedad = tipoPropiedad;
            searchProperties(opts, page);
        }
    }, [query, servicios, page]);

    const handleNext = () => {
        if (data?.pagina_actual < data?.total_paginas) setPage((p) => p + 1);
    };
    const handlePrev = () => {
        if (data?.pagina_actual > 1) setPage((p) => p - 1);
    };

    return (
        <div className='min-h-screen flex flex-col bg-background'>
            <Navbar />

            <main className='flex-1 container mx-auto px-4 py-8'>
                {/* =============================== */}
                {/*  Encabezado con resultados */}
                {/* =============================== */}
                {!loading && !error && data && (
                    <div className='mb-8 text-center md:text-left'>
                        <h1 className='text-2xl md:text-3xl font-bold text-foreground mb-2'>
                            Resultados para “{query}”
                        </h1>
                        <p className='text-muted-foreground'>
                            {data.total > 0
                                ? `${data.total} propiedades encontradas`
                                : 'No se encontraron resultados.'}
                        </p>
                    </div>
                )}

                {/* =============================== */}
                {/* Estado de carga */}
                {/* =============================== */}
                {loading && (
                    <div className='flex flex-col items-center justify-center py-20'>
                        <Loader2 className='h-12 w-12 animate-spin text-primary mb-4' />
                        <p className='text-muted-foreground'>
                            Entendiendo tu busqueda y analizando propiedades ...
                        </p>
                    </div>
                )}

                {/* =============================== */}
                {/* Error */}
                {/* =============================== */}
                {!loading && error && (
                    <p className='text-center text-destructive font-medium mt-20'>
                        Error al cargar propiedades: {error}
                    </p>
                )}

                {/* =============================== */}
                {/* 🏠 Resultados */}
                {/* =============================== */}
                {!loading && !error && properties.length > 0 && (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {properties.map((p, i) => (
                                <PropertyResultCard
                                    key={p.id_propiedad || i}
                                    property={p}
                                    index={i}
                                />
                            ))}
                        </div>

                        {/* PAGINADO */}
                        {data?.total_paginas > 1 && (
                            <div className='flex justify-center items-center gap-4 mt-10'>
                                <Button
                                    variant='outline'
                                    onClick={handlePrev}
                                    disabled={data?.pagina_actual === 1}
                                >
                                    <ArrowLeft className='h-4 w-4 mr-1' />{' '}
                                    Anterior
                                </Button>

                                <span className='text-sm text-muted-foreground'>
                                    Página {data?.pagina_actual} de{' '}
                                    {data?.total_paginas}
                                </span>

                                <Button
                                    variant='outline'
                                    onClick={handleNext}
                                    disabled={
                                        data?.pagina_actual ===
                                        data?.total_paginas
                                    }
                                >
                                    Siguiente{' '}
                                    <ArrowRight className='h-4 w-4 ml-1' />
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {/* =============================== */}
                {/* Sin resultados */}
                {/* =============================== */}
                {!loading && !error && properties.length === 0 && (
                    <p className='text-center text-muted-foreground py-20'>
                        No se encontraron resultados para “{query}”
                    </p>
                )}
            </main>

            <Footer />
        </div>
    );
}
