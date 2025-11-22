import express from 'express';
import cors from 'cors';
import HealthRoutes from './api/routes/health.routes';
import jobOfertRoutes from './api/routes/jobOfert.routes';
import newoffersRoutes from './api/routes/newOffers.routes';
import fixerRoutes from './api/routes/fixer.routes';
import userProfileRoutes from './routes/userProfile.routes';
import jobRoutes from './routes/job.routes';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:8080','*'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', HealthRoutes);
app.use('/api/devmaster', jobOfertRoutes);
app.use('/api/newOffers', newoffersRoutes);
app.use('/api/fixers', fixerRoutes);
app.use('/api/user-profiles', userProfileRoutes);
app.use('/api/jobs', jobRoutes);
// 404 handler
app.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).send({
    message: 'route not found',
  });
});

export default app;
