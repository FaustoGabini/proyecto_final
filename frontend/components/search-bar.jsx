'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Nueva función que analiza la descripción con OpenAI
    const analizarDescripcion = async (descripcion) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/openai/analizar`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ descripcion }),
                }
            );

            const data = await response.json();

            if (!data.endpoint) {
                throw new Error(data.error || 'No se pudo generar el endpoint');
            }

            console.log('✅ Endpoint generado:', data.endpoint);

            // En lugar de pasar ?endpoint=..., normalizamos los filtros en la URL de /resultados
            // para que la página de resultados pueda llamar al backend con esos parámetros.
            // data.endpoint viene en formato: /api/propiedades?clave=valor&...
            let queryString = '';
            try {
                const idx = data.endpoint.indexOf('?');
                if (idx !== -1) queryString = data.endpoint.slice(idx + 1);
            } catch {}

            const params = new URLSearchParams(queryString);
            // Agregamos la consulta original para mostrar en UI si no viene incluida
            // y la normalizamos con comillas si es frase (q="frente al mar")
            if (!params.has('q') && descripcion) {
                const qRaw = String(descripcion).trim();
                const needsQuotes = /\s/.test(qRaw) && !/^".*"$/.test(qRaw);
                const qVal = needsQuotes ? `"${qRaw}"` : qRaw;
                params.set('q', qVal);
            }

            // Si hay q pero no modo, usar OR explícitamente
            if (params.has('q') && !params.has('modo')) {
                params.set('modo', 'or');
            }

            // Además de buscar en descripción (q), agregamos también como 'servicios' los tokens detectados en la frase
            // para que el backend busque en ambas fuentes (q y columna servicios), p. ej.: servicios=gas%20natural
            // CUIDADO: evitar falsos positivos (p. ej. "buenos aires" NO debe activar "aire acondicionado").
            try {
                // Mapa de servicios -> sinónimos. Evitamos términos demasiado genéricos como "aire".
                const serviceSynonyms = {
                    pileta: ['pileta', 'piscina', 'pool'],
                    jardin: ['jardin', 'jardín', 'parque'],
                    parrilla: ['parrilla', 'asador'],
                    patio: ['patio'],
                    balcon: ['balcon', 'balcón'],
                    ascensor: ['ascensor', 'elevador'],
                    'aire acondicionado': [
                        'aire acondicionado',
                        'a/a',
                        'aa',
                        'climatizacion',
                        'climatización',
                    ],
                    'acepta mascotas': [
                        'acepta mascotas',
                        'apto mascotas',
                        'pet friendly',
                    ],
                    'vista al rio': ['vista al rio', 'vista al río'],
                    'frente al mar': ['frente al mar', 'vista al mar'],
                    'gas natural': ['gas natural', 'gas'],
                    agua: ['agua'],
                    electricidad: ['electricidad'],
                };

                const normalize = (s) =>
                    (s || '')
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/\p{Diacritic}+/gu, '');

                const qForCheckRaw = (params.get('q') || '').replace(
                    /^"|"$/g,
                    ''
                );
                const qNorm = normalize(qForCheckRaw);

                // Servicios ya presentes en params (para evitar duplicados)
                const serviciosActuales = new Set();
                if (params.has('servicios')) {
                    const allServicios = params.getAll('servicios');
                    for (const entry of allServicios) {
                        const parts = String(entry)
                            .split(',')
                            .map((s) => normalize(s))
                            .filter(Boolean);
                        parts.forEach((p) => serviciosActuales.add(p));
                    }
                }

                const hasPhrase = (haystack, phrase) => {
                    const p = normalize(phrase);
                    // Casos especiales con símbolos (ej: a/a): usar includes directo sobre versión normalizada simple
                    if (/[^\p{L}\p{N}\s]/u.test(p)) {
                        return (
                            haystack.includes(p.replaceAll('/', ' / ')) ||
                            haystack.includes(p)
                        );
                    }
                    // Construir regex de palabras con límites; permitir 1+ espacios entre palabras
                    const pattern =
                        '\\b' + p.trim().split(/\s+/).join('\\s+') + '\\b';
                    try {
                        const re = new RegExp(pattern, 'i');
                        return re.test(haystack);
                    } catch {
                        return haystack.includes(p);
                    }
                };

                if (qNorm) {
                    for (const [serviceName, synonyms] of Object.entries(
                        serviceSynonyms
                    )) {
                        const found = synonyms.some((term) =>
                            hasPhrase(qNorm, term)
                        );
                        if (found) {
                            const key = normalize(serviceName);
                            if (!serviciosActuales.has(key)) {
                                params.append('servicios', serviceName);
                                serviciosActuales.add(key);
                            }
                        }
                    }
                }
            } catch {}

            router.push(`/resultados?${params.toString()}`);
        } catch (err) {
            console.error('❌ Error al analizar:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Manejador del formulario principal
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            analizarDescripcion(query.trim());
        }
    };

    // Manejador de las búsquedas rápidas
    const handleQuickSearch = (searchQuery) => {
        setQuery(searchQuery);
        analizarDescripcion(searchQuery);
    };

    return (
        <form onSubmit={handleSubmit} className='w-full max-w-4xl mx-auto'>
            <div className='bg-background rounded-2xl shadow-xl border-2 border-primary/10 p-2'>
                <div className='flex gap-2'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                        <Input
                            type='text'
                            placeholder='Ej: departamentos con vista al río en Rosario'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className='pl-12 h-14 text-base rounded-xl border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary'
                        />
                    </div>

                    <Button
                        type='submit'
                        size='lg'
                        disabled={loading}
                        className='h-14 px-8 rounded-xl font-semibold bg-primary hover:bg-primary/90'
                    >
                        {loading ? (
                            <span>Analizando...</span>
                        ) : (
                            <>
                                <Search className='h-5 w-5 md:mr-2' />
                                <span className='hidden md:inline'>Buscar</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {error && (
                <p className='text-red-500 text-center mt-2'>holis {error}</p>
            )}

            <div className='mt-6 flex flex-wrap gap-2 justify-center'>
                <button
                    type='button'
                    onClick={() => handleQuickSearch('PH en Palermo')}
                    className='text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors'
                >
                    PH en Palermo
                </button>
                <button
                    type='button'
                    onClick={() =>
                        handleQuickSearch('Dpto en Mardel con vista al mar')
                    }
                    className='text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors'
                >
                    Dpto en Mardel con vista al mar
                </button>
                <button
                    type='button'
                    onClick={() =>
                        handleQuickSearch(
                            'Casa con jardin y pileta en Santa Fe'
                        )
                    }
                    className='text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors'
                >
                    Casa con jardin y pileta en Santa Fe
                </button>
            </div>
        </form>
    );
}
