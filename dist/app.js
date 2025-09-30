import express from 'express';
import cors from 'cors';
import { pinRoutes } from './routes/index.js';
const app = express();
app.use(express.json());
app.use(cors());
app.use('/pins', pinRoutes);
export default app;
