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

            let originalOpts = {};
            if (typeof queryOrOptions === 'string') {
                const q = queryOrOptions.trim();
                if (q) {
                    params.set('q', q);
                    originalOpts.q = q;
                }
            } else if (typeof queryOrOptions === 'object') {
                const {
                    q,
                    servicios,
                    tipo_propiedad,
                    tipo_operacion,
                    region,
                    partido,
                    dormitorios,
                    banos,
                    cocheras,
                    min_precio,
                    max_precio,
                    moneda,
                    inmobiliaria,
                    modo,
                } = queryOrOptions || {};
                if (q && String(q).trim() !== '') {
                    let qVal = String(q).trim();
                    // Si es una frase con espacios y no está entrecomillada, la envolvemos
                    if (/\s/.test(qVal) && !/^".*"$/.test(qVal)) {
                        qVal = `"${qVal}"`;
                    }
                    params.set('q', qVal);
                    originalOpts.q = qVal;
                }
                if (servicios) {
                    // Aceptar array o string. Si es array, enviar múltiples params (?servicios=a&servicios=b)
                    // Si es string con comas, dividir para aprovechar filtro AND del backend.
                    if (Array.isArray(servicios)) {
                        for (const s of servicios) {
                            if (
                                s !== undefined &&
                                s !== null &&
                                String(s).trim() !== ''
                            ) {
                                params.append('servicios', String(s).trim());
                            }
                        }
                    } else if (typeof servicios === 'string') {
                        const parts = servicios
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean);
                        if (parts.length > 1) {
                            for (const p of parts)
                                params.append('servicios', p);
                        } else if (parts.length === 1) {
                            params.set('servicios', parts[0]);
                        }
                    }
                }

                // tipo_propiedad puede venir como id numérico o string
                if (
                    tipo_propiedad !== undefined &&
                    tipo_propiedad !== null &&
                    String(tipo_propiedad).trim() !== ''
                ) {
                    params.set('tipo_propiedad', String(tipo_propiedad));
                }

                // Filtros adicionales soportados por el backend
                const maybeSet = (key, val) => {
                    if (
                        val !== undefined &&
                        val !== null &&
                        String(val).trim() !== ''
                    ) {
                        params.set(key, String(val).trim());
                    }
                };

                maybeSet('tipo_operacion', tipo_operacion);
                maybeSet('region', region);
                maybeSet('partido', partido);
                maybeSet('dormitorios', dormitorios);
                maybeSet('banos', banos);
                maybeSet('cocheras', cocheras);
                maybeSet('min_precio', min_precio);
                maybeSet('max_precio', max_precio);
                maybeSet('moneda', moneda);
                maybeSet('inmobiliaria', inmobiliaria);
                // Si hay q y no se especifica modo, usar OR explícitamente
                if (originalOpts.q && !modo) {
                    params.set('modo', 'or');
                } else if (modo) {
                    params.set('modo', String(modo));
                }
            }

            // Si no hay filtros relevantes, no hacemos la petición
            const hasAnyFilter = Array.from(params.keys()).some(
                (k) => k !== 'page'
            );
            if (!hasAnyFilter) {
                setLoading(false);
                return;
            }

            params.set('page', page);

            const buildUrl = (p) => `${apiUrl}/api/propiedades?${p.toString()}`;
            let url = buildUrl(params);
            console.log('Buscando propiedades en:', url);

            // Fetch robusto con timeout y mejor manejo de errores
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            let res;
            try {
                res = await fetch(url, { signal: controller.signal });
            } catch (fetchErr) {
                clearTimeout(timeoutId);
                console.error('Fetch falló (network/CORS/abort):', fetchErr);
                throw new Error(
                    fetchErr.message || 'Error de red al llamar al API'
                );
            }
            clearTimeout(timeoutId);

            if (!res.ok) {
                const contentType = res.headers.get('content-type') || '';
                let bodyText = '';
                try {
                    bodyText = await res.text();
                    if (contentType.includes('application/json')) {
                        try {
                            const parsed = JSON.parse(bodyText);
                            bodyText = JSON.stringify(parsed);
                        } catch {}
                    }
                } catch (e) {
                    bodyText = '<no se pudo leer body>';
                }
                throw new Error(
                    `Error HTTP ${res.status} ${res.statusText} - ${bodyText}`
                );
            }
            let json = await res.json();

            // Fallbacks: si no hay resultados y usamos filtros estrictos, relajamos consulta
            // 1) Si hay 'servicios', reintentar sin 'servicios'
            if (json?.total === 0 && params.has('servicios')) {
                const relaxed1 = new URLSearchParams(params.toString());
                relaxed1.delete('servicios');
                const url2 = buildUrl(relaxed1);
                console.log(
                    'Sin resultados. Reintentando sin servicios en:',
                    url2
                );
                const controller2 = new AbortController();
                const timeoutId2 = setTimeout(() => controller2.abort(), 12000);
                try {
                    const res2 = await fetch(url2, {
                        signal: controller2.signal,
                    });
                    clearTimeout(timeoutId2);
                    if (res2.ok) {
                        const j2 = await res2.json();
                        if (j2?.total > 0) {
                            json = j2;
                        }
                    }
                } catch (e) {
                    clearTimeout(timeoutId2);
                }
            }

            // 2) Si aún no hay resultados y hay 'q', reintentar sin 'q' (mantener estructura)
            if (json?.total === 0 && params.has('q')) {
                const relaxed2 = new URLSearchParams(params.toString());
                relaxed2.delete('q');
                // si sacamos q, también podemos quitar 'modo'
                relaxed2.delete('modo');
                const url3 = buildUrl(relaxed2);
                console.log('Aún sin resultados. Reintentando sin q en:', url3);
                const controller3 = new AbortController();
                const timeoutId3 = setTimeout(() => controller3.abort(), 12000);
                try {
                    const res3 = await fetch(url3, {
                        signal: controller3.signal,
                    });
                    clearTimeout(timeoutId3);
                    if (res3.ok) {
                        const j3 = await res3.json();
                        if (j3?.total > 0) {
                            json = j3;
                        }
                    }
                } catch (e) {
                    clearTimeout(timeoutId3);
                }
            }

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
