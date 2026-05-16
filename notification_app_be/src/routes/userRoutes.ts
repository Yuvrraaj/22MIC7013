import { Router } from 'express';
import * as ctrl from '../controllers/userCtrl';
import * as notifCtrl from '../controllers/notificationCtrl';
import * as prefCtrl from '../controllers/preferenceCtrl';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.remove);

router.get('/:userId/notifications', notifCtrl.getByUser);
router.get('/:userId/notifications/unread', notifCtrl.getUnread);
router.post('/:userId/notifications/read-all', notifCtrl.markAllRead);

router.get('/:userId/preferences', prefCtrl.getByUser);

export default router;
