import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function WhatsAppWidget({ phoneNumber = '919123514214', onOpenChatbot }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
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

  const defaultMessage = encodeURIComponent("Hi Nakshatra Designer's, I have a stitching enquiry!");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  const handleClick = (e) => {
    const msg = encodeURIComponent("Hi Nakshatra Designer's, I have a stitching enquiry & want to know consultation options!");
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="whatsapp-floating-widget"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(160%)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease'
      }}
    >
      {/* Speech Bubble Tooltip */}
      {showTooltip && (
        <div
          onClick={handleClick}
          title="Click to chat on WhatsApp"
          style={{
            position: 'relative',
            background: '#ffffff',
            color: '#1e293b',
            padding: '0.28rem 0.6rem',
            borderRadius: '14px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: '1px solid #e2e8f0',
            animation: 'fadeInLeft 0.3s ease-out',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        >
          <span>Need help? 👋</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            aria-label="Close tooltip"
            style={{
              border: 'none',
              background: '#94a3b8',
              color: '#ffffff',
              borderRadius: '50%',
              width: '14px',
              height: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: '2px',
              padding: 0,
              flexShrink: 0
            }}
          >
            <X size={9} strokeWidth={2.8} />
          </button>

          {/* Right pointing arrow indicator */}
          <div
            style={{
              position: 'absolute',
              right: '-4px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: '7px',
              height: '7px',
              background: '#ffffff',
              borderRight: '1px solid #e2e8f0',
              borderTop: '1px solid #e2e8f0'
            }}
          />
        </div>
      )}

      {/* Floating WhatsApp Green Button */}
      <button
        onClick={handleClick}
        title="Chat on WhatsApp (+91 91235 14214)"
        style={{
          position: 'relative',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#25D366',
          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4), 0 2px 5px rgba(0, 0, 0, 0.15)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          padding: 0,
          outline: 'none',
          flexShrink: 0
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
      >
        {/* WhatsApp Official SVG Logo */}
        <svg viewBox="0 0 32 32" width="18" height="18" fill="#ffffff">
          <path d="M16 2a13 13 0 0 0-11 20L3 29l7-2a13 13 0 1 0 6-25zm0 24a11 11 0 0 1-5.6-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4A11 11 0 1 1 16 26zm6-8.2c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a9 9 0 0 1-2.6-1.6 10 10 0 0 1-1.8-2.3c-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.4.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.7.1-1 .4a4.4 4.4 0 0 0-1.4 3.3c0 2 1.4 3.9 1.6 4.1.2.3 2.8 4.3 6.8 6 1 .4 1.7.6 2.3.8 1 .3 1.9.3 2.6.2.8-.1 2.5-1 2.9-2s.4-1.8.3-2c-.1-.2-.4-.3-.7-.4z" />
        </svg>

        {/* Red Notification Badge "1" */}
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#ff0000',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
            border: '1.2px solid #ffffff',
            lineHeight: 1
          }}
        >
          1
        </div>
      </button>
    </div>
  );
}
