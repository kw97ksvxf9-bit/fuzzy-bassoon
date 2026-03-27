import { Router } from 'express';
import type { Request, Response } from 'express';
import { supportTickets, generateId, addLog, addNotification, users } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { generalLimiter } from '../middleware/rateLimiter.js';
import type { JwtPayload } from '../middleware/auth.js';
import type { SupportTicket, TicketResponse } from '../types.js';

const router = Router();
router.use(generalLimiter);
router.use(authenticateToken);

type AuthReq = Request & { user?: JwtPayload };

// GET /api/support/tickets
router.get('/tickets', (req: AuthReq, res: Response): void => {
  if (req.user!.role === 'user') {
    res.json(supportTickets.filter(t => t.userId === req.user!.userId));
  } else {
    res.json(supportTickets);
  }
});

// POST /api/support/tickets — user creates ticket
router.post('/tickets', (req: AuthReq, res: Response): void => {
  const { subject, message, priority } = req.body as Record<string, string>;
  if (!subject || !message) {
    res.status(400).json({ success: false, message: 'subject and message are required' });
    return;
  }
  const user = users.find(u => u.id === req.user!.userId);
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const ticket: SupportTicket = {
    id: generateId('TKT'),
    userId: req.user!.userId,
    userName: user?.name || 'Unknown',
    subject,
    message,
    priority: (['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium') as SupportTicket['priority'],
    status: 'Open',
    createdAt: now,
    updatedAt: now,
    responses: [],
  };
  supportTickets.push(ticket);
  addLog(`Support ticket ${ticket.id} created by ${req.user!.email}`, 'INFO', req.user!.email);
  res.status(201).json(ticket);
});

// POST /api/support/tickets/:id/respond — admin/superadmin or ticket owner
router.post('/tickets/:id/respond', (req: AuthReq, res: Response): void => {
  const ticket = supportTickets.find(t => t.id === req.params.id);
  if (!ticket) { res.status(404).json({ success: false, message: 'Ticket not found' }); return; }
  const { role, userId, email } = req.user!;
  // Only admin/superadmin or ticket owner can respond
  if (role === 'user' && ticket.userId !== userId) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return;
  }
  const { message } = req.body as { message?: string };
  if (!message) { res.status(400).json({ success: false, message: 'message is required' }); return; }
  const user = users.find(u => u.id === userId);
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const response: TicketResponse = {
    id: generateId('TKT'),
    ticketId: ticket.id,
    userId,
    userName: user?.name || email,
    message,
    timestamp: now,
  };
  ticket.responses.push(response);
  ticket.updatedAt = now;
  if (['admin', 'superadmin'].includes(role)) {
    ticket.status = 'In Progress';
    addNotification(ticket.userId, `Support ticket "${ticket.subject}" has a new response.`, 'info');
  }
  addLog(`Response added to ticket ${ticket.id} by ${email}`, 'INFO', email);
  res.status(201).json(ticket);
});

// PUT /api/support/tickets/:id/status — admin/superadmin
router.put('/tickets/:id/status', requireRole('admin', 'superadmin'), (req: AuthReq, res: Response): void => {
  const ticket = supportTickets.find(t => t.id === req.params.id);
  if (!ticket) { res.status(404).json({ success: false, message: 'Ticket not found' }); return; }
  const { status } = req.body as { status?: string };
  const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ success: false, message: `status must be one of: ${validStatuses.join(', ')}` });
    return;
  }
  ticket.status = status as SupportTicket['status'];
  ticket.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  addLog(`Ticket ${ticket.id} status changed to ${status} by ${req.user!.email}`, 'INFO', req.user!.email);
  addNotification(ticket.userId, `Your support ticket "${ticket.subject}" status changed to ${status}.`, 'info');
  res.json(ticket);
});

export default router;
