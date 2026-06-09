import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import countriesRouter from './routes/countries.js';
import lawsRouter from './routes/laws.js';
import emergencyRouter from './routes/emergency.js';
import themesRouter from './routes/themes.js';
import documentsRouter from './routes/documents.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import statsRouter from './routes/stats.js';
import { attachUser, requireAdmin } from './middleware/auth.js';
import { checkConnection, testConnection } from './db/pool.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());
app.use(attachUser);

app.get('/api/health', async (_req, res) => {
  try {
    await checkConnection();
    res.json({
      status: 'ok',
      service: 'MAP-PROTECT API',
      version: '1.0.0',
      manifeste: 'Paris 2026',
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      status: 'error',
      service: 'MAP-PROTECT API',
      database: 'disconnected',
      message: 'PostgreSQL non disponible — vérifiez DATABASE_URL',
    });
  }
});

app.use('/api/countries', countriesRouter);
app.use('/api/laws', lawsRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/themes', themesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', requireAdmin, adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[API Error]', err.message);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

async function start() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`MAP-PROTECT API → http://localhost:${PORT}`);
      console.log(`Health check → http://localhost:${PORT}/api/health`);
      console.log(`PostgreSQL → ${process.env.DATABASE_URL ? 'configuré' : 'postgresql://mapprotect:mapprotect@localhost:5432/map_protect'}`);
    });
  } catch (err) {
    console.error('[PostgreSQL] Impossible de démarrer — base de données requise');
    console.error((err as Error).message);
    console.error('Lancez: docker compose up -d && npm run db:setup --prefix api');
    process.exit(1);
  }
}

start();
