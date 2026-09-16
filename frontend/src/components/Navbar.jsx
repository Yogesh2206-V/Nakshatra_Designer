import React, { useState, useEffect } from 'react';
import { Scissors, Sparkles, Compass, Star, Settings, PhoneCall, UserPlus, User, Moon, Sun, Menu, ShieldCheck } from 'lucide-react';
import { isExactAdmin } from '../utils/adminAuth';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuth, onOpenSideNav, darkMode, onToggleDarkMode }) {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 40;
      setIsVisible(visible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: 'rgba(255, 255, 255, 0.96)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid var(--border-light)',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Top Announcement Bar */}
      <div className="announcement-bar desktop-only">
        <span className="announcement-item">
          <Sparkles size={14} /> <strong>Nakshatra Boutique:</strong> Custom Blouse, Frock Dress & Saree-to-Frock Conversion Studio!
        </span>
        <a 
          href="https://whatsapp.com/channel/0029VbAFcOK59PwTbzi8m610" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="announcement-item" 
          style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', textDecoration: 'none', color: '#fef08a', fontWeight: 600 }}
        >
          💥 Join WhatsApp Channel
        </a>
        <a href="tel:+919123500065" className="announcement-item" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <PhoneCall size={14} /> In-Shop Visit / Call: <strong>+91 91235 00065</strong>
        </a>
      </div>

      {/* Main Compact Navbar */}
      <div className="navbar-inner-container section-container">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('gallery')}
          className="navbar-brand"
        >
          <div className="brand-icon-circle">
            <Scissors size={20} />
          </div>
          <div>
            <h1 className="brand-title">
              Nakshatra <span style={{ color: 'var(--accent-gold)' }}>Designer's</span>
            </h1>
            <p className="brand-subtitle desktop-only">
              Blouse, Frock & Saree Conversion Studio
            </p>
          </div>
        </div>

        {/* Nav Links (Desktop) + Right Actions */}
        <nav className="navbar-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className={`tab-button desktop-only ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Compass size={16} /> Boutique Lookbook
          </button>

          <button 
            className={`tab-button desktop-only ${activeTab === 'reviews' ? 'active' : ''}`}
            style={{ borderColor: '#d4af37' }}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={16} fill={activeTab === 'reviews' ? "#d4af37" : "none"} /> Reviews & Feedback
          </button>

          <button 
            className={`tab-button desktop-only ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={16} /> Settings
          </button>

          {/* Admin Studio Button (Strictly visible ONLY for Nakshatradesign Admin) */}
          {isExactAdmin(currentUser) && (
            <button 
              className={`tab-button desktop-only ${activeTab === 'admin' ? 'active' : ''}`}
              style={{
                borderColor: '#d97706',
                background: activeTab === 'admin' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'rgba(217, 119, 6, 0.12)',
                color: activeTab === 'admin' ? '#ffffff' : '#b45309',
                fontWeight: 700
              }}
              onClick={() => setActiveTab('admin')}
            >
              <ShieldCheck size={16} /> 👑 Admin Studio
            </button>
          )}

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? "Switch to Normal Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: darkMode ? '#0b2b26' : '#faf6f0',
              border: '1px solid var(--accent-gold)',
              color: darkMode ? '#fbbf24' : '#b8860b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
              flexShrink: 0
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Top Right User Profile Image Action */}
          {currentUser ? (
            <button
              onClick={onOpenSideNav}
              className="user-profile-badge"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.18rem 0.5rem 0.18rem 0.22rem',
                borderRadius: '20px',
                background: 'var(--bg-champagne)',
                border: '1.2px solid var(--accent-gold)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                outline: 'none',
                minWidth: 0,
                flexShrink: 1
              }}
              title="Click to open Side Navbar & Profile"
            >
              {/* Avatar Circle */}
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #0b2b26 0%, #164e43 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.2px solid var(--accent-gold)',
                flexShrink: 0,
                position: 'relative'
              }}>
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.75rem' }}>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User size={13} />}
                  </span>
                )}
              </div>

              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-dark)', maxWidth: '72px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1 }}>
                {currentUser.name.split(' ')[0]}
              </span>

              {!currentUser.avatar && (
                <span style={{
                  fontSize: '0.62rem',
                  background: 'var(--accent-gold)',
                  color: '#0b2b26',
                  padding: '0.08rem 0.32rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  flexShrink: 0
                }}>
                  +Photo
                </span>
              )}
            </button>
          ) : (
            <button 
              className="btn-gold mobile-compact-signup"
              onClick={onOpenAuth}
            >
              <UserPlus size={14} /> <span>Sign Up</span>
            </button>
          )}

          {/* Side Navbar Hamburger Button */}
          <button
            onClick={onOpenSideNav}
            aria-label="Open Side Navbar"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              background: 'var(--primary-emerald)',
              color: '#ffffff',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
              padding: 0,
              flexShrink: 0
            }}
            title="Open Side Menu"
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
          >
            <Menu size={16} />
          </button>

        </nav>
      </div>
    </header>
  );
}
