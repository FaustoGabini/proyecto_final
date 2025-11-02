import express from 'express';
// Cargamos las variables de entorno
import 'dotenv/config';
import cors from 'cors';

// Importamos las rutas relacionadas con propiedades (inmuebles)
import openaiRoutes from '../routes/openai.js';
import regionesRoutes from '../routes/regiones.js';
import tiposRoutes from '../routes/tipos.js';
import partidosRoutes from '../routes/partidos.js';
import inmobiliariasRoutes from '../routes/inmobiliarias.js';
import propiedadesRoutes from '../routes/propiedades.js';

export default class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.app.use(
            cors({
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                allowedHeaders: ['Content-Type', 'Authorization'],
            })
        );

        this.middlewares();
        this.routes();
    }
    // Método para configurar middlewares
    middlewares() {
        // Habilitamos el parseo automático de JSON en las solicitudes
        this.app.use(express.json());
    }

    // Método para registrar las rutas disponibles en la API
    routes() {
        // Montamos las rutas de propiedades bajo el path /api/propiedades
        this.app.use('/api/propiedades', propiedadesRoutes);
        this.app.use('/api/openai', openaiRoutes);

        // Ruta de prueba para ver si el backend funciona
        this.app.get('/', (_req, res) => {
            res.send('Hello Wordld!');
        });

        // Rutas relacionadas con regiones (provincias o divisiones geográficas)
        this.app.use('/api/regiones', regionesRoutes);

        // Rutas relacionadas con tipos de propiedad y operación
        this.app.use('/api/tipos', tiposRoutes);

        // Rutas relacionadas con partidos (divisiones dentro de una región)
        this.app.use('/api/partidos', partidosRoutes);

        // Rutas relacionadas con inmobiliarias
        this.app.use('/api/inmobiliarias', inmobiliariasRoutes);

        // Rutas relacionadas con propiedades
        this.app.use('/api/propiedades', propiedadesRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server is running on port', this.port);
        });
    }
}
