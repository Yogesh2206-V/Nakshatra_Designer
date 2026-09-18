import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldCheck, 
  Upload, 
  PlusCircle, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  Tag, 
  Layers, 
  Scissors, 
  RefreshCw,
  Eye,
  Star,
  Search,
  Check,
  AlertCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { compressImage } from '../utils/avatarStorage';
import { isExactAdmin } from '../utils/adminAuth';
import { 
  getAllDesigns, 
  saveNewDesign, 
  deleteDesignById, 
  subscribeToDesignChanges 
} from '../utils/designStorage';

export default function AdminDashboard({ currentUser, onOpenEnquiry, onNavigateToGallery }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'manage'

  // Warning Modal State for Deleting a Design
  const [designToDelete, setDesignToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Full View Image Lightbox Modal State
  const [fullViewDesign, setFullViewDesign] = useState(null);

  // Form State for Adding New Design
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Blouses');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [garmentType, setGarmentType] = useState('saree_blouse');
  const [fabric, setFabric] = useState('Pure Kanjivaram Silk');
  const [embroidery, setEmbroidery] = useState('Handcrafted Aari & Zardozi');
  const [badge, setBadge] = useState('New Arrival');
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Catalog Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('All');

  const fileInputRef = useRef(null);

  // Fetch designs (hybrid server + local boutique storage)
  const refreshData = async () => {
    setLoading(true);
    try {
      const list = await getAllDesigns();
      setDesigns(list || []);
    } catch (err) {
      console.error('Error fetching admin designs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeToDesignChanges(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  // Handle local image file upload & compression
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (JPEG, PNG, WEBP).');
      return;
    }

    try {
      // Compress to high quality web standard
      const compressedDataUrl = await compressImage(file, 900, 0.90);
      setImagePreview(compressedDataUrl);
      setErrorMessage('');
    } catch (err) {
      console.error('Image compression error:', err);
      // Fallback to basic file reader
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Form submit handler with guaranteed save fallback
  const handleCreateDesign = async (e) => {
    e.preventDefault();
    if (!imagePreview) {
      setErrorMessage('Please upload or select an image for this design.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Please enter a design title.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const finalCategory = category === 'Other' ? (customCategory.trim() || 'Custom') : category;

    try {
      const payload = {
        title: title.trim(),
        category: finalCategory,
        image: imagePreview,
        description: description.trim() || `Masterfully tailored ${finalCategory} designed for elegance and precision fit.`,
        garmentType,
        fabric: fabric.trim() || 'Pure Silk / Festive Fabric',
        embroidery: embroidery.trim() || 'Handcrafted Delicate Work',
        badge: badge.trim() || 'New Arrival',
        price: 'Affordable Rate'
      };

      const result = await saveNewDesign(payload);

      if (result.success) {
        setSuccessMessage(`✨ Design "${title}" published successfully to the Boutique Lookbook!`);
        // Reset form
        setTitle('');
        setDescription('');
        setImagePreview('');
        setCustomCategory('');
        await refreshData();
        setTimeout(() => setSuccessMessage(''), 6000);
      } else {
        setErrorMessage('Failed to add design.');
      }
    } catch (err) {
      console.error('Error creating design:', err);
      setErrorMessage('Could not save design. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete design handler with Warning Confirmation Modal
  const promptDeleteDesign = (design) => {
    setDesignToDelete(design);
  };

  // Confirmed Delete execution
  const handleConfirmDelete = async () => {
    if (!designToDelete) return;
    setIsDeleting(true);

    try {
      await deleteDesignById(designToDelete.id);
      setDesigns(prev => prev.filter(d => d.id !== designToDelete.id));
      setSuccessMessage(`✨ Design "${designToDelete.title}" was permanently removed from the catalog.`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Error deleting design:', err);
      alert('Error deleting design.');
    } finally {
      setIsDeleting(false);
      setDesignToDelete(null);
    }
  };

  const filteredDesigns = designs.filter(d => {
    const matchesCategory = selectedFilterCategory === 'All' || d.category === selectedFilterCategory;
    const matchesQuery = !searchQuery.trim() || 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (d.category && d.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.fabric && d.fabric.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  // Strict check: if not the specific authorized admin, render restricted notice
  if (!isExactAdmin(currentUser)) {
    return (
      <div className="section-container" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <div className="glass-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem' }}>
          <ShieldCheck size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', color: '#991b1b', marginBottom: '0.5rem' }}>
            Admin Access Restricted
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            This page and design upload studio is strictly reserved for the authorized Nakshatra administrator (Nakshatradesign / 9123500065).
          </p>
          <button 
            className="btn-gold"
            onClick={onNavigateToGallery}
          >
            Return to Boutique Lookbook
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container animate-fade-in" style={{ paddingBottom: '6rem' }}>
      
      {/* Admin Top Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0b2b26 0%, #164e43 60%, #4a0e17 100%)',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 12px 35px rgba(11, 43, 38, 0.25)',
        border: '1.5px solid var(--accent-gold)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.2rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span className="gold-badge" style={{ background: '#d4af37', color: '#0b2b26', fontWeight: 700 }}>
                <ShieldCheck size={14} /> Master Tailor Administrator
              </span>
              <span style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: 600 }}>
                ● Full Catalog Access
              </span>
            </div>
            
            <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#ffffff', marginBottom: '0.4rem' }}>
              Nakshatra Admin Studio
            </h1>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', maxWidth: '650px' }}>
              Upload and manage your boutique collection designs, edit photos, and update the live catalog.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
              Logged-in Admin Account
            </div>
            <strong style={{ fontSize: '1rem', color: '#ffffff', display: 'block' }}>
              {currentUser?.name || 'Nakshatradesign'}
            </strong>
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              📞 +91 91235 00065
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          marginTop: '1.8rem',
          paddingTop: '1.4rem',
          borderTop: '1px solid rgba(255,255,255,0.15)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {designs.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Catalog Designs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6ee7b7' }}>
              {designs.filter(d => d.category === 'Blouses' || d.category === 'Bridal Aari').length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Blouse & Aari</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbcfe8' }}>
              {designs.filter(d => d.category === 'Frocks').length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Frocks & Gowns</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fde047' }}>
              {designs.filter(d => d.category === 'Lehenga' || d.category === 'Skirt Shirt' || d.category === 'Chudithar').length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Ethnic & Sets</div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('upload')}
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.92rem', padding: '0.6rem 1.3rem' }}
        >
          <PlusCircle size={17} /> Upload New Design
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.92rem', padding: '0.6rem 1.3rem' }}
        >
          <Layers size={17} /> Manage Catalog ({designs.length})
        </button>

        <button
          onClick={refreshData}
          title="Refresh Data"
          className="btn-outline"
          style={{ marginLeft: 'auto', padding: '0.5rem 0.9rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: UPLOAD NEW DESIGN FORM                            */}
      {/* ======================================================== */}
      {activeTab === 'upload' && (
        <div className="glass-card" style={{ padding: '2.2rem', borderRadius: '18px' }}>
          
          <div style={{ marginBottom: '1.8rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
            <span className="gold-badge" style={{ marginBottom: '0.4rem' }}>
              <Sparkles size={14} /> Catalog Creator
            </span>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)' }}>
              Add & Upload Design Photo
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Upload any dress, blouse, or gown image directly from your device. It will automatically be displayed in the Boutique Lookbook and 3D Coverflow showcase for all customers.
            </p>
          </div>

          {/* Success & Error Banners */}
          {successMessage && (
            <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', color: '#065f46', padding: '1rem 1.2rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
              <CheckCircle2 size={20} color="#10b981" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div style={{ background: '#fef2f2', border: '1.5px solid #ef4444', color: '#991b1b', padding: '1rem 1.2rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
              <AlertCircle size={20} color="#ef4444" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleCreateDesign}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Left Column: Image Upload & Preview */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: 'var(--primary-emerald)', marginBottom: '0.5rem' }}>
                  Design Image Photo *
                </label>

                {/* Upload Trigger Container */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed var(--accent-gold)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: 'var(--bg-champagne)',
                    cursor: 'pointer',
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.8rem',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.18)'}
                  onMouseOut={e => e.currentTarget.style.background = 'var(--bg-champagne)'}
                >
                  {imagePreview ? (
                    <div style={{ width: '100%', position: 'relative' }}>
                      <img 
                        src={imagePreview} 
                        alt="Design Preview" 
                        style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} 
                      />
                      <div style={{ marginTop: '0.6rem', fontSize: '0.82rem', color: 'var(--primary-emerald)', fontWeight: 600 }}>
                        Click anywhere to change / replace image
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
                        <Upload size={28} />
                      </div>
                      <strong style={{ fontSize: '1rem', color: 'var(--primary-emerald)' }}>
                        Choose Photo from Device / Camera
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '260px' }}>
                        Supports JPEG, PNG, WEBP. Automatically optimized for high resolution display.
                      </span>
                    </>
                  )}
                </div>

                {/* Or paste Image URL */}
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Or paste Image URL directly:
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/dress.jpg"
                    value={imagePreview && !imagePreview.startsWith('data:') ? imagePreview : ''}
                    onChange={(e) => setImagePreview(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Right Column: Design Attributes & Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                
                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-emerald)', marginBottom: '0.3rem' }}>
                    Design Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal South Indian Bridal Velvet Aari Blouse"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.92rem' }}
                  />
                </div>

                {/* Category Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-emerald)', marginBottom: '0.3rem' }}>
                      Collection Category *
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.9rem', background: '#ffffff' }}
                    >
                      <option value="Blouses">Blouses</option>
                      <option value="Bridal Aari">Bridal Aari</option>
                      <option value="Frocks">Frocks & Long Gowns</option>
                      <option value="Saree Pre-Pleating">Saree Pre-Pleating</option>
                      <option value="Skirt Shirt">Skirt Shirt & Ethnic</option>
                      <option value="Chudithar">Chudithar & Salwar</option>
                      <option value="Lehenga">Lehenga Choli</option>
                      <option value="Saree-to-Frock Conversion">Saree-to-Frock (Reuse)</option>
                      <option value="Other">+ Add Custom Category</option>
                    </select>
                  </div>

                  {/* Highlight Badge */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-emerald)', marginBottom: '0.3rem' }}>
                      Catalog Badge Tag
                    </label>
                    <select
                      value={badge}
                      onChange={e => setBadge(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.9rem', background: '#ffffff' }}
                    >
                      <option value="New Arrival">New Arrival</option>
                      <option value="Trending 2026">Trending 2026</option>
                      <option value="Bridal Favorite">Bridal Favorite</option>
                      <option value="Masterpiece">Masterpiece</option>
                      <option value="Must Have">Must Have</option>
                      <option value="Pure Silk">Pure Silk</option>
                    </select>
                  </div>
                </div>

                {/* Custom Category Input if 'Other' selected */}
                {category === 'Other' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-emerald)', marginBottom: '0.3rem' }}>
                      Custom Category Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kids Festive Wear / Tassels"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }}
                    />
                  </div>
                )}

                {/* Fabric & Embroidery */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-emerald)', marginBottom: '0.3rem' }}>
                      Recommended Fabric
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kanjivaram Silk, Raw Silk, Velvet"
                      value={fabric}
                      onChange={e => setFabric(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-emerald)', marginBottom: '0.3rem' }}>
                      Embroidery / Handwork
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fine Zardozi, Maggam Beads"
                      value={embroidery}
                      onChange={e => setEmbroidery(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-emerald)', marginBottom: '0.3rem' }}>
                    Design Description & Craftsmanship Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe tailoring options, neck cut, lining, fitting and suitability..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                {/* Submit Action */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ flex: 1, padding: '0.9rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    disabled={isSubmitting}
                  >
                    <Sparkles size={18} /> {isSubmitting ? 'Uploading & Publishing...' : 'Publish to Lookbook Catalog →'}
                  </button>

                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      setTitle('');
                      setDescription('');
                      setImagePreview('');
                    }}
                    style={{ padding: '0.9rem 1.2rem' }}
                  >
                    Clear
                  </button>
                </div>

              </div>

            </div>
          </form>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MANAGE LIVE CATALOG                               */}
      {/* ======================================================== */}
      {activeTab === 'manage' && (
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '18px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)' }}>
                Live Catalog Designs ({filteredDesigns.length})
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                View all published designs currently active on the customer website.
              </p>
            </div>

            {/* Search and Filters */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ padding: '0.55rem 0.8rem 0.55rem 2rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.85rem', outline: 'none', width: '180px' }}
                />
              </div>

              <select
                value={selectedFilterCategory}
                onChange={e => setSelectedFilterCategory(e.target.value)}
                style={{ padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.85rem', outline: 'none', background: '#ffffff' }}
              >
                <option value="All">All Categories</option>
                <option value="Blouses">Blouses</option>
                <option value="Bridal Aari">Bridal Aari</option>
                <option value="Frocks">Frocks</option>
                <option value="Saree Pre-Pleating">Saree Pre-Pleating</option>
                <option value="Skirt Shirt">Skirt Shirt</option>
                <option value="Chudithar">Chudithar</option>
                <option value="Lehenga">Lehenga</option>
              </select>
            </div>
          </div>

          {/* Designs Grid */}
          {filteredDesigns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No designs found matching your search.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.4rem' }}>
              {filteredDesigns.map(design => (
                <div 
                  key={design.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={design.image} 
                      alt={design.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                      onClick={() => setFullViewDesign(design)}
                      title="Click to view full image"
                    />

                    {/* Full View Button at Top-Left of Image */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFullViewDesign(design); }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: 'rgba(11, 43, 38, 0.9)',
                        color: '#ffffff',
                        border: '1px solid var(--accent-gold)',
                        padding: '0.22rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        transition: 'all 0.2s ease',
                        zIndex: 2
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-gold)'; e.currentTarget.style.color = '#000'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'rgba(11, 43, 38, 0.9)'; e.currentTarget.style.color = '#ffffff'; }}
                      title="Click to open Full View"
                    >
                      <Eye size={12} /> Full View
                    </button>

                    <span className="gold-badge" style={{ position: 'absolute', top: 8, right: 8, fontSize: '0.7rem' }}>
                      {design.category}
                    </span>
                    {design.badge && (
                      <span style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(11, 43, 38, 0.85)', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                        ★ {design.badge}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', color: 'var(--primary-emerald)', fontWeight: 700, marginBottom: '0.3rem', lineHeight: 1.3 }}>
                        {design.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.8rem' }}>
                        {design.description ? design.description.substring(0, 75) + '...' : ''}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        🧵 {design.fabric || 'Silk'}
                      </span>
                      
                      <button
                        onClick={() => promptDeleteDesign(design)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        title="Delete from Catalog"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* WARNING CONFIRMATION MODAL BEFORE DELETION              */}
      {/* ======================================================== */}
      {designToDelete && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => !isDeleting && setDesignToDelete(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.2rem'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="animate-scale-in"
            style={{
              width: '100%',
              maxWidth: '490px',
              background: '#ffffff',
              borderRadius: '18px',
              padding: '2.2rem',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
              border: '2.5px solid #dc2626',
              position: 'relative',
              zIndex: 1000000,
              color: '#0f172a'
            }}
          >
            {/* Close modal X button */}
            <button
              type="button"
              onClick={() => setDesignToDelete(null)}
              disabled={isDeleting}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
              onMouseOut={e => e.currentTarget.style.background = '#f1f5f9'}
              title="Close without deleting"
            >
              <X size={18} />
            </button>

            {/* Warning Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem auto',
                border: '3px solid #fecaca',
                boxShadow: '0 0 25px rgba(220, 38, 38, 0.3)'
              }}>
                <AlertTriangle size={38} />
              </div>

              <h3 style={{ fontSize: '1.5rem', color: '#991b1b', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                ⚠️ Are you sure to delete?
              </h3>
              <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.5 }}>
                Are you sure to delete this design? If you press <strong>"No"</strong>, it will <strong>NOT</strong> get deleted. If you press <strong>"Yes"</strong>, it will be permanently deleted from the catalog.
              </p>
            </div>

            {/* Design Preview Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '12px',
              border: '1.5px solid #e2e8f0',
              marginBottom: '1.6rem'
            }}>
              <div style={{ width: 72, height: 72, borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #cbd5e1' }}>
                <img
                  src={designToDelete.image}
                  alt={designToDelete.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.2rem' }}>
                  {designToDelete.title}
                </strong>
                <span style={{ fontSize: '0.84rem', color: '#b45309', fontWeight: 700, display: 'block' }}>
                  📂 Collection: {designToDelete.category}
                </span>
                {designToDelete.fabric && (
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginTop: '0.15rem' }}>
                    🧵 Fabric: {designToDelete.fabric}
                  </span>
                )}
              </div>
            </div>

            {/* Yes / No Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* NO BUTTON: Cancels without deleting */}
              <button
                type="button"
                onClick={() => setDesignToDelete(null)}
                disabled={isDeleting}
                className="btn-outline"
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  borderColor: '#94a3b8',
                  color: '#1e293b',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  borderRadius: '10px'
                }}
              >
                ✖ No (Keep Design)
              </button>

              {/* YES BUTTON: Confirms and executes delete */}
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
                }}
              >
                <Trash2 size={18} /> {isDeleting ? 'Deleting...' : '✔ Yes (Delete)'}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* FULL VIEW IMAGE LIGHTBOX MODAL                           */}
      {/* ======================================================== */}
      {fullViewDesign && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setFullViewDesign(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '2px solid var(--accent-gold)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.3)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '92vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.2rem 1.6rem',
              borderBottom: '1px solid #e2e8f0',
              background: '#ffffff'
            }}>
              <div>
                <span className="gold-badge" style={{ fontSize: '0.72rem', marginBottom: '0.2rem', display: 'inline-block' }}>
                  {fullViewDesign.category} Collection
                </span>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-emerald)', fontWeight: 800, margin: 0, fontFamily: 'var(--font-serif)' }}>
                  {fullViewDesign.title}
                </h3>
              </div>
              
              <button
                type="button"
                onClick={() => setFullViewDesign(null)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  color: '#334155',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
                title="Close Full View"
              >
                <X size={20} />
              </button>
            </div>

            {/* High-Resolution Full Image */}
            <div style={{ 
              background: '#0b2b26', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '380px', 
              maxHeight: '62vh',
              overflow: 'hidden',
              padding: '0.5rem'
            }}>
              <img 
                src={fullViewDesign.image} 
                alt={fullViewDesign.title} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '60vh', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                  display: 'block' 
                }} 
              />
            </div>

            {/* Modal Details / Footer */}
            <div style={{ padding: '1.2rem 1.6rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                {fullViewDesign.fabric && (
                  <span style={{ fontSize: '0.86rem', color: '#475569', fontWeight: 600 }}>
                    🧵 Fabric: <strong style={{ color: 'var(--primary-emerald)' }}>{fullViewDesign.fabric}</strong>
                  </span>
                )}
                {fullViewDesign.embroidery && (
                  <span style={{ fontSize: '0.86rem', color: '#475569', fontWeight: 600 }}>
                    ✨ Work: <strong style={{ color: 'var(--primary-emerald)' }}>{fullViewDesign.embroidery}</strong>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setFullViewDesign(null)}
                className="btn-gold"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Close Full View
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
