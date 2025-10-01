import express from 'express';
import { analizarDescripcion } from '../utils/openai.js';

const router = express.Router();

router.post('/etiquetar', async (req, res) => {
  const { descripcion } = req.body;
  try {
    const etiquetas = await analizarDescripcion(descripcion);
    res.json({ etiquetas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la descripción con OpenAI' });
  }
});

export default router;
