import {
    getAllPropiedades,
    filtrarDepartamentos,
} from '../services/propiedades.js';

export async function obtenerPropiedades(req, res, next) {
    try {
        const propiedades = await getAllPropiedades();
        const total = propiedades.length;
        res.status(200).json({ total, propiedades });
    } catch (error) {
        next(error);
    }
}

export async function filtrarPropiedades(req, res, next) {
    try {
        const { zona, minAmbientes, maxPrecio } = req.query;
        const result = await filtrarDepartamentos({
            zona,
            minAmbientes,
            maxPrecio,
        });
        res.json(result);
    } catch (err) {
        next(err);
    }
}
