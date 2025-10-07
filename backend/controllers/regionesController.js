// Importamos la instancia del cliente de Supabase desde la configuración
import supabase from '../database/config.js';

// Controlador encargado de obtener todas las regiones registradas en la base de datos
export const getRegiones = async (_req, res) => {
    try {
        // Realizamos la consulta a la tabla 'region', seleccionando los campos necesarios
        const { data, error } = await supabase
            .from('region') // Nombre de la tabla
            .select('id_region, nombre') // Campos a recuperar
            .order('nombre', { ascending: true }); // Orden alfabético ascendente

        // Si ocurre un error en la consulta, se registra en consola y se devuelve respuesta HTTP 500
        if (error) {
            console.error('Error al obtener regiones:', error);
            return res.status(500).json({ error: error.message });
        }

        // Si la consulta fue exitosa, devolvemos los datos junto con la cantidad total de resultados
        return res.status(200).json({
            total: data?.length || 0,
            resultados: data,
        });
    } catch (err) {
        // Captura de errores inesperados (por ejemplo, fallos de red o sintaxis)
        console.error('Error inesperado en getRegiones:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
