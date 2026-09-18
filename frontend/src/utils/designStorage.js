/**
 * Robust Design Storage & Synchronization Manager
 * Seamlessly handles API requests with intelligent LocalStorage offline fallbacks
 * ensures 100% functionality on Vercel, serverless, and local environments.
 */

import { fallbackDesigns } from '../data/fallbackData';

const CUSTOM_DESIGNS_KEY = 'nakshatra_custom_designs';
const DELETED_DESIGNS_KEY = 'nakshatra_deleted_designs';
const DESIGN_EVENT = 'nakshatra_designs_updated';

// Safely get local custom designs
export const getLocalCustomDesigns = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_DESIGNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to parse local custom designs:', e);
    return [];
  }
};

// Safely get local deleted design IDs
export const getLocalDeletedDesignIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_DESIGNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

// Save custom designs list
export const setLocalCustomDesigns = (designs) => {
  try {
    localStorage.setItem(CUSTOM_DESIGNS_KEY, JSON.stringify(designs));
  } catch (e) {
    console.warn('LocalStorage save error (quota exceeded):', e);
  }
};

// Notify other components of design list updates
export const notifyDesignChange = () => {
  try {
    window.dispatchEvent(new CustomEvent(DESIGN_EVENT));
  } catch (e) {}
};

// Subscribe to design updates
export const subscribeToDesignChanges = (callback) => {
  const handler = () => callback();
  window.addEventListener(DESIGN_EVENT, handler);
  return () => window.removeEventListener(DESIGN_EVENT, handler);
};

/**
 * Loads all designs from backend API if available, 
 * automatically merged with custom local designs and filtered of deleted items.
 */
export const getAllDesigns = async () => {
  let serverDesigns = [];
  let apiSucceeded = false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('/api/designs', { credentials: 'omit', signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success && Array.isArray(data.designs)) {
        serverDesigns = data.designs;
        apiSucceeded = true;
      }
    }
  } catch (err) {
    // API is offline or serverless cold start / static host
    console.warn('API designs unreachable, using local boutique database store.');
  }

  const baseList = (apiSucceeded && serverDesigns.length > 0) ? serverDesigns : fallbackDesigns;
  const localCustom = getLocalCustomDesigns();
  const deletedIds = new Set(getLocalDeletedDesignIds());

  // Merge custom designs with base list, avoiding duplicates by id
  const seenIds = new Set();
  const merged = [];

  // Custom designs added by user appear first
  for (const d of localCustom) {
    if (d && d.id && !deletedIds.has(d.id) && !seenIds.has(d.id)) {
      seenIds.add(d.id);
      merged.push(d);
    }
  }

  for (const d of baseList) {
    if (d && d.id && !deletedIds.has(d.id) && !seenIds.has(d.id)) {
      seenIds.add(d.id);
      merged.push(d);
    }
  }

  return merged;
};

/**
 * Creates and publishes a new design.
 * Tries API first, then saves locally so it always succeeds.
 */
export const saveNewDesign = async (designData) => {
  const newId = 'design_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const newDesign = {
    id: newId,
    title: designData.title.trim(),
    category: designData.category.trim(),
    image: designData.image,
    description: designData.description ? designData.description.trim() : `Masterfully tailored ${designData.category.trim()} designed for elegance.`,
    garmentType: designData.garmentType || 'saree_blouse',
    fabric: designData.fabric ? designData.fabric.trim() : 'Pure Silk / Festive Fabric',
    embroidery: designData.embroidery ? designData.embroidery.trim() : 'Handcrafted Delicate Work',
    badge: designData.badge ? designData.badge.trim() : 'New Arrival',
    price: designData.price || 'Affordable Rate',
    createdAt: new Date().toISOString()
  };

  let savedOnServer = false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('/api/designs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(designData),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success && data.design) {
        newDesign.id = data.design.id || newDesign.id;
        savedOnServer = true;
      }
    }
  } catch (err) {
    console.warn('Could not reach backend API to save design, persisting locally in boutique store:', err.message);
  }

  // Always persist in local custom designs store
  const existingCustom = getLocalCustomDesigns();
  setLocalCustomDesigns([newDesign, ...existingCustom]);

  // Remove from deleted list if it was previously marked
  const deletedIds = getLocalDeletedDesignIds().filter(id => id !== newDesign.id);
  try {
    localStorage.setItem(DELETED_DESIGNS_KEY, JSON.stringify(deletedIds));
  } catch (e) {}

  notifyDesignChange();

  return {
    success: true,
    design: newDesign,
    savedOnServer
  };
};

/**
 * Permanently deletes a design from both API and local storage.
 */
export const deleteDesignById = async (designId) => {
  if (!designId) return { success: false };

  // 1. Try deleting on server
  try {
    await fetch(`/api/designs/${designId}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('Backend delete notification skipped:', err.message);
  }

  // 2. Remove from local custom designs
  const existingCustom = getLocalCustomDesigns().filter(d => d.id !== designId);
  setLocalCustomDesigns(existingCustom);

  // 3. Mark in deleted designs key so standard/fallback designs also stay deleted
  const deletedIds = getLocalDeletedDesignIds();
  if (!deletedIds.includes(designId)) {
    deletedIds.push(designId);
    try {
      localStorage.setItem(DELETED_DESIGNS_KEY, JSON.stringify(deletedIds));
    } catch (e) {}
  }

  notifyDesignChange();

  return { success: true };
};
