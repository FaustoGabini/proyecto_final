import { Router } from 'express';
import {
    getPropiedades,
    getPropiedadById,
    searchPropiedades,
    deletePropiedad,
} from '../controllers/propiedadesController.js';

const router = Router();

// Rutas principales
router.get('/', getPropiedades); // Listado general con filtros opcionalesrouter.get('/buscar', searchPropiedades); // Busqueda por palabra clave
router.get('/buscar', searchPropiedades); // Busqueda por palabra clave
router.get('/:id', getPropiedadById); // Detalle de una propiedad
router.delete('/:id', deletePropiedad); // Eliminar propiedad

export default router;
