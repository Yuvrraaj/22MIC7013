import express from 'express';
import { cfg } from './config/env';
import { log } from './utils/log';
import { reqLogger } from './middleware/reqLogger';
import { errorHandler } from './middleware/errorHandler';
import vehicleRoutes from './routes/vehicleRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';

const app = express();

app.use(express.json());
app.use(reqLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/vehicles', vehicleRoutes);
app.use('/maintenance', maintenanceRoutes);

app.use(errorHandler);

app.listen(cfg.port, () => {
  log('info', 'config', `Server started on port ${cfg.port}`);
  console.log(`Server running at http://localhost:${cfg.port}`);
});
