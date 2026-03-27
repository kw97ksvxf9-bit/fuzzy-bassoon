import { Router } from 'express';
import type { Request, Response } from 'express';
import { transactions, generateId, addLog } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import type { JwtPayload } from '../middleware/auth.js';
import type { Transaction } from '../types.js';

const router = Router();
router.use(authenticateToken);

type AuthReq = Request & { user?: JwtPayload };

// GET /api/transactions
router.get('/', (req: AuthReq, res: Response): void => {
  if (req.user!.role === 'user') {
    res.json(transactions.filter(t => t.userId === req.user!.userId));
  } else {
    res.json(transactions);
  }
});

// POST /api/transactions — superadmin only; supports backdating via 'date' field
router.post('/', requireRole('superadmin'), (req: AuthReq, res: Response): void => {
  const { userId, type, assetId, amount, date, status, description } = req.body as Record<string, unknown>;
  if (!userId || !type || !amount) {
    res.status(400).json({ success: false, message: 'userId, type and amount are required' });
    return;
  }
  const newTxn: Transaction = {
    id: generateId('TXN'),
    userId: userId as string,
    type: type as Transaction['type'],
    assetId: (assetId as string) || '',
    amount: Number(amount),
    date: date ? String(date) : new Date().toISOString().slice(0, 10),
    status: (status as Transaction['status']) || 'Completed',
    description: (description as string) || '',
  };
  transactions.push(newTxn);
  addLog(`Transaction ${newTxn.id} created by ${req.user!.email}`, 'INFO', req.user!.email);
  res.status(201).json(newTxn);
});

export default router;
