import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Compass, Sparkles, Scissors, Eye, X, PhoneCall, CheckCircle2, Upload, ShieldCheck, PlusCircle } from 'lucide-react';
import EnquiryIcon from './EnquiryIcon';
import { isExactAdmin } from '../utils/adminAuth';
import { fallbackDesigns } from '../data/fallbackData';

export default function DesignGallery({ onSelectPreset, currentUser, onRequireAuth, onOpenEnquiry, onNavigate }) {
  const [designs, setDesigns] = useState(fallbackDesigns);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [selectedDesignModal, setSelectedDesignModal] = useState(null);

  useEffect(() => {
    fetch('/api/designs')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.designs && data.designs.length > 0) {
          setDesigns(data.designs);
        }
      })
      .catch(err => {
        console.warn('API designs offline, using embedded boutique catalog fallback');
      });
  }, []);

  const categories = ['All', 'Blouses', 'Bridal Aari', 'Frocks', 'Saree Pre-Pleating', 'Skirt Shirt', 'Chudithar', 'Lehenga'];

  const filteredDesigns = activeCategory === 'All' 
    ? designs 
    : designs.filter(d => {
        if (activeCategory === 'Blouses') {
          return d.category === 'Blouses' || d.category === 'Bridal Aari';
        }
        if (activeCategory === 'Bridal Aari') {
          return d.category === 'Bridal Aari';
        }
        if (activeCategory === 'Frocks') {
          return d.category === 'Frocks';
        }
        if (activeCategory === 'Saree Pre-Pleating') {
          return d.category === 'Saree Pre-Pleating' || d.garmentType === 'saree_pleating';
        }
        if (activeCategory === 'Skirt Shirt') {
          return d.category === 'Skirt Shirt' || d.garmentType === 'skirt_shirt';
        }
        if (activeCategory === 'Chudithar') {
          return d.category === 'Chudithar' || d.garmentType === 'chudithar' || d.garmentType === 'salwar_kurti';
        }
        if (activeCategory === 'Lehenga') {
          return d.category === 'Lehenga' || d.garmentType === 'lehenga_set' || d.garmentType === 'lehenga';
        }
        return d.category.toLowerCase() === activeCategory.toLowerCase();
      });

  // Directly opens WhatsApp with design specs
  const handleCustomizeOnWhatsApp = (item) => {
    const msg = `Hi Nakshatra Designer's, I want to customize and stitch this design:\n\n✨ *Design:* ${item.title}\n📂 *Collection:* ${item.category}\n🧵 *Fabric:* ${item.fabric || 'Custom Silk / Fabric'}\n🪡 *Embroidery:* ${item.embroidery || 'Aari / Delicate Work'}\n\nPlease let me know the customization options, fitting schedule, and stitching rates!`;
    const url = `https://wa.me/919123514214?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="section-container">
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="gold-badge" style={{ marginBottom: '0.6rem' }}>
          <Compass size={14} /> Nakshatra Designer Lookbook
        </span>
        <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)' }}>
          Designer Blouses, Frocks & Saree Conversions
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0.4rem auto 0 auto' }}>
          Explore our handcrafted bridal Aari work blouses, designer frocks, and repurposed silk saree converted maxi gowns. Click any design to customize it with your own fabric & measurements!
        </p>

        {/* Admin Quick Upload Action (Strictly visible ONLY for Specific Admin) */}
        {isExactAdmin(currentUser) && (
          <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => onNavigate && onNavigate('admin')}
              className="btn-gold animate-bounce-subtle"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                color: '#ffffff',
                border: '1.5px solid #fef08a',
                boxShadow: '0 4px 15px rgba(217, 119, 6, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '30px',
                cursor: 'pointer'
              }}
            >
              <Upload size={17} /> 👑 Admin: Upload & Add New Design Photo
            </button>
          </div>
        )}

        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tab-button ${activeCategory === cat ? 'active' : ''}`}
              style={{ fontSize: '0.88rem', padding: '0.5rem 1.1rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Designs */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading catalog...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.5rem' }}>
          {filteredDesigns.map(item => (
            <div key={item.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Image Container */}
              <div 
                style={{ position: 'relative', height: '260px', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setSelectedDesignModal(item)}
                title="Click to view full image"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                />

                {/* Full View Button at Top-Left of Image */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedDesignModal(item); }}
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'rgba(11, 43, 38, 0.9)',
                    color: '#ffffff',
                    border: '1px solid var(--accent-gold)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backdropFilter: 'blur(6px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s ease',
                    zIndex: 2
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-gold)'; e.currentTarget.style.color = '#000'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(11, 43, 38, 0.9)'; e.currentTarget.style.color = '#ffffff'; }}
                  title="Click to open Full View"
                >
                  <Eye size={14} /> Full View
                </button>

                {item.badge && (
                  <span className="gold-badge" style={{ position: 'absolute', top: 12, right: 12, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                    <Sparkles size={12} /> {item.badge}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {item.category} Collection
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-emerald)', marginTop: '0.2rem', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                    {item.description || `Handcrafted ${item.category} customized for precision fit & elegance.`}
                  </p>
                </div>

                <div>
                  <div className="stitching-rate-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.6rem 0.8rem', background: 'var(--bg-champagne)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stitching Rate</span>
                    <button
                      className="btn-outline"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderColor: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      onClick={(e) => { e.stopPropagation(); onOpenEnquiry && onOpenEnquiry(item.title); }}
                    >
                      <EnquiryIcon size={16} /> Enquire
                    </button>
                  </div>

                  {/* View Design Button with Gold Luxury Theme */}
                  <button
                    className="btn-gold"
                    style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    onClick={() => setSelectedDesignModal(item)}
                    title="View Design Details & Photos"
                  >
                    <Eye size={17} /> Full View & Details
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Quick View Design Details Modal rendered via Portal */}
      {selectedDesignModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setSelectedDesignModal(null)}
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
              borderRadius: '24px',
              border: '2px solid var(--accent-gold)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.3)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '1.8rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedDesignModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
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
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
              title="Close Full View"
            >
              <X size={20} />
            </button>

            {/* High Resolution Modal Image Display */}
            <div style={{ 
              background: '#0b2b26', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              marginBottom: '1.4rem', 
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '340px',
              maxHeight: '55vh'
            }}>
              <img
                src={selectedDesignModal.image}
                alt={selectedDesignModal.title}
                style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {/* Modal Content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span className="gold-badge">
                <Sparkles size={12} /> {selectedDesignModal.category} Collection
              </span>
              {selectedDesignModal.badge && (
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                  ★ {selectedDesignModal.badge}
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)', marginBottom: '0.6rem' }}>
              {selectedDesignModal.title}
            </h3>

            <p style={{ fontSize: '0.94rem', color: 'var(--text-dark)', lineHeight: 1.6, marginBottom: '1.4rem', opacity: 0.9 }}>
              {selectedDesignModal.description || 'Custom tailored with premium lining, precision fit trial, and master craftsmanship at our Tiruchengode studio.'}
            </p>

            {/* Fabric & Specs if available */}
            {(selectedDesignModal.fabric || selectedDesignModal.embroidery) && (
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.4rem', padding: '0.8rem 1rem', background: 'var(--bg-champagne)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                {selectedDesignModal.fabric && (
                  <span style={{ fontSize: '0.86rem', color: '#475569' }}>
                    🧵 Fabric: <strong style={{ color: 'var(--primary-emerald)' }}>{selectedDesignModal.fabric}</strong>
                  </span>
                )}
                {selectedDesignModal.embroidery && (
                  <span style={{ fontSize: '0.86rem', color: '#475569' }}>
                    ✨ Embroidery: <strong style={{ color: 'var(--primary-emerald)' }}>{selectedDesignModal.embroidery}</strong>
                  </span>
                )}
              </div>
            )}

            {/* Modal Action Buttons */}
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button
                className="btn-gold"
                style={{ flex: 1, minWidth: '180px', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                onClick={() => {
                  handleCustomizeOnWhatsApp(selectedDesignModal);
                  setSelectedDesignModal(null);
                }}
              >
                <Scissors size={18} /> Customize on WhatsApp
              </button>

              <a
                href="tel:+919123500065"
                className="btn-emerald"
                style={{ flex: 1, minWidth: '160px', padding: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 700 }}
              >
                <PhoneCall size={18} /> Call Studio (+91 9123500065)
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}



