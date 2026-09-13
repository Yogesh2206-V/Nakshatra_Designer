import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET /api/designs - Fetch design gallery
router.get('/', (req, res) => {
  res.json({
    success: true,
    designs: db.data.designs || []
  });
});

// POST /api/designs - Admin upload / add new design
router.post('/', (req, res) => {
  try {
    const {
      title,
      category,
      image,
      description,
      garmentType,
      fabric,
      embroidery,
      badge,
      price
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Design title is required.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }
    if (!image || !image.trim()) {
      return res.status(400).json({ success: false, message: 'Design image is required.' });
    }

    if (!db.data.designs) {
      db.data.designs = [];
    }

    // Determine garmentType default based on category if not explicitly given
    let derivedGarmentType = garmentType;
    if (!derivedGarmentType) {
      const catLower = category.toLowerCase();
      if (catLower.includes('blouse') || catLower.includes('aari')) derivedGarmentType = 'saree_blouse';
      else if (catLower.includes('frock') || catLower.includes('gown') || catLower.includes('dress')) derivedGarmentType = 'designer_frock';
      else if (catLower.includes('lehenga')) derivedGarmentType = 'lehenga_set';
      else if (catLower.includes('skirt')) derivedGarmentType = 'skirt_shirt';
      else if (catLower.includes('chudithar') || catLower.includes('salwar')) derivedGarmentType = 'salwar_kurti';
      else if (catLower.includes('pleat')) derivedGarmentType = 'saree_pleating';
      else derivedGarmentType = 'saree_blouse';
    }

    const newDesign = {
      id: 'design_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      category: category.trim(),
      image: image.trim(),
      description: description ? description.trim() : `Custom tailored ${category.trim()} handcrafted for elegance & perfect fit.`,
      garmentType: derivedGarmentType,
      fabric: fabric ? fabric.trim() : 'Custom Silk / Festive Fabric',
      embroidery: embroidery ? embroidery.trim() : 'Delicate Handwork / Aari',
      badge: badge ? badge.trim() : 'New Arrival',
      price: price || 'Affordable Rate',
      createdAt: new Date().toISOString()
    };

    // Add to top of designs list so it shows immediately
    db.data.designs.unshift(newDesign);
    db.save();

    return res.status(201).json({
      success: true,
      message: 'New design added to catalog successfully!',
      design: newDesign,
      totalDesigns: db.data.designs.length
    });
  } catch (error) {
    console.error('Error adding new design:', error);
    return res.status(500).json({ success: false, message: 'Failed to save design.' });
  }
});

// DELETE /api/designs/:id - Admin delete design
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (!db.data.designs) {
      return res.status(404).json({ success: false, message: 'Design not found.' });
    }

    const initialCount = db.data.designs.length;
    db.data.designs = db.data.designs.filter(d => d.id !== id);

    if (db.data.designs.length === initialCount) {
      return res.status(404).json({ success: false, message: 'Design with given ID not found.' });
    }

    db.save();
    return res.json({
      success: true,
      message: 'Design deleted from catalog successfully.',
      totalDesigns: db.data.designs.length
    });
  } catch (error) {
    console.error('Error deleting design:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete design.' });
  }
});

export default router;
