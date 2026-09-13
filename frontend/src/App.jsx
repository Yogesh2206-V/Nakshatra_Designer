import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroBanner from './components/HeroBanner';
import MeasurementForm from './components/MeasurementForm';
import DesignGallery from './components/DesignGallery';
import DesignCoverflow from './components/DesignCoverflow';
import ReviewsFeedback from './components/ReviewsFeedback';
import SettingsPage from './components/SettingsPage';
import AdminDashboard from './components/AdminDashboard';
import FloatingBottomNav from './components/FloatingBottomNav';
import AuthModal from './components/AuthModal';
import SideNavbar from './components/SideNavbar';
import ChatbotWidget from './components/ChatbotWidget';
import WhatsAppWidget from './components/WhatsAppWidget';
import EnquiryIcon from './components/EnquiryIcon';
import { CheckCircle2, Compass, PhoneCall, Sparkles } from 'lucide-react';

import { retrieveUserAvatar, persistUserAvatar } from './utils/avatarStorage';
import { isExactAdmin } from './utils/adminAuth';

export default function App() {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery', 'reviews', 'settings'
  const [customizerStep, setCustomizerStep] = useState('customize'); // 'customize', 'measurements', or 'confirmed'
  
  const [options, setOptions] = useState(null);
  const [pendingSpecs, setPendingSpecs] = useState(null);
  const [pendingPrice, setPendingPrice] = useState('');

  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Auth & Sign Up Modal State with Permanent Avatar Retrieval
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nakshatra_user');
      if (!saved) return null;
      const user = JSON.parse(saved);
      if (user) {
        const savedAvatar = retrieveUserAvatar(user);
        if (savedAvatar) {
          user.avatar = savedAvatar;
        }
      }
      return user;
    } catch (e) {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

  // Chatbot State
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotContext, setChatbotContext] = useState('');

  // Dark Mode State with LocalStorage Persistence
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('nakshatra_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('nakshatra_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('nakshatra_theme', 'light');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Fetch shop options & customizer matrix from backend API
  useEffect(() => {
    fetch('/api/options')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOptions(data.options);
        }
      })
      .catch(err => {
        console.error('Error fetching options from backend:', err);
      });
  }, []);

  const handleOpenEnquiry = (context = '') => {
    setChatbotContext(context);
    setShowChatbot(true);
  };

  // Helper to enforce sign-up before performing an action
  const requireAuth = (actionCallback, message = 'Please sign up or log in to customize options and place tailoring orders.') => {
    if (currentUser) {
      if (actionCallback) actionCallback();
    } else {
      setAuthMessage(message);
      setPendingAction(() => actionCallback || null);
      setShowAuthModal(true);
    }
  };

  const handleLoginSuccess = (user) => {
    if (user) {
      const existingAvatar = retrieveUserAvatar(user);
      if (!user.avatar && existingAvatar) {
        user.avatar = existingAvatar;
        persistUserAvatar(user, existingAvatar);
      } else if (user.avatar) {
        persistUserAvatar(user, user.avatar);
      }
      setCurrentUser(user);
      localStorage.setItem('nakshatra_user', JSON.stringify(user));
    }
    setShowAuthModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nakshatra_user');
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem('nakshatra_user', JSON.stringify(updatedUser));
      if (updatedUser.avatar) {
        persistUserAvatar(updatedUser, updatedUser.avatar);
      }
    }
  };

  // Handler when preset is picked in Gallery or Coverflow
  const handlePresetSelect = (presetItem) => {
    requireAuth(() => {
      setPendingSpecs({
        frontNeck: presetItem.frontNeck || 'sweetheart',
        backNeck: presetItem.backNeck || 'deep_u_back',
        sleeve: presetItem.sleeve || 'elbow',
        fabric: presetItem.fabric || 'kanjivaram_silk',
        embroidery: presetItem.embroidery || 'neckline_aari',
        addOns: ['padding']
      });
      setActiveTab('gallery');
      setCustomizerStep('measurements');
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 'Please sign up to order this boutique design.');
  };

  // Handler when order is successfully placed
  const handleOrderSuccess = (newOrder) => {
    setConfirmedOrder(newOrder);
    setCustomizerStep('confirmed');
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Central Navigation Handler: resets to starting step and scrolls to top
  const handleNavigate = (tab) => {
    setActiveTab(tab);
    if (tab === 'gallery') {
      setCustomizerStep('customize');
    }
    // Always scroll smoothly to the starting top of the page
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Header Bar with Top Right Sign Up button & Profile Avatar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleNavigate}
        currentUser={currentUser}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAuth={() => {
          setAuthMessage('Sign up for a Nakshatra account to design, save & track your tailoring orders.');
          setPendingAction(null);
          setShowAuthModal(true);
        }}
        onOpenSideNav={() => setShowSideNav(true)}
      />

      <main className="main-content">
        {/* TAB 1: BOUTIQUE LOOKBOOK & SHOP GALLERY */}
        {activeTab === 'gallery' && (
          <div>
            <HeroBanner 
              onStartCustomize={() => {
                const el = document.getElementById('boutique-gallery');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenEnquiry={handleOpenEnquiry}
            />

            <div id="boutique-gallery" style={{ paddingTop: '1rem' }}>
              {customizerStep === 'customize' && (
                <div>
                  {/* 3D Coverflow Garment Showcase Slider */}
                  <DesignCoverflow 
                    onSelectGarment={handlePresetSelect} 
                    onOpenEnquiry={handleOpenEnquiry}
                  />

                  {/* Boutique Design Gallery Grid */}
                  <DesignGallery 
                    onSelectPreset={handlePresetSelect} 
                    currentUser={currentUser}
                    onRequireAuth={(cb, msg) => requireAuth(cb, msg)}
                    onOpenEnquiry={handleOpenEnquiry}
                    onNavigate={handleNavigate}
                  />
                </div>
              )}

              {/* Step 2: Interactive Measurement Form & Add-on Details */}
              {customizerStep === 'measurements' && options && (
                <MeasurementForm 
                  designSpecs={pendingSpecs}
                  totalPrice={pendingPrice}
                  options={options}
                  currentUser={currentUser}
                  onRequireAuth={(cb, msg) => requireAuth(cb, msg)}
                  onBack={() => setCustomizerStep('customize')}
                  onOrderSuccess={handleOrderSuccess}
                  onOpenEnquiry={handleOpenEnquiry}
                />
              )}

              {/* Step 3: Order Confirmation Summary */}
              {customizerStep === 'confirmed' && confirmedOrder && (
                <div className="section-container" style={{ maxWidth: '650px', textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <div className="glass-card" style={{ padding: '2.5rem', border: '2px solid var(--accent-gold)' }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.12)',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem auto'
                    }}>
                      <CheckCircle2 size={40} />
                    </div>

                    <span className="gold-badge" style={{ marginBottom: '0.8rem' }}>
                      <Sparkles size={14} /> Tailoring Order Placed Successfully
                    </span>

                    <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)', marginBottom: '0.4rem' }}>
                      Thank You, {confirmedOrder.customerName}!
                    </h2>
                    
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', marginBottom: '1.5rem' }}>
                      Your order reference ID is <strong>#{confirmedOrder.id}</strong>. Our master tailors at Tiruchengode studio have received your custom requirements.
                    </p>

                    <div style={{ background: '#faf6f0', padding: '1.2rem', borderRadius: 'var(--radius-sm)', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Order ID:</span>
                        <strong style={{ fontSize: '1.2rem', color: 'var(--primary-emerald)' }}>{confirmedOrder.id}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Status:</span>
                        <strong style={{ color: 'var(--gold-dark)' }}>{confirmedOrder.status}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Estimated Delivery:</span>
                        <strong>{confirmedOrder.expectedDelivery}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Stitching Rate:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <button
                            className="btn-outline"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            onClick={() => handleOpenEnquiry(`Order ${confirmedOrder.id} Rate Enquiry`)}
                          >
                            <EnquiryIcon size={14} /> Enquire
                          </button>
                          <strong style={{ fontSize: '1.2rem', color: 'var(--primary-emerald)' }}>
                            {typeof confirmedOrder.totalPrice === 'number' || /^\d+$/.test(confirmedOrder.totalPrice) 
                              ? `₹${confirmedOrder.totalPrice}` 
                              : (confirmedOrder.totalPrice || 'Custom Rate on Consultation')}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button 
                        className="btn-gold"
                        onClick={() => {
                          setCustomizerStep('customize');
                          setActiveTab('gallery');
                        }}
                      >
                        <Compass size={18} /> Browse More Designs
                      </button>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '1.2rem', borderTop: '1px solid #e2e8f0', fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <PhoneCall size={16} color="var(--accent-gold)" /> WhatsApp Confirmation sent to <strong>{confirmedOrder.phone}</strong>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS & FEEDBACK */}
        {activeTab === 'reviews' && (
          <ReviewsFeedback 
            currentUser={currentUser}
            onRequireAuth={(cb, msg) => requireAuth(cb, msg)}
          />
        )}

        {/* TAB 4: SETTINGS & ACCOUNT */}
        {activeTab === 'settings' && (
          <SettingsPage 
            currentUser={currentUser}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onOpenAuth={() => setShowAuthModal(true)}
            onOpenProfileModal={() => setShowSideNav(true)}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )}

        {/* TAB 5: ADMIN STUDIO (STRICTLY ACCESSIBLE ONLY BY SPECIFIC ADMIN: Nakshatradesign / 9123500065) */}
        {activeTab === 'admin' && isExactAdmin(currentUser) && (
          <AdminDashboard 
            currentUser={currentUser}
            onOpenEnquiry={handleOpenEnquiry}
            onNavigateToGallery={() => handleNavigate('gallery')}
          />
        )}
      </main>

      {/* Centered Sign Up / Login Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
          message={authMessage}
        />
      )}

      {/* Slide-out Side Navbar Drawer */}
      <SideNavbar 
        isOpen={showSideNav}
        onClose={() => setShowSideNav(false)}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        onOpenAuth={() => setShowAuthModal(true)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenEnquiry={handleOpenEnquiry}
      />

      {/* Nakshatra Chatbot Widget */}
      <ChatbotWidget
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        initialContext={chatbotContext}
      />

      {/* Floating WhatsApp Action Widget */}
      {!showChatbot && (
        <WhatsAppWidget
          phoneNumber="919123514214"
          onOpenChatbot={() => handleOpenEnquiry()}
        />
      )}

      {/* Floating Pill Bottom Navigation Bar */}
      <FloatingBottomNav 
        activeTab={activeTab} 
        setActiveTab={handleNavigate}
        onNavigate={handleNavigate}
        currentUser={currentUser} 
        onOpenAuth={() => setShowAuthModal(true)} 
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}



