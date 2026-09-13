import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Scissors, PhoneCall } from 'lucide-react';

export default function DesignCoverflow({ onSelectGarment, onOpenEnquiry }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const coverflowItems = [
    {
      id: 'katori_blouse',
      title: 'Katori Blouse Stitching (Base)',
      category: 'Blouses',
      price: 'Affordable Price',
      svgType: 'katori',
      frontNeck: 'sweetheart',
      backNeck: 'deep_u_back',
      sleeve: 'elbow',
      fabric: 'raw_silk',
      embroidery: 'neckline_aari',
      description: 'Precision fitted padded Katori cut blouse with delicate neck piping.'
    },
    {
      id: 'half_saree',
      title: 'Half Saree (Base) Stitching',
      category: 'Bridal & Traditional',
      price: 'Affordable Price',
      svgType: 'halfsaree',
      frontNeck: 'boat',
      backNeck: 'open_back',
      sleeve: 'puff',
      fabric: 'kanjivaram_silk',
      embroidery: 'heavy_bridal_aari',
      description: 'Traditional Dhavani half saree pleating & embroidered lehenga skirt set.'
    },
    {
      id: 'anarkali_dress',
      title: 'Anarkali Dress (Base) Stitching',
      category: 'Frocks & Gowns',
      price: 'Affordable Price',
      svgType: 'anarkali',
      frontNeck: 'deep_v',
      backNeck: 'window_cutout',
      sleeve: 'three_fourth',
      fabric: 'organza',
      embroidery: 'neckline_aari',
      description: 'Grand 360° umbrella circle flare Anarkali maxi dress with soft lining.'
    },
    {
      id: 'paavadai_sattai',
      title: 'Paavadai Sattai (Kids) Stitching',
      category: 'Kids Ethnic',
      price: 'Affordable Price',
      svgType: 'paavadai',
      frontNeck: 'sweetheart',
      backNeck: 'deep_u_back',
      sleeve: 'puff',
      fabric: 'brocade',
      embroidery: 'neckline_aari',
      description: 'Traditional silk Pattu Paavadai & embellished blouse set for girls.'
    },
    {
      id: 'saree_frock',
      title: 'Saree Converted Maxi Frock',
      category: 'Saree Reuse',
      price: 'Affordable Price',
      svgType: 'frock',
      frontNeck: 'high_collar',
      backNeck: 'bow_back',
      sleeve: 'elbow',
      fabric: 'kanjivaram_silk',
      embroidery: 'heavy_bridal_aari',
      description: 'Upcycle old Kanjivaram or designer silk sarees into modern flared gowns.'
    }
  ];

  // Continuous Auto slide every 2.5 seconds
  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % coverflowItems.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + coverflowItems.length) % coverflowItems.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % coverflowItems.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [coverflowItems.length]);

  // SVGs for sketches matching the clean line-art aesthetic in user image
  const renderSVGIcon = (type) => {
    if (type === 'katori') {
      return (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ maxHeight: '130px' }}>
          <path d="M 40 40 L 65 30 L 100 65 L 135 30 L 160 40 L 175 75 L 155 75 L 140 105 L 60 105 L 45 75 L 25 75 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 65 30 Q 100 75 135 30" fill="none" stroke="#1e293b" strokeWidth="2" />
          <path d="M 60 105 L 60 70 Q 80 100 100 105 Q 120 100 140 70 L 140 105" fill="none" stroke="#1e293b" strokeWidth="1.8" />
          <line x1="100" y1="65" x2="100" y2="105" stroke="#1e293b" strokeWidth="1.8" strokeDasharray="3 3" />
        </svg>
      );
    }
    if (type === 'halfsaree') {
      return (
        <svg viewBox="0 0 200 160" width="100%" height="100%" style={{ maxHeight: '140px' }}>
          <path d="M 70 25 L 85 20 L 100 40 L 115 20 L 130 25 L 140 50 L 130 50 L 125 70 L 75 70 L 70 50 L 60 50 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
          <path d="M 75 70 L 40 145 L 160 145 L 125 70 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
          <path d="M 65 35 Q 90 70 120 140" fill="none" stroke="#475569" strokeWidth="2.5" />
          <line x1="55" y1="145" x2="70" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="85" y1="145" x2="88" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="115" y1="145" x2="112" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="145" y1="145" x2="130" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
        </svg>
      );
    }
    if (type === 'anarkali') {
      return (
        <svg viewBox="0 0 200 160" width="100%" height="100%" style={{ maxHeight: '140px' }}>
          <path d="M 75 30 L 90 20 L 100 35 L 110 20 L 125 30 L 135 55 L 125 55 L 120 75 L 80 75 L 75 55 L 65 55 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
          <path d="M 80 75 Q 30 145 20 150 L 180 150 Q 170 145 120 75 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
          <line x1="100" y1="75" x2="100" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="90" y1="75" x2="60" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="110" y1="75" x2="140" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
        </svg>
      );
    }
    if (type === 'paavadai') {
      return (
        <svg viewBox="0 0 200 160" width="100%" height="100%" style={{ maxHeight: '140px' }}>
          <path d="M 75 30 L 100 20 L 125 30 L 130 50 L 70 50 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
          <path d="M 70 60 L 45 140 L 155 140 L 130 60 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
          <line x1="85" y1="60" x2="70" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="100" y1="60" x2="100" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="115" y1="60" x2="130" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 200 160" width="100%" height="100%" style={{ maxHeight: '140px' }}>
        <path d="M 70 30 L 100 20 L 130 30 L 135 60 L 65 60 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
        <path d="M 65 60 Q 30 145 25 150 L 175 150 Q 170 145 135 60 Z" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <section 
      style={{
        background: 'linear-gradient(180deg, #071e22 0%, #0b2b26 100%)',
        padding: '3.5rem 1rem 4rem 1rem',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
        borderRadius: '24px',
        margin: '1.5rem auto 3rem auto',
        maxWidth: '1280px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Background Decorative Hangers / Accent Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} 
      />

      {/* Header Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 2 }}>
        <span className="gold-badge" style={{ marginBottom: '0.6rem' }}>
          <Sparkles size={14} /> Interactive 3D Stitching Catalog
        </span>
        <h2 style={{ fontSize: '2.2rem', color: '#ffffff', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
          Select & Customize Your Stitching Base
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '600px', margin: '0.4rem auto 0 auto' }}>
          Swipe through our master tailoring silhouettes. Click any design card to personalize your fabric, necklines, & measurements!
        </p>
      </div>

      {/* 3D Coverflow Container */}
      <div 
        style={{
          perspective: '1000px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '380px',
          position: 'relative',
          zIndex: 2,
          padding: '1rem 0'
        }}
      >
        {/* Left Side Arrow Button */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.0)';
          }}
          aria-label="Previous Design"
        >
          <ChevronLeft size={24} />
        </button>

        {coverflowItems.map((item, index) => {
          // Calculate relative position to active index
          let offset = index - activeIndex;
          if (offset < -2) offset += coverflowItems.length;
          if (offset > 2) offset -= coverflowItems.length;

          const isCenter = offset === 0;

          // 3D Transform calculations matching Apple Coverflow style
          const rotateY = offset * -35;
          const translateX = offset * 180;
          const scale = isCenter ? 1.08 : 0.82;
          const zIndex = 10 - Math.abs(offset);
          const opacity = Math.abs(offset) > 2 ? 0 : isCenter ? 1 : 0.65;

          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              style={{
                position: 'absolute',
                width: '280px',
                height: '340px',
                borderRadius: '20px',
                background: isCenter ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                color: '#1e293b',
                boxShadow: isCenter 
                  ? '0 0 35px rgba(255, 255, 255, 0.4), 0 20px 40px rgba(0,0,0,0.6)' 
                  : '0 10px 25px rgba(0,0,0,0.4)',
                border: isCenter ? '3px solid #ffffff' : '1px solid rgba(255,255,255,0.3)',
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                transition: 'all 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
                zIndex: zIndex,
                opacity: opacity,
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.2rem',
                userSelect: 'none'
              }}
            >
              {/* Top Hanger / Tag Icon */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.category}
                </span>
                <Scissors size={16} color="var(--primary-emerald)" />
              </div>

              {/* Center Sketch Graphic */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.8rem 0' }}>
                {renderSVGIcon(item.svgType)}
              </div>

              {/* Bottom Card Label Overlay (Matching user screenshot gradient) */}
              <div 
                style={{
                  background: isCenter ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)' : 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
              >
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, fontFamily: 'var(--font-serif)', marginBottom: '0.2rem', color: '#ffffff' }}>
                  {item.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}

        {/* Right Side Arrow Button */}
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.0)';
          }}
          aria-label="Next Design"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Active Item Action Controls */}
      <div style={{ textAlign: 'center', marginTop: '1.8rem', position: 'relative', zIndex: 3 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Customize Stitching Pill Button */}
          <button
            onClick={() => {
              const item = coverflowItems[activeIndex];
              const msg = `Hi Nakshatra Designer's, I want to customize and stitch:\n\n✨ *Silhouette:* ${item.title}\n📂 *Category:* ${item.category}\n\nPlease share the tailoring options & fabric details!`;
              const url = `https://wa.me/919123514214?text=${encodeURIComponent(msg)}`;
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            style={{
              padding: '0.8rem 2.2rem',
              borderRadius: '30px',
              background: '#071e22',
              color: '#ffffff',
              border: '2px solid #ec4899',
              fontSize: '1.02rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)',
              transition: 'all 0.25s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(236, 72, 153, 0.7)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1.0)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(236, 72, 153, 0.4)';
            }}
          >
            <Scissors size={18} color="#ec4899" /> Customize Stitching
          </button>

          {/* Call Now Button */}
          <a
            href="tel:+919123500065"
            style={{
              padding: '0.8rem 1.8rem',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '1.02rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
              transition: 'all 0.25s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.6)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1.0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
            }}
          >
            <PhoneCall size={18} /> Call Now (+91 91235 00065)
          </a>
        </div>
      </div>
    </section>
  );
}
