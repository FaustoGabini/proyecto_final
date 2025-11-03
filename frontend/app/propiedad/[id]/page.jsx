'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {
    ArrowLeft,
    Bath,
    Bed,
    Car,
    Home,
    MapPin,
    Phone,
    Shield,
} from 'lucide-react';

function formatPrice(precio) {
    if (!precio || isNaN(precio.monto)) return 'Consultar precio';
    const currency =
        precio.moneda === 'USD'
            ? 'US$'
            : precio.moneda === 'ARS'
            ? '$'
            : precio.moneda || 'ARS';
    const formatted = new Intl.NumberFormat('es-AR').format(precio.monto);
    return `${currency} ${formatted}`;
}

function parseMaybeArray(input) {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') {
        const s = input.trim();
        if (!s) return [];
        // Intentar JSON
        try {
            const arr = JSON.parse(s);
            if (Array.isArray(arr)) return arr;
        } catch {}
        // Fallback: separado por comas
        return s
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean);
    }
    return [];
}

export default function PropiedadDetallePage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prop, setProp] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const apiUrl =
                    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                const url = `${apiUrl}/api/propiedades/${id}`;
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 15000);
                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(timeout);
                if (!res.ok) {
                    const body = await res.text();
                    throw new Error(
                        `HTTP ${res.status} ${res.statusText} - ${body}`
                    );
                }
                const data = await res.json();
                if (isMounted) setProp(data);
            } catch (e) {
                if (isMounted)
                    setError(e.message || 'Error al cargar propiedad');
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        if (id) fetchData();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const imagenes = useMemo(() => {
        const imgs = parseMaybeArray(prop?.imagenes);
        if (imgs.length > 0) return imgs;
        const placeholder = `/placeholder.svg?height=600&width=900&query=${encodeURIComponent(
            prop?.tipo_propiedad?.nombre || 'propiedad'
        )}`;
        return [placeholder];
    }, [prop]);

    const servicios = useMemo(() => {
        const ss = parseMaybeArray(prop?.servicios);
        // normalizar a formato presentable (Title Case simple)
        return ss.map((s) => {
            const clean = String(s)
                .replace(/[\[\]"]+/g, '')
                .trim();
            return clean
                .toLowerCase()
                .split(' ')
                .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
                .join(' ');
        });
    }, [prop]);

    return (
        <div className='min-h-screen flex flex-col bg-background'>
            <Navbar />

            <main className='flex-1 container mx-auto px-4 py-6 md:py-10'>
                <div className='mb-6 flex items-center gap-3'>
                    <Button variant='outline' onClick={() => router.back()}>
                        <ArrowLeft className='h-4 w-4 mr-2' /> Volver
                    </Button>
                    <div className='text-sm text-muted-foreground'>
                        ID: {id}
                    </div>
                </div>

                {loading && (
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <div className='aspect-video rounded-xl bg-muted animate-pulse' />
                        <div className='space-y-4'>
                            <div className='h-8 w-2/3 rounded bg-muted animate-pulse' />
                            <div className='h-4 w-1/2 rounded bg-muted animate-pulse' />
                            <div className='h-4 w-1/3 rounded bg-muted animate-pulse' />
                            <div className='h-24 w-full rounded bg-muted animate-pulse' />
                        </div>
                    </div>
                )}

                {!loading && error && (
                    <p className='text-center text-destructive font-medium mt-20'>
                        Error al cargar propiedad: {error}
                    </p>
                )}

                {!loading && !error && prop && (
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {/* Galería */}
                        <div className='relative'>
                            <Carousel className='w-full'>
                                <CarouselContent>
                                    {imagenes.map((src, idx) => (
                                        <CarouselItem key={idx}>
                                            <div className='aspect-video w-full overflow-hidden rounded-xl bg-muted'>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={src}
                                                    alt={
                                                        prop.descripcion?.slice(
                                                            0,
                                                            100
                                                        ) || `Imagen ${idx + 1}`
                                                    }
                                                    className='h-full w-full object-cover'
                                                    loading='lazy'
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className='bg-white/90 hover:bg-white' />
                                <CarouselNext className='bg-white/90 hover:bg-white' />
                            </Carousel>
                        </div>

                        {/* Información */}
                        <div className='space-y-6'>
                            <div>
                                <h1 className='text-2xl md:text-3xl font-bold text-foreground mb-2'>
                                    {prop.tipo_propiedad?.nombre || 'Propiedad'}{' '}
                                    en{' '}
                                    {prop.tipo_operacion?.nombre || 'Operación'}
                                </h1>
                                <div className='flex flex-wrap items-center gap-2 text-muted-foreground'>
                                    <MapPin className='h-4 w-4' />
                                    <span className='capitalize'>
                                        {prop.calle_altura
                                            ? `${prop.calle_altura}, `
                                            : ''}
                                        {prop.partido?.nombre || 'Ubicación'}
                                        {prop.partido?.region?.nombre
                                            ? `, ${prop.partido.region.nombre}`
                                            : ''}
                                    </span>
                                </div>
                            </div>

                            <div className='rounded-xl border bg-card p-4'>
                                <div className='text-3xl font-extrabold text-foreground'>
                                    {formatPrice(prop.precio)}
                                </div>
                                <div className='mt-2 text-sm text-muted-foreground'>
                                    Actualizado:{' '}
                                    {prop.precio?.fecha
                                        ? new Date(
                                              prop.precio.fecha
                                          ).toLocaleDateString('es-AR')
                                        : '-'}
                                </div>
                            </div>

                            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                                <div className='rounded-xl border p-3 flex items-center gap-2'>
                                    <Bed className='h-4 w-4' />
                                    <div className='text-sm'>
                                        <span className='font-semibold'>
                                            Dormitorios:
                                        </span>{' '}
                                        {prop.dormitorios ?? '-'}
                                    </div>
                                </div>
                                {Number(prop?.banos) > 0 && (
                                    <div className='rounded-xl border p-3 flex items-center gap-2'>
                                        <Bath className='h-4 w-4' />
                                        <div className='text-sm'>
                                            <span className='font-semibold'>
                                                Baños:
                                            </span>{' '}
                                            {prop.banos}
                                        </div>
                                    </div>
                                )}
                                <div className='rounded-xl border p-3 flex items-center gap-2'>
                                    <Car className='h-4 w-4' />
                                    <div className='text-sm'>
                                        <span className='font-semibold'>
                                            Cocheras:
                                        </span>{' '}
                                        {prop.cocheras ?? '-'}
                                    </div>
                                </div>
                                <div className='rounded-xl border p-3 flex items-center gap-2'>
                                    <Home className='h-4 w-4' />
                                    <div className='text-sm'>
                                        <span className='font-semibold'>
                                            Antigüedad:
                                        </span>{' '}
                                        {prop.antiguedad ?? '-'}
                                    </div>
                                </div>
                            </div>

                            {servicios.length > 0 && (
                                <div>
                                    <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
                                        Servicios y comodidades
                                    </h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {servicios.map((s, i) => (
                                            <Badge
                                                key={i}
                                                variant='secondary'
                                                className='capitalize'
                                            >
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
                                    Descripción
                                </h3>
                                <p className='text-sm leading-relaxed text-foreground whitespace-pre-line'>
                                    {prop.descripcion || 'Sin descripción'}
                                </p>
                            </div>

                            <div className='rounded-xl border p-4 flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    {prop.inmobiliaria?.logo && (
                                        <img
                                            src={prop.inmobiliaria.logo}
                                            alt={
                                                prop.inmobiliaria.nombre ||
                                                'Inmobiliaria'
                                            }
                                            className='h-10 w-10 rounded-full object-cover border'
                                        />
                                    )}
                                    <div>
                                        <div className='font-semibold'>
                                            {prop.inmobiliaria?.nombre ||
                                                'Inmobiliaria'}
                                        </div>
                                        <div className='text-sm text-muted-foreground'>
                                            {prop.inmobiliaria?.telefono ||
                                                'Sin teléfono'}
                                        </div>
                                    </div>
                                </div>
                                {prop.inmobiliaria?.telefono && (
                                    <Button asChild>
                                        <a
                                            href={`tel:${prop.inmobiliaria.telefono}`}
                                        >
                                            <Phone className='h-4 w-4 mr-2' />{' '}
                                            Llamar
                                        </a>
                                    </Button>
                                )}
                            </div>

                            <div className='text-xs text-muted-foreground flex items-center gap-2'>
                                <Shield className='h-3.5 w-3.5' />
                                Datos provistos por la inmobiliaria. Sujeto a
                                verificación.
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
