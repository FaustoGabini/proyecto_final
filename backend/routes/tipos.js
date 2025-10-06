import { Router } from 'express';
import {
    getTiposPropiedad,
    getTiposOperacion,
} from '../controllers/tiposController.js';

const router = Router();

// Ruta para obtener todos los tipos de propiedad
router.get('/propiedad', getTiposPropiedad);

// Ruta para obtener todos los tipos de operación
router.get('/operacion', getTiposOperacion);

export default router;
