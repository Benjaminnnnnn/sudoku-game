import { httpServerHandler } from 'cloudflare:node';
import cors from 'cors';
import express from 'express';
import { registerGameRoutes } from './routes/games';
import { registerHealthRoutes } from './routes/health';

const app = express();

app.use(
  cors({
    origin: true,
  }),
);
app.use(express.json());
app.disable('x-powered-by');

registerHealthRoutes(app);
registerGameRoutes(app);

app.listen(3000);

export default httpServerHandler({ port: 3000 });
