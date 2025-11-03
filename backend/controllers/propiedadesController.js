import supabase from '../database/config.js';

// ------------------------------------------------------------
// GET /api/propiedades
// Búsqueda unificada: permite filtros + texto libre en descripción
// ------------------------------------------------------------
export const getPropiedades = async (req, res) => {
    try {
        const {
            region,
            partido,
            tipo_propiedad,
            tipo_operacion,
            inmobiliaria,
            min_precio,
            max_precio,
            banos,
            cocheras,
            dormitorios,
            antiguedad,
            servicios,
            q, //
            modo = 'or', // or | and
            sort = 'id_propiedad_asc',
            page = 1,
            limit = 20,
        } = req.query;

        // ------------------------------------------------------------
        // Paginación y orden dinámico
        // ------------------------------------------------------------
        const currentPage = !isNaN(page) && page > 0 ? parseInt(page) : 1;
        const pageSize = !isNaN(limit) && limit > 0 ? parseInt(limit) : 20;
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;

        const [campoOrden, direccion] = sort.split('_');
        const asc = direccion?.toLowerCase() !== 'desc';
        const camposValidos = [
            'id_propiedad',
            'antiguedad',
            'precio.monto',
            'precio.fecha',
            'dormitorios',
            'banos',
        ];
        const campoValido = camposValidos.includes(campoOrden)
            ? campoOrden
            : 'id_propiedad';

        // ------------------------------------------------------------
        // Construimos la consulta base
        // ------------------------------------------------------------
        let query = supabase
            .from('propiedad')
            .select(
                `
                id_propiedad,
                descripcion,
                antiguedad,
                dormitorios,
                banos,
                cocheras,
                servicios,
                imagenes,
                calle_altura,
                tipo_propiedad:id_tipo_propiedad (id_tipo_propiedad, nombre),
                tipo_operacion:id_tipo_operacion (id_tipo_operacion, nombre),
                inmobiliaria:id_inmobiliaria (id_inmobiliaria, nombre, telefono, logo),
                partido:id_partido (id_partido, nombre, region:id_region (id_region, nombre)),
                precio:id_precio (id_precio, monto, moneda, fecha)
            `,
                { count: 'exact' }
            )
            .order(campoValido, { ascending: asc })
            .range(from, to);

        // ------------------------------------------------------------
        // 🔍 Búsqueda textual (q) — palabras o frases
        // ------------------------------------------------------------
        if (q && q.trim() !== '') {
            const regex = /"([^"]+)"|(\S+)/g;
            const palabras = [];
            let match;
            while ((match = regex.exec(q)) !== null) {
                const palabra = match[1] || match[2];
                if (palabra) palabras.push(palabra.trim());
            }

            // Sanitizar palabras para evitar romper el parser de PostgREST en 'or' cuando hay comas/paréntesis
            const sanitize = (w) =>
                w.replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim();
            const palabrasSanitizadas = palabras
                .map(sanitize)
                .filter((w) => w.length > 0);

            if (palabrasSanitizadas.length > 0) {
                if (modo.toLowerCase() === 'or') {
                    if (palabrasSanitizadas.length === 1) {
                        // Evitar uso de .or() con valores que pueden contener comas; usar ilike directo
                        query = query.ilike(
                            'descripcion',
                            `%${palabrasSanitizadas[0]}%`
                        );
                    } else {
                        const filters = palabrasSanitizadas.map(
                            (word) => `descripcion.ilike.%${word}%`
                        );
                        query = query.or(filters.join(','));
                    }
                } else if (modo.toLowerCase() === 'and') {
                    for (const word of palabrasSanitizadas) {
                        query = query.ilike('descripcion', `%${word}%`);
                    }
                }
            }
        }

        // ------------------------------------------------------------
        // Filtros relacionales y numéricos (solo si son válidos)
        // ------------------------------------------------------------
        if (partido && !isNaN(partido))
            query = query.eq('id_partido', parseInt(partido));
        if (tipo_propiedad && !isNaN(tipo_propiedad))
            query = query.eq('id_tipo_propiedad', parseInt(tipo_propiedad));
        if (tipo_operacion && !isNaN(tipo_operacion))
            query = query.eq('id_tipo_operacion', parseInt(tipo_operacion));
        if (inmobiliaria && !isNaN(inmobiliaria))
            query = query.eq('id_inmobiliaria', parseInt(inmobiliaria));

        if (min_precio && !isNaN(min_precio))
            query = query.gte('precio.monto', parseFloat(min_precio));
        if (max_precio && !isNaN(max_precio))
            query = query.lte('precio.monto', parseFloat(max_precio));

        if (banos && !isNaN(banos)) query = query.gte('banos', parseInt(banos));
        if (cocheras && !isNaN(cocheras))
            query = query.gte('cocheras', parseInt(cocheras));
        if (dormitorios && !isNaN(dormitorios))
            query = query.gte('dormitorios', parseInt(dormitorios));
        if (antiguedad && !isNaN(antiguedad))
            query = query.lte('antiguedad', parseInt(antiguedad));

        if (servicios) {
            // Aceptar 'servicios' como string ("pileta") o array (["pileta","jardin"]).
            if (typeof servicios === 'string' && servicios.trim() !== '') {
                query = query.ilike('servicios', `%${servicios.trim()}%`);
            } else if (Array.isArray(servicios)) {
                // Requerir que coincidan TODOS los servicios solicitados (AND)
                for (const s of servicios) {
                    if (typeof s === 'string' && s.trim() !== '') {
                        query = query.ilike('servicios', `%${s.trim()}%`);
                    }
                }
            }
        }

        // ------------------------------------------------------------
        // Filtro por región (usa los partidos asociados)
        // ------------------------------------------------------------
        if (region && !isNaN(region)) {
            const { data: partidos, error: errorPartidos } = await supabase
                .from('partido')
                .select('id_partido')
                .eq('id_region', parseInt(region));

            if (errorPartidos) {
                console.error(
                    'Error al obtener partidos por región:',
                    errorPartidos
                );
                return res.status(500).json({ error: errorPartidos.message });
            }

            const idsPartidos = partidos.map((p) => p.id_partido);
            if (idsPartidos.length > 0) {
                query = query.in('id_partido', idsPartidos);
            } else {
                return res.status(200).json({
                    total: 0,
                    pagina_actual: currentPage,
                    limite: pageSize,
                    total_paginas: 0,
                    resultados: [],
                });
            }
        }

        // ------------------------------------------------------------
        // Ejecutamos la consulta final
        // ------------------------------------------------------------
        const { data, error, count } = await query;

        if (error) {
            // Manejo especial para rangos fuera de límites (PostgREST 416)
            if (
                typeof error.message === 'string' &&
                error.message.toLowerCase().includes('range not satisfiable')
            ) {
                return res.status(200).json({
                    filtros_aplicados: {
                        region,
                        partido,
                        tipo_propiedad,
                        tipo_operacion,
                        inmobiliaria,
                        min_precio,
                        max_precio,
                        banos,
                        cocheras,
                        dormitorios,
                        antiguedad,
                        servicios,
                        q: q || null,
                        modo: q ? modo : null,
                    },
                    total: 0,
                    pagina_actual: currentPage,
                    limite: pageSize,
                    total_paginas: 0,
                    orden: `${campoValido}_${asc ? 'asc' : 'desc'}`,
                    resultados: [],
                });
            }
            console.error('Error al obtener propiedades:', error);
            return res.status(500).json({ error: error.message });
        }

        const totalPages = Math.ceil(count / pageSize);

        // ------------------------------------------------------------
        // Respuesta estandarizada
        // ------------------------------------------------------------
        return res.status(200).json({
            filtros_aplicados: {
                region,
                partido,
                tipo_propiedad,
                tipo_operacion,
                inmobiliaria,
                min_precio,
                max_precio,
                banos,
                cocheras,
                dormitorios,
                antiguedad,
                servicios,
                q: q || null,
                modo: q ? modo : null,
            },
            total: count || 0,
            pagina_actual: currentPage,
            limite: pageSize,
            total_paginas: totalPages,
            orden: `${campoValido}_${asc ? 'asc' : 'desc'}`,
            resultados: data,
        });
    } catch (err) {
        console.error('Error inesperado en getPropiedades:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// ------------------------------------------------------------
// GET /api/propiedades/:id
// Devuelve una propiedad específica con todas sus relaciones
// ------------------------------------------------------------
export const getPropiedadById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('propiedad')
            .select(
                `
                id_propiedad,
                descripcion,
                antiguedad,
                dormitorios,
                banos,
                cocheras,
                servicios,
                imagenes,
                calle_altura,
                tipo_propiedad:id_tipo_propiedad (id_tipo_propiedad, nombre),
                tipo_operacion:id_tipo_operacion (id_tipo_operacion, nombre),
                inmobiliaria:id_inmobiliaria (id_inmobiliaria, nombre, telefono, logo),
                partido:id_partido (id_partido, nombre, region:id_region (id_region, nombre)),
                precio:id_precio (id_precio, monto, moneda, fecha)
            `
            )
            .eq('id_propiedad', parseInt(id))
            .single();

        if (error) {
            console.error('Error al obtener propiedad:', error);
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res
                .status(404)
                .json({ error: `No se encontró la propiedad con id ${id}` });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error('Error inesperado en getPropiedadById:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// ------------------------------------------------------------
// GET /api/propiedades/buscar
// Busca propiedades cuyas descripciones contengan una o más palabras clave
// ------------------------------------------------------------
export const searchPropiedades = async (req, res) => {
    try {
        const { q, page = 1, limit = 20, modo = 'or' } = req.query;

        // Validación básica
        if (!q || q.trim() === '') {
            return res.status(400).json({
                error: 'Debe especificar al menos una palabra o frase en el parámetro "q".',
            });
        }

        // Extraemos frases entre comillas o palabras separadas
        // Ejemplo: q="excelente iluminacion" jardin pileta
        const regex = /"([^"]+)"|(\S+)/g;
        const palabras = [];
        let match;
        while ((match = regex.exec(q)) !== null) {
            const palabra = match[1] || match[2];
            if (palabra) palabras.push(palabra.trim());
        }

        const currentPage = parseInt(page);
        const pageSize = parseInt(limit);
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;

        // Base de la consulta
        let query = supabase
            .from('propiedad')
            .select(
                `
                id_propiedad,
                descripcion,
                antiguedad,
                dormitorios,
                banos,
                cocheras,
                servicios,
                imagenes,
                calle_altura,
                tipo_propiedad:id_tipo_propiedad (id_tipo_propiedad, nombre),
                tipo_operacion:id_tipo_operacion (id_tipo_operacion, nombre),
                inmobiliaria:id_inmobiliaria (id_inmobiliaria, nombre, telefono, logo),
                partido:id_partido (id_partido, nombre, region:id_region (id_region, nombre)),
                precio:id_precio (id_precio, monto, moneda, fecha)
            `,
                { count: 'exact' }
            )
            .order('id_propiedad', { ascending: true })
            .range(from, to);

        // Si se usa modo "or", se devuelven propiedades que coincidan con alguna palabra o frase
        if (modo.toLowerCase() === 'or') {
            const filters = palabras.map(
                (word) => `descripcion.ilike.%${word}%`
            );
            query = query.or(filters.join(','));
        }
        // Si se usa modo "and", deben coincidir todas las palabras o frases
        else if (modo.toLowerCase() === 'and') {
            for (const word of palabras) {
                query = query.ilike('descripcion', `%${word}%`);
            }
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error al buscar propiedades:', error);
            return res.status(500).json({ error: error.message });
        }

        const totalPages = Math.ceil(count / pageSize);

        return res.status(200).json({
            consulta: q,
            frases_detectadas: palabras,
            modo_busqueda: modo.toUpperCase(),
            total: count || 0,
            pagina_actual: currentPage,
            limite: pageSize,
            total_paginas: totalPages,
            resultados: data,
        });
    } catch (err) {
        console.error('Error inesperado en searchPropiedades:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
// ------------------------------------------------------------
// DELETE /api/propiedades/:id
// Elimina una propiedad por ID
// ------------------------------------------------------------
export const deletePropiedad = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('propiedad')
            .delete()
            .eq('id_propiedad', parseInt(id));

        if (error) {
            console.error('Error al eliminar propiedad:', error);
            return res.status(500).json({ error: error.message });
        }

        return res
            .status(200)
            .json({ mensaje: 'Propiedad eliminada correctamente' });
    } catch (err) {
        console.error('Error inesperado en deletePropiedad:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
