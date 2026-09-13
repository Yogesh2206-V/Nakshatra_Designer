import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Sparkles, PhoneCall, Bot, User, Scissors, CheckCircle2 } from 'lucide-react';
import EnquiryIcon from './EnquiryIcon';

export default function ChatbotWidget({ isOpen, onClose, initialContext = '' }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! Welcome to Nakshatra Designer's Chatbot. How can I help you today with your blouse stitching, Aari work, or saree-to-frock conversion?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // When opened with specific inquiry context (e.g. "Saree Converted Frock")
  useEffect(() => {
    if (initialContext && isOpen) {
      const prompt = `Hi, I am interested in inquiring about: ${initialContext}`;
      handleSendMessage(prompt);
    }
  }, [initialContext, isOpen]);

  const quickQuestions = [
    'What is the price for Saree Blouse?',
    'How does Saree to Frock conversion work?',
    'Tell me about Aari Embroidery work',
    'Where is the shop located in Tiruchengode?'
  ];

  const getBotResponse = (userMsg) => {
    const text = userMsg.toLowerCase();

    // 1. Saree Pre-Pleating & Box Folding
    if (text.includes('pleat') || text.includes('folding') || text.includes('box fold') || text.includes('pre-pleat')) {
      return "🥻 Saree Pre-Pleating & Box Folding:\n\n• Professional pallu setting, crisp uniform pleats, and 1-minute wearing box fold.\n• Perfect for bridal sarees, Kanjivaram silk, and party wear so your pleats stay intact throughout your event!\n• Same-day express service available at our Tiruchengode studio.\n\nWould you like to drop off your sarees for pre-pleating?";
    }

    // 1b. Skirt & Shirt / Kids Ethnic Wear
    if (text.includes('skirt') || text.includes('shirt') || text.includes('pavadai') || text.includes('pattu pavadai') || text.includes('kids ethnic')) {
      return "👗 Skirt & Shirt / Kids Ethnic Wear:\n\n• Traditional Pattu Pavadai sets, peplum collar shirt tops with zari box pleat skirts, sweetheart crop tops, and mirror-work wrap blouses.\n• Custom fitted for kids, teenage girls, and women in pure silk, raw silk, and festive fabrics.\n• Custom tailoring with soft inner linings and adjustable margins.\n\nCheck out the 'Skirt Shirt' category in our Lookbook or contact us on WhatsApp (+91 91235 14214) to customize!";
    }

    // 1c. Chudithar & Salwar Kurti Tailoring
    if (text.includes('chudithar') || text.includes('salwar') || text.includes('kurti') || text.includes('kameez') || text.includes('pant')) {
      return "🪡 Custom Chudithar & Salwar Kurti Stitching:\n\n• Tailoring Options: Straight cut kurtis, A-line flared chudithars, keyhole cutout back necks, potli button necklines, and puff/elbow sleeves.\n• Perfectly stitched with pure cotton lining, pants/palazzos, and dupatta finishing.\n• Check out the 'Chudithar' collection in our Lookbook or WhatsApp us (+91 91235 14214) with your fabric!";
    }

    // 1d. Bridal & Festive Lehenga Choli
    if (text.includes('lehenga') || text.includes('choli') || text.includes('ghagra') || text.includes('crop top')) {
      return "👑 Bridal & Festive Lehenga Choli Tailoring:\n\n• Tailoring Styles: Royal velvet blouses with petal cutouts, sweetheart neck crop tops, and floral georgette/brocade box-pleat lehengas.\n• Custom latkans & hanging lotus tassels, built-in double lining and Can-Can volume.\n• Check out the 'Lehenga' collection in our Lookbook or WhatsApp us (+91 91235 14214) to customize!";
    }

    // 2. Saree Converted Frock / Saree Reuse
    if (text.includes('convert') || text.includes('reuse') || text.includes('saree to frock') || text.includes('saree converted')) {
      return "♻️ Saree Converted Maxi Frock (Saree Reuse):\n\n• Upcycle your vintage or heavy silk sarees into grand 360° umbrella flared gowns, box pleated dresses, or tiered maxi frocks.\n• Executed with precision pattern cutting to preserve the rich saree pallu & borders without fabric waste.\n• Bring any Kanjivaram, soft silk, or designer saree to our boutique!\n\nWould you like to customize your neckline & flare design?";
    }

    // 3. Custom Saree Blouse / Specific Blouse Design
    if (text.includes('blouse') || text.includes('katori') || text.includes('zardozi') || text.includes('maggam') || text.includes('brocade') || text.includes('peacock') || text.includes('cutwork') || text.includes('sweetheart') || text.includes('boat')) {
      return "✂️ Custom Saree Blouse & Aari Stitching Details:\n\n• Tailoring Styles: Katori Cut, Padded Princess Cut, Sweetheart Neck, Boat Neck, Deep U with Latkans, Potli Keyhole, and Royal South Indian Puff Sleeves.\n• Authentic Handwork: Fine Zardozi embroidery, Maggam beads, Kundan stones, and temple motifs.\n• Perfect Fit Guarantee: Custom tailored with soft double cotton lining and in-shop trial fittings.\n• Delivery: Express 3-5 days delivery available.\n\nWould you like to customize your neckline or share your fabric details on WhatsApp?";
    }

    // 4. Designer Frock / Long Gown
    if (text.includes('designer frock') || text.includes('long gown') || text.includes('anarkali') || text.includes('frock') || text.includes('gown')) {
      return "👗 Designer Frock & Long Gown Tailoring:\n\n• Available in 360° Umbrella Circle Flare, Box Pleated Royal flare, and Tiered Gowns for women and kids.\n• Includes comfortable cotton lining and optional Can-Can stiffness for grand volume.\n• Tailored to your exact height and bodice measurements.\n\nWould you like to select your flare silhouette now?";
    }

    // 5. Neckline Delicate Aari Work / Maggam
    if (text.includes('aari') || text.includes('embroidery') || text.includes('maggam') || text.includes('zardozi') || text.includes('neckline delicate') || text.includes('neckline')) {
      return "🪡 Authentic Handcrafted Aari & Maggam Work:\n\n• Handcrafted zardozi, moti beads, French knots, Kundan stonework, and temple peacock motifs.\n• Available on blouse front/back necklines, elbow sleeves, and bridal borders.\n• Done by master artisans in Tiruchengode with flawless finishing.\n\nWould you like to explore our bridal Aari blouse patterns?";
    }

    // 6. General Tailoring Rates & Consultation
    if (text.includes('consultation') || text.includes('rate') || text.includes('price') || text.includes('cost') || text.includes('affordable')) {
      return "🏷️ Nakshatra Tailoring Consultation & Rates:\n\n• All tailoring rates at Nakshatra Designer's are kept very affordable and transparent based on your custom options (neck cuts, Aari complexity, flare style).\n• Free in-shop trial fitting and consultations available Mon–Sat 9:30 AM to 8:00 PM.\n\nFeel free to ask about any specific design or call us directly at +91 91235 00065!";
    }

    // 7. Shop Location & Contact
    if (text.includes('location') || text.includes('shop') || text.includes('address') || text.includes('timing') || text.includes('where')) {
      return "📍 Nakshatra Designer's Studio Location:\n\n• Address: No 62/2, Everest Balaji Arcade, South Car Street (Opp. Sivakumar Metal Mart), Tiruchengode West, Tamil Nadu 637211.\n• Timings: Mon – Sat: 9:30 AM – 8:00 PM | Sun: 11:00 AM – 2:00 PM.\n• Call: +91 91235 00065 | WhatsApp: +91 91235 14214";
    }

    // 8. Measurements & Fitting
    if (text.includes('measurement') || text.includes('fitting') || text.includes('trial')) {
      return "📏 Measurement & Fitting Options:\n\n1. Digital Specs: Enter your body measurements directly in our online customizer.\n2. In-Shop Trial: Visit our Tiruchengode studio for precise measurements taken by master tailors.\n3. Sample Pickup: Provide a sample well-fitting blouse for exact replica tailoring.";
    }

    return "Thank you for reaching out to Nakshatra Designer's! Our master tailor team specializes in Custom Blouses, Designer Frocks, Aari Handwork, and Saree Conversions. You can chat directly with us here or on WhatsApp at +91 91235 14214!";
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMessage = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botReplyText = getBotResponse(query);
      const botMessage = {
        sender: 'bot',
        text: botReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-modal-window">
      
      {/* Chatbot Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0b2b26 0%, #164e43 100%)',
        color: '#ffffff',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <EnquiryIcon size={34} style={{ borderRadius: '50%' }} />
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: '#ffffff', lineHeight: 1.1 }}>
              Nakshatra Assistant
            </h4>

            <span style={{ fontSize: '0.74rem', color: '#9ae6b4', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Live Tailoring Enquiry
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 30, height: 30, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '0.75rem 1rem',
              borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
              background: msg.sender === 'user' ? '#0b2b26' : '#ffffff',
              color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
              fontSize: '0.88rem',
              lineHeight: 1.45,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: msg.sender === 'bot' ? '1px solid #cbd5e1' : 'none',
              whiteSpace: 'pre-line'
            }}>
              {msg.text}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.2rem', padding: '0 0.3rem', fontWeight: 500 }}>
              {msg.time}
            </span>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff', padding: '0.6rem 0.9rem', borderRadius: '12px', width: 'fit-content', border: '1px solid #e2e8f0' }}>
            <Bot size={16} color="var(--primary-emerald)" />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Nakshatra Assistant is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div style={{ padding: '0.5rem 0.8rem', background: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.4rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '14px',
              border: '1px solid var(--accent-gold)',
              background: '#fffdf5',
              color: 'var(--primary-emerald)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input & WhatsApp Direct Link */}
      <div style={{ padding: '0.8rem', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem' }}
        >
          <input
            type="text"
            placeholder="Type your enquiry message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              padding: '0.65rem 0.9rem',
              borderRadius: '20px',
              border: '1px solid var(--border-light)',
              outline: 'none',
              fontSize: '0.86rem'
            }}
          />
          <button
            type="submit"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--primary-emerald)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Send size={16} />
          </button>
        </form>

        <a
          href="https://wa.me/919123514214?text=Hi%20Nakshatra%20Designers%2C%20I%20want%20to%20enquire%20about%20stitching%20rates"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            background: '#25D366',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.45rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            fontWeight: 600
          }}
        >
          <PhoneCall size={14} /> Direct WhatsApp Chat (+91 91235 14214)
        </a>
      </div>

    </div>
  );
}
