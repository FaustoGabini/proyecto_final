import { Router } from 'express';
import { getInmobiliarias } from '../controllers/inmobiliariasController.js';

const router = Router();

// Ruta para obtener todas las inmobiliarias registradas
router.get('/', getInmobiliarias);

export default router;
