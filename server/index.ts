import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { generalLimiter, authLimiter } from './middleware/rateLimiter.js';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import assetsRouter from './routes/assets.js';
import transactionsRouter from './routes/transactions.js';
import withdrawalsRouter from './routes/withdrawals.js';
import supportRouter from './routes/support.js';
import notificationsRouter from './routes/notifications.js';
import settingsRouter from './routes/settings.js';
import logsRouter from './routes/logs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ── API Routes ──────────────────────────────────────────────────────────────
app.get('/api/health', generalLimiter, (_req, res) => {
  res.json({ status: 'ok', version: '1.0.1', uptime: process.uptime() });
});

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/users', usersRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/withdrawals', withdrawalsRouter);
app.use('/api/support', supportRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/logs', logsRouter);

// ── Production static serving ───────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  // SPA catch-all: serve index.html for any non-API route
  app.get('*', generalLimiter, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`InvestgoV1.001 server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

export default app;
