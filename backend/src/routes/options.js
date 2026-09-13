import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET /api/options - Fetch all blouse customizer options & pricing matrix
router.get('/', (req, res) => {
  res.json({
    success: true,
    shopInfo: db.data.shopInfo,
    options: db.data.options
  });
});

export default router;
