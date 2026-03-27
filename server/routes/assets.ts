import { Router } from 'express';
import type { Request, Response } from 'express';
import { assets, transactions, generateId, addLog, addNotification, users } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import type { JwtPayload } from '../middleware/auth.js';
import type { Asset, Transaction } from '../types.js';

const router = Router();
router.use(authenticateToken);

type AuthReq = Request & { user?: JwtPayload };

// GET /api/assets
router.get('/', (req: AuthReq, res: Response): void => {
  const role = req.user!.role;
  if (role === 'user') {
    res.json(assets.filter(a => a.userId === req.user!.userId));
  } else {
    res.json(assets);
  }
});

// GET /api/assets/:id
router.get('/:id', (req: AuthReq, res: Response): void => {
  const asset = assets.find(a => a.id === req.params.id);
  if (!asset) { res.status(404).json({ success: false, message: 'Asset not found' }); return; }
  if (req.user!.role === 'user' && asset.userId !== req.user!.userId) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return;
  }
  res.json(asset);
});

// POST /api/assets — superadmin only; supports depositDate backdating
router.post('/', requireRole('superadmin'), (req: AuthReq, res: Response): void => {
  const { userId, type, quantity, unit, depositDate, valueUSD, location } = req.body as Record<string, unknown>;
  if (!userId || !type || !quantity || !unit || !valueUSD) {
    res.status(400).json({ success: false, message: 'userId, type, quantity, unit and valueUSD are required' });
    return;
  }
  const targetUser = users.find(u => u.id === userId);
  if (!targetUser) { res.status(404).json({ success: false, message: 'Target user not found' }); return; }

  const newAsset: Asset = {
    id: generateId('AST'),
    userId: userId as string,
    type: type as string,
    quantity: Number(quantity),
    unit: unit as string,
    depositDate: depositDate ? String(depositDate) : new Date().toISOString().slice(0, 10),
    valueUSD: Number(valueUSD),
    location: (location as string) || 'VAULT-UNASSIGNED',
    status: 'Stored',
  };
  assets.push(newAsset);

  // Create associated deposit transaction
  const newTxn: Transaction = {
    id: generateId('TXN'),
    userId: userId as string,
    type: 'Deposit',
    assetId: newAsset.id,
    amount: Number(valueUSD),
    date: newAsset.depositDate,
    status: 'Completed',
    description: `${type} deposit - ${quantity} ${unit}`,
  };
  transactions.push(newTxn);

  addLog(`Asset ${newAsset.id} created for user ${userId} by ${req.user!.email}`, 'INFO', req.user!.email);
  addNotification(userId as string, `New ${type} asset has been added to your account.`, 'success');

  res.status(201).json({ asset: newAsset, transaction: newTxn });
});

// PUT /api/assets/:id — superadmin only
router.put('/:id', requireRole('superadmin'), (req: AuthReq, res: Response): void => {
  const idx = assets.findIndex(a => a.id === req.params.id);
  if (idx === -1) { res.status(404).json({ success: false, message: 'Asset not found' }); return; }
  const asset = assets[idx];
  const { type, quantity, unit, depositDate, valueUSD, location, status } = req.body as Record<string, unknown>;
  if (type !== undefined) asset.type = type as string;
  if (quantity !== undefined) asset.quantity = Number(quantity);
  if (unit !== undefined) asset.unit = unit as string;
  if (depositDate !== undefined) asset.depositDate = depositDate as string;
  if (valueUSD !== undefined) asset.valueUSD = Number(valueUSD);
  if (location !== undefined) asset.location = location as string;
  if (status !== undefined) asset.status = status as Asset['status'];
  addLog(`Asset ${asset.id} updated by ${req.user!.email}`, 'INFO', req.user!.email);
  res.json(asset);
});

export default router;
