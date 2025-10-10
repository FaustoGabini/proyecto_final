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

    const searchProperties = async (query, page = 1) => {
        if (!query || query.trim() === '') return;

        setLoading(true);
        setError(null);

        console.log(query);

        try {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const res = await fetch(
                `${apiUrl}/api/propiedades/buscar?q=${encodeURIComponent(
                    query
                )}&page=${page}`
            );

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
