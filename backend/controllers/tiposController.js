import supabase from '../database/config.js';

// Controlador encargado de obtener todos los tipos de propiedad (casa, departamento, quinta, etc.)
export const getTiposPropiedad = async (_req, res) => {
    try {
        // Consultamos la tabla 'tipo_propiedad'
        const { data, error } = await supabase
            .from('tipo_propiedad') // Nombre de la tabla
            .select('id_tipo_propiedad, nombre') // Campos a recuperar
            .order('nombre', { ascending: true }); // Orden alfabético ascendente

        // Manejo de errores
        if (error) {
            console.error('Error al obtener tipos de propiedad:', error);
            return res.status(500).json({ error: error.message });
        }

        // Respuesta unificada con longitud
        return res.status(200).json({
            total: data?.length || 0, // Cantidad total de tipos de propiedad
            resultados: data, // Array de resultados
        });
    } catch (err) {
        console.error('Error inesperado en getTiposPropiedad:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador encargado de obtener todos los tipos de operación (Venta, Alquiler, etc.)
export const getTiposOperacion = async (_req, res) => {
    try {
        // Consultamos la tabla 'tipo_operacion'
        const { data, error } = await supabase
            .from('tipo_operacion') // Nombre de la tabla
            .select('id_tipo_operacion, nombre') // Campos a recuperar
            .order('nombre', { ascending: true }); // Orden alfabético ascendente

        // Manejo de errores
        if (error) {
            console.error('Error al obtener tipos de operación:', error);
            return res.status(500).json({ error: error.message });
        }

        // Respuesta unificada con longitud
        return res.status(200).json({
            total: data?.length || 0, // Cantidad total de tipos de operación
            resultados: data, // Array de resultados
        });
    } catch (err) {
        console.error('Error inesperado en getTiposOperacion:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
