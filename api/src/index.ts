import express from 'express';
import cors from 'cors';
import countriesRouter from './routes/countries.js';
import lawsRouter from './routes/laws.js';
import emergencyRouter from './routes/emergency.js';
import themesRouter from './routes/themes.js';
import documentsRouter from './routes/documents.js';
import adminRouter from './routes/admin.js';
import statsRouter from './routes/stats.js';
import { requireAdmin } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'MAP-PROTECT API',
    version: '1.0.0',
    manifeste: 'Paris 2026',
  });
});

app.use('/api/countries', countriesRouter);
app.use('/api/laws', lawsRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/themes', themesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/admin', requireAdmin, adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.listen(PORT, () => {
  console.log(`MAP-PROTECT API → http://localhost:${PORT}`);
  console.log(`Health check → http://localhost:${PORT}/api/health`);
});
