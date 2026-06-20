import express from "express";
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middlewares/errorhandler.js";
import authRoutes from "./routes/auth.routes.js";
import gamesRoutes from "./routes/games.routes.js";
import studiosRoutes from "./routes/studios.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Videogames API – activa y funcionando' });
});

app.use('/api/auth',    authRoutes);
app.use('/api/games',   gamesRoutes);
app.use('/api/studios', studiosRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada.' });
});

app.use(errorHandler);

export default app;
