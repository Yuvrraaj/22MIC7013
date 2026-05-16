import { Router } from 'express';
import * as ctrl from '../controllers/preferenceCtrl';

const router = Router();

router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
