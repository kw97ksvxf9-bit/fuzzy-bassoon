import { Router } from 'express';
import type { Request, Response } from 'express';
import { withdrawalRequests, assets, users, generateId, addLog, addNotification } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { generalLimiter } from '../middleware/rateLimiter.js';
import type { JwtPayload } from '../middleware/auth.js';
import type { WithdrawalRequest } from '../types.js';

const router = Router();
router.use(generalLimiter);
router.use(authenticateToken);

type AuthReq = Request & { user?: JwtPayload };

// GET /api/withdrawals
router.get('/', (req: AuthReq, res: Response): void => {
  if (req.user!.role === 'user') {
    res.json(withdrawalRequests.filter(w => w.userId === req.user!.userId));
  } else {
    res.json(withdrawalRequests);
  }
});

// POST /api/withdrawals — user submits withdrawal request
router.post('/', (req: AuthReq, res: Response): void => {
  const { assetId } = req.body as { assetId?: string };
  if (!assetId) { res.status(400).json({ success: false, message: 'assetId is required' }); return; }
  const asset = assets.find(a => a.id === assetId && a.userId === req.user!.userId);
  if (!asset) { res.status(404).json({ success: false, message: 'Asset not found or not owned by you' }); return; }
  const user = users.find(u => u.id === req.user!.userId);
  const wr: WithdrawalRequest = {
    id: generateId('WR'),
    userId: req.user!.userId,
    userName: user?.name || 'Unknown',
    assetId,
    assetType: asset.type,
    requestDate: new Date().toISOString().slice(0, 10),
    status: 'Pending',
  };
  withdrawalRequests.push(wr);
  asset.status = 'Pending Withdrawal';
  addLog(`Withdrawal request ${wr.id} created by ${req.user!.email}`, 'INFO', req.user!.email);
  res.status(201).json(wr);
});

// PUT /api/withdrawals/:id/approve — admin/superadmin
router.put('/:id/approve', requireRole('admin', 'superadmin'), (req: AuthReq, res: Response): void => {
  const wr = withdrawalRequests.find(w => w.id === req.params.id);
  if (!wr) { res.status(404).json({ success: false, message: 'Withdrawal request not found' }); return; }
  wr.status = 'Approved';
  const asset = assets.find(a => a.id === wr.assetId);
  if (asset) asset.status = 'Delivered';
  addLog(`Withdrawal ${wr.id} approved by ${req.user!.email}`, 'INFO', req.user!.email);
  addNotification(wr.userId, `Your withdrawal request for ${wr.assetType} has been approved.`, 'success');
  res.json(wr);
});

// PUT /api/withdrawals/:id/reject — admin/superadmin
router.put('/:id/reject', requireRole('admin', 'superadmin'), (req: AuthReq, res: Response): void => {
  const wr = withdrawalRequests.find(w => w.id === req.params.id);
  if (!wr) { res.status(404).json({ success: false, message: 'Withdrawal request not found' }); return; }
  wr.status = 'Rejected';
  const asset = assets.find(a => a.id === wr.assetId);
  if (asset) asset.status = 'Stored';
  addLog(`Withdrawal ${wr.id} rejected by ${req.user!.email}`, 'WARNING', req.user!.email);
  addNotification(wr.userId, `Your withdrawal request for ${wr.assetType} has been rejected.`, 'error');
  res.json(wr);
});

export default router;
