import { Router } from 'express';
import type { Request, Response } from 'express';
import { platformSettings, addLog } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import type { JwtPayload } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

type AuthReq = Request & { user?: JwtPayload };

// GET /api/settings
router.get('/', requireRole('admin', 'superadmin'), (_req: AuthReq, res: Response): void => {
  res.json(platformSettings);
});

// PUT /api/settings
router.put('/', requireRole('superadmin'), (req: AuthReq, res: Response): void => {
  const { storageFeeRate, maintenanceMode, notificationsEnabled, maxDailyWithdrawal, platformName, supportEmail } = req.body as Record<string, unknown>;
  if (storageFeeRate !== undefined) platformSettings.storageFeeRate = Number(storageFeeRate);
  if (maintenanceMode !== undefined) platformSettings.maintenanceMode = Boolean(maintenanceMode);
  if (notificationsEnabled !== undefined) platformSettings.notificationsEnabled = Boolean(notificationsEnabled);
  if (maxDailyWithdrawal !== undefined) platformSettings.maxDailyWithdrawal = Number(maxDailyWithdrawal);
  if (platformName !== undefined) platformSettings.platformName = String(platformName);
  if (supportEmail !== undefined) platformSettings.supportEmail = String(supportEmail);
  addLog(`Platform settings updated by ${req.user!.email}`, 'INFO', req.user!.email);
  res.json(platformSettings);
});

export default router;
