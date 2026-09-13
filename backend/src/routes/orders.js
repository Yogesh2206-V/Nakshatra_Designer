import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Helper to generate custom order tracking ID
function generateOrderId() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `NK-${num}`;
}

// POST /api/orders - Submit custom blouse stitching order
router.post('/', (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      address,
      designSpecs,
      measurements,
      pickupRequested,
      pickupAddress,
      totalPrice
    } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone number are required.'
      });
    }

    const orderId = generateOrderId();
    const now = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(now.getDate() + 6); // 6 days standard fulfillment

    const newOrder = {
      id: orderId,
      customerName,
      phone,
      email: email || '',
      address: address || '',
      garmentType: designSpecs?.garmentType || 'saree_blouse',
      designSpecs: designSpecs || {},
      measurements: measurements || null,
      pickupRequested: !!pickupRequested,
      pickupAddress: pickupAddress || address || '',
      totalPrice: totalPrice || 650,
      status: pickupRequested ? 'Fabric Received at Shop' : 'Shop Order Placed',
      orderDate: now.toISOString(),
      expectedDelivery: deliveryDate.toISOString().split('T')[0]
    };

    db.data.orders.unshift(newOrder);

    if (pickupRequested) {
      db.data.pickups.unshift({
        id: `PU-${Math.floor(100 + Math.random() * 900)}`,
        orderId: newOrder.id,
        customerName,
        phone,
        address: pickupAddress || address,
        preferredDate: deliveryDate.toISOString().split('T')[0],
        preferredTime: 'Morning (10 AM - 1 PM)',
        notes: 'In-Shop Consultation / Fabric Drop for Order ' + orderId,
        status: 'Scheduled'
      });
    }

    db.save();

    res.status(201).json({
      success: true,
      message: 'Shop order logged successfully at Nakshatra Designer\'s!',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// GET /api/orders/track/:code - Track order by ID or phone number
router.get('/track/:code', (req, res) => {
  const code = req.params.code.trim().toLowerCase();
  const found = db.data.orders.filter(o => 
    o.id.toLowerCase() === code || 
    o.phone.replace(/[\s-]/g, '').includes(code.replace(/[\s-]/g, ''))
  );

  if (found.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No active order found for code or phone '${req.params.code}'. Please double check your input.`
    });
  }

  res.json({
    success: true,
    orders: found
  });
});

// GET /api/orders - Admin list all orders
router.get('/', (req, res) => {
  res.json({
    success: true,
    orders: db.data.orders
  });
});

// PATCH /api/orders/:id/status - Update order stitching stage (Admin)
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = db.data.orders.find(o => o.id.toLowerCase() === id.toLowerCase());
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  const validStatuses = [
    'Shop Order Placed',
    'Fabric Received at Shop',
    'Master Pattern Cutting',
    'Aari / Embroidery Handwork',
    'Stitching & Flare Assembly',
    'Fitting & Quality Check',
    'Ready for In-Shop Trial / Pickup',
    'Delivered / Completed'
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status provided.'
    });
  }

  order.status = status;
  db.save();

  res.json({
    success: true,
    message: `Order ${id} status updated to ${status}`,
    order
  });
});

export default router;
