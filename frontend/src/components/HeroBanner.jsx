import React from 'react';
import { Sparkles, Scissors, Truck, Star, ShieldCheck, PhoneCall } from 'lucide-react';
import EnquiryIcon from './EnquiryIcon';

export default function HeroBanner({ onStartCustomize, onOpenEnquiry }) {
  const services = [
    'Custom Saree Blouse',
    'Bridal & Festive Lehenga Choli',
    'Designer Chudithar & Salwar Kurti',
    'Designer Frock / Long Gown',
    'Saree Converted Frock (Saree Reuse)',
    'Skirt Shirt & Kids Ethnic Wear',
    'Saree Pre-Pleating & Box Folding',
    'Neckline Delicate Aari Work'
  ];

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0b2b26 0%, #164e43 50%, #4a0e17 100%)',
      color: '#ffffff',
      padding: '3.5rem 1.5rem 4rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Background Glow Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          {/* Hero Left Content */}
          <div>
            <div className="gold-badge" style={{ marginBottom: '1.2rem' }}>
              <Sparkles size={14} /> Nakshatra Designer's • Est. 2000 (25+ Yrs Excellence)
            </div>

            <h1 style={{ fontSize: '2.8rem', fontWeight: 700, lineHeight: 1.15, marginBottom: '1.2rem', fontFamily: 'var(--font-serif)' }}>
              Custom <span style={{ color: 'var(--accent-gold)' }}>Blouse, Frocks</span> & Saree-to-Frock Conversions
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '1.8rem' }}>
              Visit our boutique shop in Tiruchengode West (Opp. Sivakumar Metal Mart) for precision custom tailoring! We specialize in bridal saree blouses, designer frocks, saree pre-pleating, and converting your silk sarees into modern maxi gowns.
            </p>

            {/* Hero Action CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button 
                className="btn-gold"
                onClick={onStartCustomize}
                style={{ padding: '0.85rem 1.6rem', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)' }}
              >
                <Sparkles size={18} /> Explore Lookbook Designs
              </button>

              <button
                className="btn-outline"
                onClick={() => onOpenEnquiry && onOpenEnquiry('Boutique Fitting & Rate Consultation')}
                style={{ padding: '0.85rem 1.4rem', fontSize: '0.95rem', borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff', background: 'rgba(255,255,255,0.08)' }}
              >
                <EnquiryIcon size={18} /> Enquire Rates
              </button>
            </div>

            {/* Key Trust Highlights */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <Star size={16} fill="#d4af37" color="#d4af37" />
                <span><strong>4.9 / 5</strong> Justdial Verified (28+ Reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <ShieldCheck size={16} color="#d4af37" />
                <span>In-Shop Fitting Trial</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <Truck size={16} color="#d4af37" />
                <span>Saree Pre-Pleating & Reuse</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div>
            <div className="glass-card" style={{ padding: '1.8rem', background: 'rgba(255, 255, 255, 0.95)', color: 'var(--text-dark)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-emerald)' }}>Boutique Tailoring Rates</h3>
                <span className="gold-badge">Custom Tailoring</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.92rem' }}>
                {services.map(srv => (
                  <div 
                    key={srv} 
                    onClick={() => onOpenEnquiry && onOpenEnquiry(srv)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.45rem 0.6rem', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    title={`Click to enquire about ${srv}`}
                  >
                    <span style={{ fontWeight: 500 }}>{srv}</span>
                    <button
                      className="btn-outline"
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.78rem', borderColor: 'var(--accent-gold)', color: 'var(--primary-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem', pointerEvents: 'none' }}
                    >
                      <EnquiryIcon size={16} /> Enquire
                    </button>
                  </div>
                ))}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.4rem', color: 'var(--primary-emerald)', fontWeight: 700 }}>
                  <span>Shop Timings</span>
                  <span>Mon-Sat 9:30 AM - 8 PM</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn-emerald" 
                  style={{ flex: 1, minWidth: '140px', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => onOpenEnquiry && onOpenEnquiry('Tailoring Rates & Fitting Consultation')}
                >
                  <EnquiryIcon size={20} /> Enquire
                </button>

                <a 
                  href="tel:+919123500065"
                  className="btn-gold" 
                  style={{ flex: 1, minWidth: '180px', padding: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 700 }}
                >
                  <PhoneCall size={18} /> Call Now (+91 91235 00065)
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


