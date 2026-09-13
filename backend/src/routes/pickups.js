import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// POST /api/pickups - Request doorstep sample blouse pickup
router.post('/', (req, res) => {
  try {
    const { customerName, phone, address, preferredDate, preferredTime, notes } = req.body;

    if (!customerName || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and pickup address are required.'
      });
    }

    const pickup = {
      id: `PU-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      phone,
      address,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || 'Morning (10 AM - 1 PM)',
      notes: notes || '',
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };

    db.data.pickups.unshift(pickup);
    db.save();

    res.status(201).json({
      success: true,
      message: 'Doorstep pickup request scheduled successfully!',
      pickup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to schedule pickup',
      error: error.message
    });
  }
});

// GET /api/pickups - List all pickup requests (Admin)
router.get('/', (req, res) => {
  res.json({
    success: true,
    pickups: db.data.pickups
  });
});

export default router;
