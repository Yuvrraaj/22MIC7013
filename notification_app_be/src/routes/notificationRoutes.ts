import { Router } from 'express';
import * as ctrl from '../controllers/notificationCtrl';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.post('/bulk', ctrl.createBulk);
router.put('/:id', ctrl.update);
router.post('/:id/read', ctrl.markRead);
router.delete('/:id', ctrl.remove);

export default router;
