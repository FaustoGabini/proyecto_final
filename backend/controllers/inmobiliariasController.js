// Importamos la instancia del cliente de Supabase desde la configuración
import supabase from '../database/config.js';

// Controlador encargado de obtener todas las inmobiliarias registradas
export const getInmobiliarias = async (_req, res) => {
    try {
        // Consultamos la tabla 'inmobiliaria'
        const { data, error } = await supabase
            .from('inmobiliaria') // Nombre de la tabla
            .select('id_inmobiliaria, nombre, logo, telefono') // Campos relevantes
            .order('nombre', { ascending: true }); // Orden alfabético ascendente

        // Manejo de errores
        if (error) {
            console.error('Error al obtener inmobiliarias:', error);
            return res.status(500).json({ error: error.message });
        }

        // Respuesta unificada con longitud
        return res.status(200).json({
            total: data?.length || 0,
            resultados: data,
        });
    } catch (err) {
        console.error('Error inesperado en getInmobiliarias:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
