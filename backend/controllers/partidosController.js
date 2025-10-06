import supabase from '../database/config.js';

// Controlador para obtener todos los partidos, con filtro opcional por id_region
export const getPartidos = async (req, res) => {
    try {
        const { region } = req.query; // valor numérico opcional

        // Construimos la consulta base
        let query = supabase
            .from('partido')
            .select(
                `
                id_partido,
                nombre,
                region:id_region (id_region, nombre)
            `
            )
            .order('nombre', { ascending: true });

        // Si se especificó un id de región, filtramos
        if (region) {
            query = query.eq('id_region', parseInt(region));
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error al obtener partidos:', error);
            return res.status(500).json({ error: error.message });
        }

        // Si todo va bien, devolvemos los datos junto con la longitud total
        return res.status(200).json({
            total: data?.length || 0,
            resultados: data,
        });
    } catch (err) {
        console.error('Error inesperado en getPartidos:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
