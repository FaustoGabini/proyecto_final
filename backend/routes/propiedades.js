import { Router } from 'express';

// Importamos los controladores que manejan la lógica de cada endpoint
import {
    obtenerPropiedades, // Controlador para obtener todas las propiedades
    filtrarPropiedades, // Controlador para aplicar filtros de búsqueda
} from '../controllers/propiedades.js';

const router = Router();

// Ruta principal: devuelve todas las propiedades
// GET /api/propiedades
router.get('/', obtenerPropiedades);

// Ruta para filtrar propiedades según parámetros de búsqueda
// GET /api/propiedades/filtrar?ubicacion=rosario&precioMin=100000
router.get('/filtrar', filtrarPropiedades);

export default router;
