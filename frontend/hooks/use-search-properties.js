'use client';

import { useState } from 'react';

/**
 * Hook para buscar propiedades en el backend.
 * Soporta paginación real con query y número de página.
 */
export function useSearchProperties() {
    const [properties, setProperties] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchProperties = async (queryOrOptions, page = 1) => {
        // queryOrOptions puede ser:
        // - un string (q)
        // - un objeto { q, servicios }
        if (!queryOrOptions) return;

        setLoading(true);
        setError(null);

        try {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

            const params = new URLSearchParams();

            if (typeof queryOrOptions === 'string') {
                const q = queryOrOptions.trim();
                if (q) params.set('q', q);
            } else if (typeof queryOrOptions === 'object') {
                const { q, servicios, tipo_propiedad } = queryOrOptions || {};
                if (q && String(q).trim() !== '') {
                    let qVal = String(q).trim();
                    // Si es una frase con espacios y no está entrecomillada, la envolvemos
                    if (/\s/.test(qVal) && !/^".*"$/.test(qVal)) {
                        qVal = `"${qVal}"`;
                    }
                    params.set('q', qVal);
                }
                if (servicios) {
                    // aceptar array o string (separa por comas si es array)
                    if (Array.isArray(servicios))
                        params.set('servicios', servicios.join(','));
                    else params.set('servicios', servicios);
                }

                // tipo_propiedad puede venir como id numérico o string
                if (
                    tipo_propiedad !== undefined &&
                    tipo_propiedad !== null &&
                    String(tipo_propiedad).trim() !== ''
                ) {
                    params.set('tipo_propiedad', String(tipo_propiedad));
                }
            }

            // Si no hay filtros relevantes, no hacemos la petición
            if (
                !params.has('q') &&
                !params.has('servicios') &&
                !params.has('tipo_propiedad')
            ) {
                setLoading(false);
                return;
            }

            params.set('page', page);

            const url = `${apiUrl}/api/propiedades?${params.toString()}`;
            console.log('Buscando propiedades en:', url);
            const res = await fetch(url);

            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const json = await res.json();

            setData(json);
            setProperties(json.resultados || []);
        } catch (err) {
            console.error('Error buscando propiedades:', err);
            setError(err.message);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    return { data, properties, loading, error, searchProperties };
}
