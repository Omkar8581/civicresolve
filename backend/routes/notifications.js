import { Router } from 'express';
import { dbService } from '../services/db.js';

const router = Router();

// 1. Get notifications for a citizen
router.get('/', async (req, res) => {
  try {
    const { userId, email } = req.query;
    const targetUserId = userId || (email ? null : 'citizen_demo_1');

    const notifications = await dbService.getNotificationsByUser(targetUserId, email);
    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      notifications,
      unreadCount,
      total: notifications.length
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// 2. Mark single notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const updated = await dbService.markNotificationRead(id, userId);
    if (!updated) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      message: 'Notification marked as read',
      notification: updated
    });
  } catch (err) {
    console.error('Error updating notification read status:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// 3. Mark all notifications as read for a user
router.put('/read-all', async (req, res) => {
  try {
    const { userId, email } = req.body;
    const targetUserId = userId || (email ? null : 'citizen_demo_1');

    const result = await dbService.markAllNotificationsRead(targetUserId, email);
    res.json({
      message: 'All notifications marked as read',
      ...result
    });
  } catch (err) {
    console.error('Error marking all notifications read:', err);
    res.status(500).json({ error: 'Failed to mark all notifications read' });
  }
});

// 4. Quick Notification summary endpoint
router.get('/summary', async (req, res) => {
  try {
    const { userId, email } = req.query;
    const targetUserId = userId || (email ? null : 'citizen_demo_1');
    const notifications = await dbService.getNotificationsByUser(targetUserId, email);
    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      unreadCount,
      total: notifications.length,
      latest: notifications[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

export default router;
