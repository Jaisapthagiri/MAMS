import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import refRoutes from './routes/refRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import expenditureRoutes from './routes/expenditureRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { apiLogger } from './middleware/apiLogger.js';
import { seedIfNeeded } from './seed/seed.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(apiLogger);

app.get('/', (req,res) => res.json({ ok: true, message: 'Military Asset Management API' }));

app.use('/api/auth', authRoutes);
app.use('/api', refRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  if (process.env.SEED_ON_START === 'true') {
    await seedIfNeeded();
  }
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(err => {
  console.error('DB connection failed', err);
  process.exit(1);
});
