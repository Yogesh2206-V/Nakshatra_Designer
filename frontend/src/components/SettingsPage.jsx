import React, { useState } from 'react';
import { User, FileText, Settings, Moon, Bell, Shield, HelpCircle, ChevronRight, LogIn, LogOut, CheckCircle, Smartphone, ShieldCheck, Upload, Sparkles } from 'lucide-react';
import { isExactAdmin } from '../utils/adminAuth';

export default function SettingsPage({ currentUser, onOpenAuth, onOpenProfileModal, onLogout, onNavigate, darkMode, onToggleDarkMode }) {
  const [notifications, setNotifications] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'privacy', 'terms', 'help', 'profile'

  return (
    <div className="section-container" style={{ maxWidth: '850px', paddingBottom: '6rem' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
          Settings & Account
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Manage your Nakshatra profile, preferences, order notifications, and boutique policies.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* ADMIN SECTION (Strictly visible ONLY to Specific Admin: Nakshatradesign / 9123500065) */}
        {isExactAdmin(currentUser) && (
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#d97706" /> Administrator Studio
            </h4>

            <div style={{ background: '#ffffff', borderRadius: '14px', border: '2px solid #d97706', overflow: 'hidden', boxShadow: '0 4px 15px rgba(217, 119, 6, 0.15)' }}>
              <div 
                onClick={() => onNavigate && onNavigate('admin')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1.4rem', cursor: 'pointer', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(180, 83, 9, 0.04) 100%)', transition: 'background 0.2s ease' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(217, 119, 6, 0.15)'}
                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(180, 83, 9, 0.04) 100%)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 46,
                    height: 46,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)'
                  }}>
                    <Upload size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '1.02rem', color: '#b45309', display: 'block' }}>
                        👑 Admin Design Upload & Catalog Studio
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      Upload custom design photos, edit categories, manage live catalog & track customer orders
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.3rem 0.7rem', background: '#d97706', color: '#ffffff', borderRadius: '20px' }}>
                    Open Studio
                  </span>
                  <ChevronRight size={18} color="#d97706" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: ACCOUNT */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
            Account
          </h4>

          <div style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            
            {/* Edit Profile */}
            <div 
              onClick={() => currentUser ? (onOpenProfileModal ? onOpenProfileModal() : setActiveModal('profile')) : onOpenAuth()}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.4rem', cursor: 'pointer', transition: 'background 0.2s ease' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-champagne)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0b2b26 0%, #164e43 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  overflow: 'hidden',
                  border: '1.5px solid var(--accent-gold)',
                  flexShrink: 0
                }}>
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-dark)', display: 'block' }}>
                    {currentUser ? 'Client Profile & Photo' : 'Sign Up / Log In'}
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {currentUser ? `${currentUser.name} (${currentUser.phone || currentUser.email || 'Client Profile'})` : 'Create account to save measurements & preferences'}
                  </span>
                </div>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

          </div>
        </div>

        {/* SECTION 2: PREFERENCES */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
            Preferences
          </h4>

          <div style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            
            {/* Dark Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.4rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-emerald)' }}>
                  <Moon size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-dark)', display: 'block' }}>Dark Mode Theme</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Switch to dark visual style</span>
                </div>
              </div>
              
              {/* Custom Switch Toggle */}
              <button
                onClick={onToggleDarkMode}
                aria-label="Toggle Dark Mode"
                style={{
                  width: '48px',
                  height: '26px',
                  borderRadius: '13px',
                  background: darkMode ? '#10b981' : '#cbd5e1',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  padding: 0
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: '2px',
                  left: darkMode ? '24px' : '2px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>

            {/* Push / WhatsApp Notifications Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#faf6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-emerald)' }}>
                  <Bell size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-dark)', display: 'block' }}>WhatsApp Order Updates</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Receive SMS & WhatsApp notifications for trial & pickup</span>
                </div>
              </div>

              <button
                onClick={() => setNotifications(!notifications)}
                style={{
                  width: '48px',
                  height: '26px',
                  borderRadius: '13px',
                  background: notifications ? 'var(--primary-emerald)' : '#cbd5e1',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  padding: 0
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: '2px',
                  left: notifications ? '24px' : '2px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>

          </div>
        </div>

        {/* SECTION 3: LEGAL & SUPPORT */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
            Legal & Support
          </h4>

          <div style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            
            {/* Privacy Policy */}
            <div 
              onClick={() => setActiveModal('privacy')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.4rem', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background 0.2s ease' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-champagne)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-emerald)' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-dark)', display: 'block' }}>Privacy Policy</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>How we safeguard your measurements & contact data</span>
                </div>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            {/* Terms & Conditions */}
            <div 
              onClick={() => setActiveModal('terms')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.4rem', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background 0.2s ease' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-champagne)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-emerald)' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-dark)', display: 'block' }}>Terms & Conditions</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tailoring trial, alteration policy & delivery timelines</span>
                </div>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            {/* Help & Support */}
            <div 
              onClick={() => setActiveModal('help')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.4rem', cursor: 'pointer', transition: 'background 0.2s ease' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-champagne)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-emerald)' }}>
                  <HelpCircle size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-dark)', display: 'block' }}>Help & Support</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Contact boutique studio in Tiruchengode</span>
                </div>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

          </div>
        </div>

        {/* SECTION 4: BIG ACTION BUTTON (LOG IN / LOG OUT) */}
        <div>
          {currentUser ? (
            <button
              onClick={onLogout}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                background: '#4a0e17',
                color: '#ffffff',
                border: 'none',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 14px rgba(74, 14, 23, 0.25)',
                transition: 'transform 0.2s ease'
              }}
            >
              <LogOut size={20} /> Log Out ({currentUser.name})
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                background: '#4a0e17',
                color: '#ffffff',
                border: 'none',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 14px rgba(74, 14, 23, 0.25)',
                transition: 'transform 0.2s ease'
              }}
            >
              <LogIn size={20} /> Log In / Sign Up
            </button>
          )}
        </div>

      </div>

      {/* Policy Modals */}
      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', background: '#ffffff', padding: '2rem', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)' }}>
                {activeModal === 'privacy' && 'Nakshatra Privacy Policy'}
                {activeModal === 'terms' && 'Tailoring Terms & Conditions'}
                {activeModal === 'help' && 'Boutique Help & Support'}
                {activeModal === 'profile' && 'User Account Profile'}
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                ✕
              </button>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.6 }}>
              {activeModal === 'privacy' && (
                <div>
                  <p>At <strong>Nakshatra Designer's</strong>, we protect your personal information and body measurements with strict privacy controls.</p>
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.8rem' }}>
                    <li>Your body measurements and contact details are stored securely for tailor reference only.</li>
                    <li>We never share or sell your phone number or design preferences to third parties.</li>
                    <li>WhatsApp order notifications are sent exclusively for fitting & order status updates.</li>
                  </ul>
                </div>
              )}

              {activeModal === 'terms' && (
                <div>
                  <p><strong>Nakshatra Tailoring Policy:</strong></p>
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.8rem' }}>
                    <li><strong>Fit Guarantee:</strong> Free fitting trial and minor re-alterations within 7 days of delivery.</li>
                    <li><strong>Emergency Orders:</strong> Express 24-hour Aari & blouse stitching available upon request.</li>
                    <li><strong>Saree Conversion:</strong> Saree reuse into frocks is executed with zero fabric wastage.</li>
                  </ul>
                </div>
              )}

              {activeModal === 'help' && (
                <div>
                  <p><strong>Visit or Call Our Studio:</strong></p>
                  <p style={{ margin: '0.8rem 0' }}>
                    📍 <strong>Address:</strong> No 62/2, Everest Balaji Arcade, South Car Street (Opp. Sivakumar Metal Mart), Tiruchengode West, Tiruchengode - 637211<br />
                    📞 <strong>Call:</strong> +91 91235 00065 | <strong>WhatsApp:</strong> +91 91235 14214<br />
                    ⏰ <strong>Hours:</strong> Mon – Sat: 9:30 AM – 8:00 PM | Sun: 11:00 AM – 2:00 PM
                  </p>
                </div>
              )}

              {activeModal === 'profile' && currentUser && (
                <div>
                  <div style={{ background: '#faf6f0', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                    <p><strong>Name:</strong> {currentUser.name}</p>
                    <p><strong>Phone:</strong> {currentUser.phone || '+91 94432 73993'}</p>
                    <p><strong>Account Status:</strong> Verified Client</p>
                  </div>
                </div>
              )}
            </div>

            <button className="btn-emerald" style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem' }} onClick={() => setActiveModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
