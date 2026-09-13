import React, { useState } from 'react';
import { Eye, RotateCw, Sparkles } from 'lucide-react';

export default function VisualPreview({ designSpecs, options }) {
  const [viewAngle, setViewAngle] = useState('front'); // 'front' or 'back'

  // Lookup selected values or defaults
  const currentFabric = options?.fabrics?.find(f => f.id === designSpecs.fabric) || { color: '#9B1B30', name: 'Kanjivaram Silk' };
  const fabricColor = currentFabric.color || '#9B1B30';
  const garmentType = designSpecs.garmentType || 'saree_blouse';
  const frockFlare = designSpecs.frockFlare || 'umbrella_flare';
  const sleeveStyle = designSpecs.sleeve || 'short';
  const frontNeck = designSpecs.frontNeck || 'sweetheart';
  const backNeck = designSpecs.backNeck || 'deep_u_back';
  const embroidery = designSpecs.embroidery || 'none';
  const hasPotli = frontNeck === 'potli_front' || backNeck === 'potli_keyhole';
  const hasPiping = designSpecs.addOns?.includes('piping');
  const hasLatkan = designSpecs.addOns?.includes('designer_latkan') || backNeck === 'deep_u_back';

  const isFrockOrGown = ['designer_frock', 'saree_to_frock', 'lehenga_set'].includes(garmentType);

  // Gold Zardozi Color for Aari Work overlay
  const zariGold = '#D4AF37';

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header controls */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 700 }}>
            Live Render Engine
          </span>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-emerald)' }}>
            Nakshatra 2D Garment Preview
          </h3>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#f1f5f9', padding: '0.2rem', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setViewAngle('front')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: viewAngle === 'front' ? 'var(--primary-emerald)' : 'transparent',
              color: viewAngle === 'front' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            Front View
          </button>

          <button
            onClick={() => setViewAngle('back')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: viewAngle === 'back' ? 'var(--primary-emerald)' : 'transparent',
              color: viewAngle === 'back' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            Back View
          </button>
        </div>
      </div>

      {/* SVG Canvas Renderer */}
      <div style={{
        width: '100%',
        maxWidth: '340px',
        height: '380px',
        background: 'radial-gradient(circle, #ffffff 0%, #f4efe6 100%)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        
        {/* SVG Graphic */}
        <svg viewBox="0 0 300 350" style={{ width: '95%', height: '95%', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))' }}>
          
          <defs>
            {/* Fabric Gradient Sheen */}
            <linearGradient id="fabricSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={fabricColor} />
              <stop offset="50%" stopColor={fabricColor} />
              <stop offset="100%" stopColor="#1a0005" stopOpacity="0.4" />
            </linearGradient>

            {/* Gold Zari Pattern Filter */}
            <pattern id="zariDots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1.2" fill="#d4af37" opacity="0.6" />
            </pattern>
          </defs>

          {/* FROCK SKIRT FLARE BOTTOM (IF FROCK OR SAREE CONVERTED DRESS) */}
          {isFrockOrGown && (
            <g>
              {frockFlare === 'umbrella_flare' ? (
                /* Umbrella Grand Circular Flare */
                <path 
                  d="M 85,210 C 40,240 20,320 15,340 L 285,340 C 280,320 260,240 215,210 Z" 
                  fill="url(#fabricSheen)"
                  stroke="#d4af37"
                  strokeWidth="2"
                />
              ) : frockFlare === 'pleated_box' ? (
                /* Box Pleated Flare */
                <>
                  <path d="M 85,210 L 40,340 L 260,340 L 215,210 Z" fill="url(#fabricSheen)" stroke="#d4af37" strokeWidth="1.5" />
                  <line x1="120" y1="210" x2="100" y2="340" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                  <line x1="150" y1="210" x2="150" y2="340" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                  <line x1="180" y1="210" x2="200" y2="340" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                </>
              ) : frockFlare === 'tiered_layers' ? (
                /* Tiered Ruffle Flare */
                <>
                  <path d="M 85,210 Q 150,250 215,210 L 235,260 Q 150,300 65,260 Z" fill="url(#fabricSheen)" stroke="#d4af37" strokeWidth="1" />
                  <path d="M 65,260 Q 150,300 235,260 L 260,320 Q 150,350 40,320 Z" fill="url(#fabricSheen)" stroke="#d4af37" strokeWidth="1.5" />
                </>
              ) : (
                /* Straight Maxi Cut */
                <path d="M 85,210 L 65,340 L 235,340 L 215,210 Z" fill="url(#fabricSheen)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              )}

              {/* Saree Border Highlights on Frock Hem */}
              {garmentType === 'saree_to_frock' && (
                <path d="M 20,328 Q 150,345 280,328 L 285,340 Q 150,355 15,340 Z" fill="#d4af37" />
              )}
            </g>
          )}

          {/* MAIN BODICE */}
          {viewAngle === 'front' ? (
            /* FRONT BODICE */
            <path 
              d="M 90,60 L 120,65 L 150,75 L 180,65 L 210,60 L 225,120 L 215,220 L 85,220 L 75,120 Z" 
              fill="url(#fabricSheen)"
              stroke={hasPiping ? '#d4af37' : 'rgba(0,0,0,0.15)'}
              strokeWidth={hasPiping ? '3' : '1.5'}
            />
          ) : (
            /* BACK BODICE */
            <path 
              d="M 90,60 L 120,65 L 150,70 L 180,65 L 210,60 L 225,120 L 215,220 L 85,220 L 75,120 Z" 
              fill="url(#fabricSheen)"
              stroke={hasPiping ? '#d4af37' : 'rgba(0,0,0,0.15)'}
              strokeWidth={hasPiping ? '3' : '1.5'}
            />
          )}

          {/* SLEEVES RENDERING */}
          {sleeveStyle !== 'sleeveless' && (
            <>
              {/* Left Sleeve */}
              {sleeveStyle === 'puff' ? (
                <path d="M 90,60 C 60,50 50,90 75,120 Z" fill="url(#fabricSheen)" stroke="#d4af37" strokeWidth="2" />
              ) : sleeveStyle === 'elbow' ? (
                <path d="M 90,60 L 45,90 L 55,160 L 78,125 Z" fill="url(#fabricSheen)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              ) : sleeveStyle === 'three_fourth' ? (
                <path d="M 90,60 L 35,100 L 45,190 L 78,125 Z" fill="url(#fabricSheen)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              ) : sleeveStyle === 'full' ? (
                <path d="M 90,60 L 25,110 L 35,230 L 78,125 Z" fill="url(#fabricSheen)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              ) : (
                /* Short Sleeve */
                <path d="M 90,60 L 60,80 L 75,120 Z" fill="url(#fabricSheen)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              )}

              {/* Right Sleeve */}
              {sleeveStyle === 'puff' ? (
                <path d="M 210,60 C 240,50 250,90 225,120 Z" fill="url(#fabricSheen)" stroke="#d4af37" strokeWidth="2" />
              ) : sleeveStyle === 'elbow' ? (
                <path d="M 210,60 L 255,90 L 245,160 L 222,125 Z" fill="url(#fabricSheen)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              ) : sleeveStyle === 'three_fourth' ? (
                <path d="M 210,60 L 265,100 L 255,190 L 222,125 Z" fill="url(#fabricSheen)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              ) : sleeveStyle === 'full' ? (
                <path d="M 210,60 L 275,110 L 265,230 L 222,125 Z" fill="url(#fabricSheen)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              ) : (
                /* Short Sleeve */
                <path d="M 210,60 L 240,80 L 225,120 Z" fill="url(#fabricSheen)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              )}
            </>
          )}

          {/* NECK CUTOUT RENDERING */}
          {viewAngle === 'front' ? (
            /* FRONT NECK SHAPES */
            <>
              {frontNeck === 'sweetheart' && (
                <path d="M 115,60 C 130,110 145,115 150,110 C 155,115 170,110 185,60 Z" fill="#faf6f0" stroke="#d4af37" strokeWidth="2" />
              )}
              {frontNeck === 'boat' && (
                <path d="M 100,60 Q 150,95 200,60 Z" fill="#faf6f0" stroke="#d4af37" strokeWidth="2" />
              )}
              {frontNeck === 'deep_u' && (
                <path d="M 120,60 C 120,130 180,130 180,60 Z" fill="#faf6f0" stroke="#d4af37" strokeWidth="2" />
              )}
              {frontNeck === 'high_collar' && (
                <>
                  <path d="M 130,50 L 170,50 L 165,65 L 135,65 Z" fill={fabricColor} stroke="#d4af37" strokeWidth="2" />
                  <path d="M 140,65 Q 150,90 160,65 Z" fill="#faf6f0" />
                </>
              )}
              {frontNeck === 'deep_v' && (
                <path d="M 120,60 L 150,135 L 180,60 Z" fill="#faf6f0" stroke="#d4af37" strokeWidth="2" />
              )}
              {frontNeck === 'potli_front' && (
                <>
                  <path d="M 120,60 C 120,120 180,120 180,60 Z" fill="#faf6f0" stroke="#d4af37" strokeWidth="2" />
                  {/* Potli Button Line */}
                  <line x1="150" y1="120" x2="150" y2="220" stroke="#d4af37" strokeWidth="3" />
                  <circle cx="150" cy="135" r="3.5" fill="#d4af37" />
                  <circle cx="150" cy="155" r="3.5" fill="#d4af37" />
                  <circle cx="150" cy="175" r="3.5" fill="#d4af37" />
                  <circle cx="150" cy="195" r="3.5" fill="#d4af37" />
                </>
              )}
            </>
          ) : (
            /* BACK NECK SHAPES */
            <>
              {backNeck === 'deep_u_back' && (
                <path d="M 115,60 C 115,160 185,160 185,60 Z" fill="#faf6f0" stroke="#d4af37" strokeWidth="2" />
              )}
              {backNeck === 'open_back' && (
                <path d="M 115,60 L 115,150 L 185,150 L 185,60 Z" fill="#faf6f0" stroke="#d4af37" strokeWidth="2" />
              )}
              {backNeck === 'window_cutout' && (
                <>
                  <path d="M 125,60 Q 150,85 175,60 Z" fill="#faf6f0" stroke="#d4af37" strokeWidth="1.5" />
                  <polygon points="150,95 175,130 150,165 125,130" fill="#faf6f0" stroke="#d4af37" strokeWidth="2" />
                </>
              )}
              {backNeck === 'bow_back' && (
                <>
                  <path d="M 115,60 C 115,140 185,140 185,60 Z" fill="#faf6f0" stroke="#d4af37" strokeWidth="2" />
                  {/* Bow Ribbon */}
                  <path d="M 130,140 C 145,125 155,125 170,140 C 155,155 145,155 130,140 Z" fill="#d4af37" />
                  <path d="M 145,140 L 138,180 M 155,140 L 162,180" stroke="#d4af37" strokeWidth="4" />
                </>
              )}
              {backNeck === 'potli_keyhole' && (
                <ellipse cx="150" cy="115" rx="30" ry="45" fill="#faf6f0" stroke="#d4af37" strokeWidth="2" />
              )}
            </>
          )}

          {/* EMBROIDERY / AARI WORK OVERLAY */}
          {embroidery !== 'none' && (
            <g opacity="0.95">
              {/* Neckline Aari Motif */}
              {(embroidery === 'neckline_aari' || embroidery === 'heavy_bridal_aari' || embroidery === 'peacock_motif') && (
                <path 
                  d={viewAngle === 'front' ? "M 110,62 C 130,122 170,122 190,62" : "M 110,62 C 110,165 190,165 190,62"} 
                  fill="none" 
                  stroke={zariGold} 
                  strokeWidth="6" 
                  strokeDasharray="2,3" 
                />
              )}

              {/* Sleeve Border Aari */}
              {(embroidery === 'sleeve_border_aari' || embroidery === 'heavy_bridal_aari') && sleeveStyle !== 'sleeveless' && (
                <>
                  <path d="M 50,150 L 75,120" stroke={zariGold} strokeWidth="6" strokeDasharray="3,2" />
                  <path d="M 250,150 L 225,120" stroke={zariGold} strokeWidth="6" strokeDasharray="3,2" />
                </>
              )}

              {/* Peacock Motif Art on Back */}
              {embroidery === 'peacock_motif' && viewAngle === 'back' && (
                <g transform="translate(150,180) scale(0.6)">
                  <path d="M 0,-15 C -20,-30 20,-30 0,-15 Z" fill={zariGold} />
                  <circle cx="0" cy="-25" r="4" fill="#0B2B26" />
                  <path d="M -15,0 C -30,20 -10,30 0,10 C 10,30 30,20 15,0 Z" fill={zariGold} />
                </g>
              )}
            </g>
          )}

          {/* DORI & LATKAN TASSELS FOR BACK VIEW */}
          {viewAngle === 'back' && hasLatkan && (
            <g>
              {/* Top Tie String */}
              <path d="M 110,65 Q 150,90 190,65" fill="none" stroke="#d4af37" strokeWidth="2.5" />
              
              {/* Left Latkan */}
              <line x1="135" y1="78" x2="135" y2="120" stroke="#d4af37" strokeWidth="1.5" />
              <polygon points="135,120 128,135 142,135" fill="#4a0e17" stroke="#d4af37" strokeWidth="1" />
              <circle cx="135" cy="138" r="3" fill="#d4af37" />

              {/* Right Latkan */}
              <line x1="165" y1="78" x2="165" y2="120" stroke="#d4af37" strokeWidth="1.5" />
              <polygon points="165,120 158,135 172,135" fill="#4a0e17" stroke="#d4af37" strokeWidth="1" />
              <circle cx="165" cy="138" r="3" fill="#d4af37" />
            </g>
          )}

          {/* WAISTBAND SEAM */}
          <line x1="85" y1="210" x2="215" y2="210" stroke={hasPiping ? '#d4af37' : 'rgba(0,0,0,0.2)'} strokeWidth={hasPiping ? '3' : '1'} />

        </svg>

        {/* Live Active Badges */}
        <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dark)', background: 'rgba(255,255,255,0.85)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
          <span>Outfit: <strong>{garmentType === 'saree_to_frock' ? 'Saree Frock' : garmentType === 'designer_frock' ? 'Designer Frock' : 'Blouse'}</strong></span>
          {embroidery !== 'none' && (
            <span style={{ color: 'var(--gold-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Sparkles size={12} /> Aari Active
            </span>
          )}
        </div>

      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.8rem', textAlign: 'center' }}>
        💡 Switch between <strong>Front View</strong> and <strong>Back View</strong> to inspect custom necklines & Aari details.
      </p>
    </div>
  );
}
