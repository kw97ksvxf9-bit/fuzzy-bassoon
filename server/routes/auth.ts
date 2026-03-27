import { Router } from 'express';
import type { Request, Response } from 'express';
import { users, CREDENTIALS, addLog } from '../data/store.js';
import { generateToken } from '../middleware/auth.js';
import type { JwtPayload } from '../middleware/auth.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// In-memory OTP store: pendingUserId -> otp (always '123456' for demo)
const pendingOtps = new Map<string, string>();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response): void => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }
  const validPassword = CREDENTIALS[email];
  if (!validPassword || validPassword !== password) {
    addLog(`Failed login attempt for ${email}`, 'WARNING', 'system');
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }
  const user = users.find(u => u.email === email && !u.suspended);
  if (!user) {
    res.status(401).json({ success: false, message: 'Account not found or suspended' });
    return;
  }
  pendingOtps.set(user.id, '123456');
  addLog(`OTP sent to ${email}`, 'INFO', email);
  res.json({ success: true, message: 'OTP sent to your registered email', pendingUserId: user.id });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req: Request, res: Response): void => {
  const { otp, pendingUserId } = req.body as { otp?: string; pendingUserId?: string };
  if (!otp || !pendingUserId) {
    res.status(400).json({ success: false, message: 'OTP and pendingUserId are required' });
    return;
  }
  const expectedOtp = pendingOtps.get(pendingUserId);
  if (!expectedOtp || expectedOtp !== otp) {
    res.status(401).json({ success: false, message: 'Invalid OTP' });
    return;
  }
  const user = users.find(u => u.id === pendingUserId);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  pendingOtps.delete(pendingUserId);
  const token = generateToken(user);
  addLog(`User ${user.email} logged in successfully`, 'INFO', user.email);
  res.json({ success: true, token, user });
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req: Request, res: Response): void => {
  const user = (req as Request & { user?: JwtPayload }).user;
  if (user) addLog(`User ${user.email} logged out`, 'INFO', user.email);
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
