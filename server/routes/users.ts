import { Router } from 'express';
import type { Request, Response } from 'express';
import { users, generateId, addLog } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { generalLimiter } from '../middleware/rateLimiter.js';
import type { JwtPayload } from '../middleware/auth.js';

const router = Router();
router.use(generalLimiter);
router.use(authenticateToken);

type AuthReq = Request & { user?: JwtPayload };

// GET /api/users
router.get('/', requireRole('admin', 'superadmin'), (req: AuthReq, res: Response): void => {
  res.json(users);
});

// GET /api/users/:id
router.get('/:id', (req: AuthReq, res: Response): void => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
  // Regular users can only view their own profile
  if (req.user!.role === 'user' && req.user!.userId !== req.params.id) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return;
  }
  res.json(user);
});

// POST /api/users
router.post('/', requireRole('superadmin'), (req: AuthReq, res: Response): void => {
  const { name, email, role, phone, address, idNumber, accountType } = req.body as Record<string, string>;
  if (!name || !email || !role) {
    res.status(400).json({ success: false, message: 'name, email and role are required' });
    return;
  }
  if (users.some(u => u.email === email)) {
    res.status(409).json({ success: false, message: 'Email already exists' });
    return;
  }
  const newUser = {
    id: generateId('USR'),
    name,
    email,
    role: role as 'superadmin' | 'admin' | 'user',
    verified: false,
    suspended: false,
    phone: phone || '',
    address: address || '',
    idNumber: idNumber || '',
    accountType: accountType || 'Standard',
  };
  users.push(newUser);
  addLog(`User ${email} created by ${req.user!.email}`, 'INFO', req.user!.email);
  res.status(201).json(newUser);
});

// PUT /api/users/:id
router.put('/:id', requireRole('superadmin'), (req: AuthReq, res: Response): void => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) { res.status(404).json({ success: false, message: 'User not found' }); return; }
  const { name, email, role, verified, suspended, phone, address, idNumber, accountType } = req.body as Record<string, unknown>;
  const user = users[idx];
  if (name !== undefined) user.name = name as string;
  if (email !== undefined) user.email = email as string;
  if (role !== undefined) user.role = role as 'superadmin' | 'admin' | 'user';
  if (verified !== undefined) user.verified = verified as boolean;
  if (suspended !== undefined) user.suspended = suspended as boolean;
  if (phone !== undefined) user.phone = phone as string;
  if (address !== undefined) user.address = address as string;
  if (idNumber !== undefined) user.idNumber = idNumber as string;
  if (accountType !== undefined) user.accountType = accountType as string;
  addLog(`User ${user.id} updated by ${req.user!.email}`, 'INFO', req.user!.email);
  res.json(user);
});

// DELETE /api/users/:id  (soft-delete via suspend)
router.delete('/:id', requireRole('superadmin'), (req: AuthReq, res: Response): void => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) { res.status(404).json({ success: false, message: 'User not found' }); return; }
  users[idx].suspended = true;
  addLog(`User ${users[idx].email} suspended by ${req.user!.email}`, 'WARNING', req.user!.email);
  res.json({ success: true, message: 'User suspended' });
});

export default router;
