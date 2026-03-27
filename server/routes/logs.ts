import { Router } from 'express';
import type { Request, Response } from 'express';
import { systemLogs } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import type { JwtPayload } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

type AuthReq = Request & { user?: JwtPayload };

// GET /api/logs?level=INFO
router.get('/', requireRole('admin', 'superadmin'), (req: AuthReq, res: Response): void => {
  const { level } = req.query as { level?: string };
  if (level) {
    res.json(systemLogs.filter(l => l.level === level.toUpperCase()));
  } else {
    res.json(systemLogs);
  }
});

export default router;
