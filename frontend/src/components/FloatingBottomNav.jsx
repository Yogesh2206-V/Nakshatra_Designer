import React from 'react';
import { Search, Star, Home, Settings, ShieldCheck } from 'lucide-react';
import { isExactAdmin } from '../utils/adminAuth';

export default function FloatingBottomNav({ activeTab, setActiveTab, onNavigate, currentUser }) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let scrollTimer = null;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      
      // Hide while actively scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 40) {
        setIsVisible(false);
      } else {
        // Show while scrolling up
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;

      // When static (scrolling stops), automatically show back up
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsVisible(true);
      }, 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  const navItems = [
    {
      id: 'gallery',
      label: 'Home',
      icon: Home
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    },
    ...(isExactAdmin(currentUser) ? [{
      id: 'admin',
      label: 'Admin',
      icon: ShieldCheck
    }] : [])
  ];

  const handleTabClick = (tabId, itemAction) => {
    if (itemAction) {
      itemAction();
      return;
    }
    if (onNavigate) {
      onNavigate(tabId);
    } else {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="floating-bottom-nav"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(150%)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
        zIndex: 1500,
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 12px 35px rgba(11, 43, 38, 0.22)',
        padding: '0.4rem 0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        border: '1.5px solid rgba(212, 175, 55, 0.35)',
        backdropFilter: 'blur(16px)',
        width: 'calc(100% - 32px)',
        maxWidth: '460px'
      }}
    >
      {navItems.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;

        return (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <div 
                style={{
                  height: '28px',
                  width: '1px',
                  background: '#e2e8f0',
                  margin: '0 0.1rem',
                  opacity: 0.8
                }} 
              />
            )}

            <button
              onClick={() => handleTabClick(item.id, item.action)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.25rem 0.5rem',
                gap: '0.2rem',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              {/* Icon Circle */}
              <div
                className={isActive ? 'active-icon-circle' : ''}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive ? '#fef3c7' : 'transparent',
                  color: isActive ? '#92400e' : '#64748b',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(212, 175, 55, 0.25)' : 'none'
                }}
              >
                <IconComponent 
                  size={21} 
                  fill={isActive && item.id === 'reviews' ? '#92400e' : 'none'} 
                />
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.76rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#92400e' : '#64748b',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.label}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
