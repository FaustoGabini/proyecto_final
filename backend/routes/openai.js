import express from 'express';
import { analizarDescripcion } from '../utils/openai.js';

const router = express.Router();

// POST /api/openai/analizar
router.post('/analizar', async (req, res) => {
  try {
    const { descripcion } = req.body;

    if (!descripcion) {
      return res.status(400).json({ error: 'Falta el campo descripcion' });
    }

    const url = await analizarDescripcion(descripcion);
    res.json({ endpoint: url });
  } catch (error) {
    console.error("Error en analizarDescripcion:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

