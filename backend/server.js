import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import optionsRoutes from './src/routes/options.js';
import designsRoutes from './src/routes/designs.js';
import ordersRoutes from './src/routes/orders.js';
import pickupsRoutes from './src/routes/pickups.js';
import authRoutes from './src/routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nakshatra_tailor';

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`🍃 Connected to MongoDB database: ${MONGO_URI}`);
  })
  .catch((err) => {
    console.warn(`⚠️ MongoDB connection error (using local database store fallback): ${err.message}`);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/options', optionsRoutes);
app.use('/api/designs', designsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/pickups', pickupsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: "Nakshatra Designer's Blouse Stitching API",
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected/fallback',
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✨ Nakshatra Designer's Backend Server running at http://localhost:${PORT}`);
});
