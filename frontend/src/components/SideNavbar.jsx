import React, { useRef, useState } from 'react';
import { 
  X, User, Camera, Upload, Trash2, Compass, Star, Settings, 
  Moon, Sun, PhoneCall, MessageCircle, LogOut, Scissors, 
  Sparkles, ShieldCheck, MapPin, Clock, ChevronRight, LogIn
} from 'lucide-react';
import { compressAvatarImage, persistUserAvatar, removeUserAvatar } from '../utils/avatarStorage';
import { isExactAdmin } from '../utils/adminAuth';

export default function SideNavbar({ 
  isOpen, 
  onClose, 
  activeTab, 
  onNavigate, 
  currentUser, 
  onUpdateUser, 
  onLogout, 
  onOpenAuth, 
  darkMode, 
  onToggleDarkMode, 
  onOpenEnquiry 
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle local device image file upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const base64Image = await compressAvatarImage(file, 400, 0.88);

      const updatedUser = {
        ...currentUser,
        avatar: base64Image
      };

      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }

      // Persist permanently in local device storage and sync with backend
      await persistUserAvatar(currentUser, base64Image);
    } catch (err) {
      console.error('Error processing profile image:', err);
      alert('Could not process image. Please choose another photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = async () => {
    const updatedUser = {
      ...currentUser,
      avatar: ''
    };
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    await removeUserAvatar(currentUser);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(5px)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      transition: 'all 0.3s ease'
    }}>
      {/* Hidden file input for uploading from local device */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Backdrop click area */}
      <div 
        onClick={onClose} 
        style={{ flex: 1, height: '100%', cursor: 'pointer' }} 
      />

      {/* Slide-out Side Navigation Drawer */}
      <div 
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '380px',
          height: '100%',
          background: 'var(--bg-card)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.4)',
          borderLeft: '2px solid var(--accent-gold)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto',
          zIndex: 10000
        }}
      >
        {/* Top Header of Side Navbar */}
        <div style={{
          padding: '1.2rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-light)',
          background: 'linear-gradient(135deg, #0b2b26 0%, #164e43 100%)',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <Scissors size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-serif)', lineHeight: 1.1, color: '#ffffff' }}>
                Nakshatra Menu
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>
                Designer Studio & Portal
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Card Section */}
        <div style={{ padding: '1.4rem', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-champagne)' }}>
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              
              {/* Avatar Frame with Local Device Upload */}
              <div style={{ position: 'relative', width: '88px', height: '88px', marginBottom: '0.8rem' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #0b2b26 0%, #164e43 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid var(--accent-gold)',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(212,175,55,0.25)',
                    transition: 'transform 0.2s ease',
                    position: 'relative'
                  }}
                  title="Click to choose photo from device"
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ color: '#ffffff', fontSize: '2.2rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User size={38} />}
                    </span>
                  )}

                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(11, 43, 38, 0.75)',
                    padding: '2px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Camera size={13} color="#ffffff" />
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--accent-gold)',
                    color: '#0b2b26',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                  title="Add photo from device"
                >
                  <Camera size={13} />
                </button>
              </div>

              <strong style={{ fontSize: '1.15rem', color: 'var(--text-dark)', lineHeight: 1.2 }}>
                {currentUser.name}
              </strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {currentUser.phone || currentUser.email || 'Verified Member'}
                </span>
                {isExactAdmin(currentUser) && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    background: 'linear-gradient(135deg, #d97706, #b45309)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    👑 Admin
                  </span>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  fontSize: '0.86rem',
                  marginTop: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
                disabled={isUploading}
              >
                <Upload size={15} /> {isUploading ? 'Uploading...' : currentUser.avatar ? 'Change Photo from Device' : 'Add Photo from Device'}
              </button>

              {currentUser.avatar && (
                <button
                  onClick={removeAvatar}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    marginTop: '0.4rem'
                  }}
                >
                  <Trash2 size={12} /> Remove Photo
                </button>
              )}

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '2px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.8rem auto',
                color: 'var(--accent-gold)'
              }}>
                <User size={28} />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
                Welcome to Nakshatra
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
                Sign in to save your blouse specs and manage custom tailoring.
              </p>
              <button
                onClick={() => { onOpenAuth(); onClose(); }}
                className="btn-gold"
                style={{ width: '100%', padding: '0.65rem', fontSize: '0.88rem' }}
              >
                <LogIn size={15} /> Sign Up / Log In
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links List */}
        <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.3rem 0.6rem' }}>
            Navigation
          </span>

          <button
            onClick={() => { onNavigate('gallery'); onClose(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 0.9rem',
              borderRadius: '10px',
              border: activeTab === 'gallery' ? '1.5px solid var(--accent-gold)' : '1px solid transparent',
              background: activeTab === 'gallery' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: 'var(--text-dark)',
              cursor: 'pointer',
              fontSize: '0.92rem',
              fontWeight: 600,
              textAlign: 'left',
              transition: 'background 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Compass size={18} color="var(--accent-gold)" /> Boutique Lookbook
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </button>

          <button
            onClick={() => { onNavigate('reviews'); onClose(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 0.9rem',
              borderRadius: '10px',
              border: activeTab === 'reviews' ? '1.5px solid var(--accent-gold)' : '1px solid transparent',
              background: activeTab === 'reviews' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: 'var(--text-dark)',
              cursor: 'pointer',
              fontSize: '0.92rem',
              fontWeight: 600,
              textAlign: 'left',
              transition: 'background 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Star size={18} color="var(--accent-gold)" /> Reviews & Feedback
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </button>

          <button
            onClick={() => { onNavigate('settings'); onClose(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 0.9rem',
              borderRadius: '10px',
              border: activeTab === 'settings' ? '1.5px solid var(--accent-gold)' : '1px solid transparent',
              background: activeTab === 'settings' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: 'var(--text-dark)',
              cursor: 'pointer',
              fontSize: '0.92rem',
              fontWeight: 600,
              textAlign: 'left',
              transition: 'background 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Settings size={18} color="var(--accent-gold)" /> Settings & Orders
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </button>

          {/* Admin Studio Navigation (Strictly visible ONLY for Specific Admin) */}
          {isExactAdmin(currentUser) && (
            <button
              onClick={() => { onNavigate('admin'); onClose(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.9rem',
                borderRadius: '10px',
                border: activeTab === 'admin' ? '1.5px solid #d97706' : '1px solid rgba(217, 119, 6, 0.4)',
                background: activeTab === 'admin' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'rgba(217, 119, 6, 0.12)',
                color: activeTab === 'admin' ? '#ffffff' : '#b45309',
                cursor: 'pointer',
                fontSize: '0.92rem',
                fontWeight: 700,
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={18} color={activeTab === 'admin' ? '#ffffff' : '#d97706'} /> 👑 Admin Studio & Upload
              </div>
              <ChevronRight size={16} color={activeTab === 'admin' ? '#ffffff' : '#d97706'} />
            </button>
          )}

          {/* Dark / Light Mode Switch */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 0.9rem',
            borderRadius: '10px',
            background: 'var(--bg-champagne)',
            marginTop: '0.4rem',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 600 }}>
              {darkMode ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="var(--primary-emerald)" />}
              <span>{darkMode ? 'Dark Mode (Active)' : 'Light Theme'}</span>
            </div>

            <button
              onClick={onToggleDarkMode}
              style={{
                width: '42px',
                height: '24px',
                borderRadius: '12px',
                background: darkMode ? '#10b981' : '#cbd5e1',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ffffff',
                position: 'absolute',
                top: '2px',
                left: darkMode ? '20px' : '2px',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>

          {/* WhatsApp Channel Follow Banner */}
          <a
            href="https://whatsapp.com/channel/0029VbAFcOK59PwTbzi8m610"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #075E54 0%, #128C7E 50%, #25D366 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              marginTop: '0.6rem',
              boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
              💥
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fef08a', fontWeight: 700 }}>
                WhatsApp Channel 💥
              </div>
              <strong style={{ fontSize: '0.88rem', display: 'block', lineHeight: 1.2, color: '#ffffff' }}>
                NAKSHATRA DESIGNER'S TIRUCHENGODE
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#e2e8f0' }}>
                Click to follow for daily new designs & offers
              </span>
            </div>
          </a>

          {/* Direct Studio Call */}
          <a
            href="tel:+919123500065"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0.9rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0b2b26 0%, #164e43 100%)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none',
              marginTop: '0.4rem',
              boxShadow: '0 4px 12px rgba(11,43,38,0.2)'
            }}
          >
            <PhoneCall size={17} color="#fbbf24" /> Call Studio: +91 91235 00065
          </a>

        </div>

        {/* Bottom Drawer Footer with Logout */}
        {currentUser && (
          <div style={{ padding: '1rem 1.4rem', borderTop: '1px solid var(--border-light)' }}>
            <button
              onClick={() => { onLogout(); onClose(); }}
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid #ef4444',
                background: 'transparent',
                color: '#ef4444',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
