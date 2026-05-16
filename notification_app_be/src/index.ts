import express from 'express';
import { cfg } from './config/env';
import { log } from './utils/log';
import { reqLogger } from './middleware/reqLogger';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/userRoutes';
import notificationRoutes from './routes/notificationRoutes';
import preferenceRoutes from './routes/preferenceRoutes';

const app = express();

app.use(express.json());
app.use(reqLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/users', userRoutes);
app.use('/notifications', notificationRoutes);
app.use('/preferences', preferenceRoutes);

app.use(errorHandler);

app.listen(cfg.port, () => {
  log('info', 'config', `Server started on port ${cfg.port}`);
  console.log(`Server running at http://localhost:${cfg.port}`);
});
