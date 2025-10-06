// Importamos el enrutador de Express y el controlador correspondiente
import { Router } from 'express';
import { getRegiones } from '../controllers/regionesController.js';

// Inicializamos el router
const router = Router();

// Definimos la ruta para obtener todas las regiones
router.get('/', getRegiones);

// Exportamos el router para usarlo en app.js
export default router;
