import express from 'express';
import { firebaseAuth } from '../common/middleware/firebaseAuth';
import { registerDevice, unregisterDevice, listNotifications, markRead, markAllRead, sendTest } from '../controllers/notificationsController';

const router = express.Router();

router.use(firebaseAuth);

router.post('/register-device', (req, res, next) => registerDevice(req as any, res, next));
router.post('/unregister-device', (req, res, next) => unregisterDevice(req as any, res, next));
router.get('/', (req, res, next) => listNotifications(req as any, res, next));
router.patch('/:id/read', (req, res, next) => markRead(req as any, res, next));
router.patch('/read-all', (req, res, next) => markAllRead(req as any, res, next));
router.post('/test', (req, res, next) => sendTest(req as any, res, next));

export default router;
