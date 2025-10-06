import { Router } from 'express';
import { getPartidos } from '../controllers/partidosController.js';

const router = Router();

// Ruta para obtener todos los partidos con su región asociada
router.get('/', getPartidos);

export default router;
