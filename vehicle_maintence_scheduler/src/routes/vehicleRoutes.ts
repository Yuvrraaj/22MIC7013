import { Router } from 'express';
import * as ctrl from '../controllers/vehicleCtrl';
import * as maintCtrl from '../controllers/maintenanceCtrl';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.get('/:vehicleId/maintenance', maintCtrl.getByVehicle);

export default router;
