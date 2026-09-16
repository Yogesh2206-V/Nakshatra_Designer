import React from 'react';
import { MapPin, Phone, Clock, Star, Instagram, ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ background: 'var(--primary-emerald)', color: '#ffffff', paddingTop: '3rem', paddingBottom: '2rem', marginTop: '4rem', borderTop: '4px solid var(--accent-gold)' }}>
      <div className="section-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Column 1: Shop Bio */}
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-gold)', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
              Nakshatra Designer's
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              Established in 2000 (25+ Years Experience). Tiruchengode's top-rated boutique for custom saree blouses, designer frocks, saree-to-frock conversions, saree pre-pleating & Aari work.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="gold-badge">
                <Star size={14} fill="#d4af37" color="#d4af37" /> 4.9 Rating (Justdial - 28+ Reviews)
              </span>
            </div>
          </div>

          {/* Column 2: Contact & Location */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem' }}>Studio Location</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', gap: '0.7rem' }}>
                <MapPin size={20} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  No 62/2, Everest Balaji Arcade, South Car Street, Tiruchengode West, Tiruchengode - 637211<br />
                  <small style={{ color: '#94a3b8' }}>(Opp. Sivakumar Metal Mart, Near Town Police Station)</small>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <span>Call: +91 91235 00065 | WhatsApp: +91 91235 14214</span>
              </div>

              <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                <Clock size={18} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <span>Mon – Sat: 9:30 AM – 8:00 PM | Sun: 11:00 AM – 2:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 3: Customization Services */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem' }}>Boutique Tailoring Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('gallery')}>• Custom Saree Blouse & Aari Stitching</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('gallery')}>• Designer Frock & Gown Tailoring</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('gallery')}>• Saree-to-Frock Conversion (Saree Reuse)</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('gallery')}>• Saree Pre-Pleating & Box Folding</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('gallery')}>• Saree Tassels & Kuchu Work</li>
            </ul>
          </div>

          {/* Column 4: Guarantees */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem' }}>Nakshatra Fit Guarantee</h4>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '0.4rem' }}>
                <ShieldCheck size={18} /> 100% Perfect Fit Promise
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Send us your best-fitting blouse or enter measurements digitally. Free re-alterations if the fit is not 100% perfect!
              </p>
            </div>
          </div>

        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', marginBottom: '1.5rem' }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', gap: '0.8rem' }}>
          <p>© {new Date().getFullYear()} Nakshatra Designer's. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a 
              href="https://whatsapp.com/channel/0029VbAFcOK59PwTbzi8m610" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#25D366', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
            >
              💥 WhatsApp Channel: NAKSHATRA DESIGNER'S
            </a>
            <span>Instagram: @nakshatra_designers_2101</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
