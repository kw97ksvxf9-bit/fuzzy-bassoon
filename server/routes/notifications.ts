import { Router } from 'express';
import type { Request, Response } from 'express';
import { notifications } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';
import type { JwtPayload } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

type AuthReq = Request & { user?: JwtPayload };

// GET /api/notifications
router.get('/', (req: AuthReq, res: Response): void => {
  res.json(notifications.filter(n => n.userId === req.user!.userId));
});

// PUT /api/notifications/:id/read
router.put('/:id/read', (req: AuthReq, res: Response): void => {
  const notification = notifications.find(n => n.id === req.params.id && n.userId === req.user!.userId);
  if (!notification) { res.status(404).json({ success: false, message: 'Notification not found' }); return; }
  notification.read = true;
  res.json(notification);
});

// PUT /api/notifications/read-all
router.put('/read-all', (req: AuthReq, res: Response): void => {
  notifications.filter(n => n.userId === req.user!.userId).forEach(n => { n.read = true; });
  res.json({ success: true, message: 'All notifications marked as read' });
});

export default router;
