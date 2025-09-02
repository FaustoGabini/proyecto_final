import express from 'express';
// Cargamos las variables de entorno
import 'dotenv/config';

// Importamos las rutas relacionadas con propiedades (inmuebles)
import propiedadesRoutes from '../routes/propiedades.js';

export default class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

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
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server is running on port', this.port);
        });
    }
}
