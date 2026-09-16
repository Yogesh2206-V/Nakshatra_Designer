import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, MessageSquare, ThumbsUp, Sparkles, CheckCircle2, User, Send, Filter, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';

export default function ReviewsFeedback({ currentUser, onRequireAuth }) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);
  const [reviewsList, setReviewsList] = useState([
    {
      id: 201,
      name: 'Jeeva Annadurai',
      location: 'Tiruchengode',
      rating: 5,
      date: '22 Feb 2025',
      category: 'Bridal Aari Work',
      comment: "I had an excellent experience at Nakshatra Designer's! Their quick service and on-time delivery exceeded my expectations. The management is highly efficient, ensuring smooth operations throughout. The quality of work was outstanding, and I found their prices to be reasonably priced for the high standards they maintain. Highly recommend for all stitching and design needs!",
      tags: ['Good work', 'High quality', 'Quick service', 'On-time delivery', 'Good management', 'Reasonably priced'],
      photo: '/asset/blouses/blouse_61.jpeg',
      verified: true,
      source: 'Justdial Verified',
      likes: 24,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '15 Jun',
        text: 'Appreciate the positive feedback on service and quality. It means a lot to know the experience met expectations.'
      }
    },
    {
      id: 202,
      name: 'MOWNIKA',
      location: 'Tiruchengode',
      rating: 5,
      date: '22 Aug',
      category: 'Custom Saree Blouse',
      comment: "The stitching is very neat and good. The quality is also nice, and I am satisfied with the finishing.",
      tags: ['Good work', 'Neat Stitching', 'Quality Finish'],
      verified: true,
      source: 'Justdial Verified',
      likes: 15,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '22 Aug',
        text: 'Appreciate how neat the stitching looks and that the finish turned out well.'
      }
    },
    {
      id: 203,
      name: 'Selvi Lakshmanan',
      location: 'Tiruchengode',
      rating: 5,
      date: '07 Jul',
      category: 'Custom Saree Blouse',
      comment: "I recently had the pleasure of working with Nakshatra Designer's, and I must say, their service is exceptional! The good work they deliver is evident in every detail, showcasing meticulous finishing that truly stands out. They are remarkably punctual with on-time delivery and offer reasonably priced options. Plus, their quick service is a bonus! Don't miss out on their seasonal deals – they're fantastic! Highly recommend!",
      tags: ['Good work', 'Detailed finishing', 'Quick service', 'On-time delivery', 'Reasonably priced', 'Seasonal deals'],
      verified: true,
      source: 'Justdial Verified',
      likes: 19,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '07 Jul',
        text: "Thanks for the feedback. We're glad the details and timing worked well for you."
      }
    },
    {
      id: 204,
      name: 'Jaya',
      location: 'Tiruchengode West',
      rating: 5,
      date: '16 Jun',
      category: 'Designer Frock',
      comment: "I recently had an excellent experience with Nakshatra Designers. They provided high-quality work that truly impressed me. The service was quick, and they delivered on time, which I really appreciated. I loved how customizable their options were, allowing for detailed finishing to match my needs. Plus, their prices are reasonable! I highly recommend them for any tailoring and service needs!",
      tags: ['Good work', 'High quality', 'Detailed finishing', 'Customisable', 'Quick service', 'On-time delivery', 'Reasonably priced'],
      verified: true,
      source: 'Justdial Verified',
      likes: 17,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '16 Jun',
        text: 'Appreciate you sharing how satisfied you were with the service.'
      }
    },
    {
      id: 205,
      name: 'Megala G',
      location: 'Tiruchengode',
      rating: 5,
      date: '26 Jul 2025',
      category: 'Custom Saree Blouse',
      comment: "I had a great experience with Nakshatra Designer's! They delivered on time, which was really impressive. The service was quick and efficient, making the whole process easy for me. I appreciated their professionalism and attention to detail. If you need to stitch anything, I highly recommend Nakshatra Designer's! Excellent work overall! Finishing is very nice",
      tags: ['Quick service', 'On-time delivery', 'Attention to detail', 'Excellent Finishing'],
      verified: true,
      source: 'Justdial Verified',
      likes: 13
    },
    {
      id: 206,
      name: 'Ranjidha Shasmitha GR',
      location: 'Namakkal',
      rating: 5,
      date: '11 Mar 2025',
      category: 'Bridal Aari Work',
      comment: "I had an excellent experience at Nakshatra Designer's! Their reasonably priced services exceeded my expectations. The quality of work was outstanding, with detailed finishing that truly impressed me. They delivered on time and provided quick service without compromising on craftsmanship. Highly recommend for anyone needing reliable tailoring and design services!",
      tags: ['Good work', 'High quality', 'Detailed finishing', 'Quick service', 'On-time delivery', 'Reasonably priced'],
      verified: true,
      source: 'Justdial Verified',
      likes: 22,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '15 Jun',
        text: "Thanks for the kind words — it's great to hear the work met your expectations."
      }
    },
    {
      id: 207,
      name: 'SUREKA S',
      location: 'Tiruchengode',
      rating: 5,
      date: '26 Feb 2025',
      category: 'Custom Saree Blouse',
      comment: "I had a great experience with Nakshatra Designer's. Their prices are reasonable, which I really liked. The service was quick, and they delivered on time. The work they did was very good and high quality. I also noticed the detailed finishing in their work. Overall, I am very happy with my interaction with Nakshatra Designer's!",
      tags: ['Good work', 'High quality', 'Detailed finishing', 'Quick service', 'On-time delivery', 'Reasonably priced'],
      verified: true,
      source: 'Justdial Verified',
      likes: 16,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '15 Jun',
        text: 'Thanks for the kind words.'
      }
    },
    {
      id: 208,
      name: 'Anitha',
      location: 'Salem',
      rating: 5,
      date: '19 Feb 2025',
      category: 'Bridal Aari Work',
      comment: "I had a great experience with Nakshatra Designer's! They delivered my order right on time, which I really appreciated. Their service was quick and efficient, and the staff were very polite throughout the process. The management is excellent, ensuring everything runs smoothly. The quality of their work is high, with detailed finishing that exceeded my expectations. Plus, they offer customization options! Highly recommend!",
      tags: ['High quality', 'Detailed finishing', 'Customisable', 'Quick service', 'On-time delivery', 'Polite staff', 'Good management'],
      verified: true,
      source: 'Justdial Verified',
      likes: 20,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '07 Jul',
        text: 'Good to know the customization options worked well for you. Thanks for supporting us.'
      }
    },
    {
      id: 209,
      name: 'Kishor',
      location: 'Tiruchengode',
      rating: 5,
      date: '26 Jan 2025',
      category: 'Custom Saree Blouse',
      comment: "Nakshatra Designers offers excellent tailoring and services at a reasonably priced. Their work is top-notch, and they provide great value for money. With their skilled team, you can trust them to handle all your stitching needs with efficiency and professionalism.",
      tags: ['Good work', 'Reasonably priced', 'Top Notch'],
      verified: true,
      source: 'Justdial Verified',
      likes: 11
    },
    {
      id: 101,
      name: 'Selva Kumar',
      location: 'Tiruchengode',
      rating: 5,
      date: '25 Dec 2024',
      category: 'Custom Saree Blouse',
      comment: "Nakshatra Designer's provided excellent services. The quality of their work was top-notch, and the staff was friendly and knowledgeable. I highly recommend them for their good workmanship.",
      tags: ['Good work', 'High quality', 'Polite staff'],
      verified: true,
      source: 'Justdial Verified',
      likes: 18,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '07 Jul',
        text: 'Thanks for the kind words — we appreciate the feedback on our work and team.'
      }
    },
    {
      id: 102,
      name: 'Kishor',
      location: 'Tiruchengode',
      rating: 5,
      date: '22 Dec 2024',
      category: 'Designer Frock',
      comment: "I recently had tailoring done at Nakshatra Designer's and I must say, the staff was extremely polite and the service was quick. The management was good, ensuring high quality and customizable options. The work done was excellent and the pricing was reasonable. Highly recommend!",
      tags: ['Good work', 'High quality', 'Customisable', 'Quick service', 'Polite staff', 'Good management', 'Reasonably priced'],
      verified: true,
      source: 'Justdial Verified',
      likes: 21
    },
    {
      id: 103,
      name: 'RATHANA PPRIYA',
      location: 'Tiruchengode',
      rating: 5,
      date: '07 Sept',
      category: 'Bridal Aari Work',
      comment: "I like they work and they delivered within 5 days and the aari work was too good",
      tags: ['Quick service', 'On-time delivery', 'Aari Work'],
      verified: true,
      source: 'Justdial Verified',
      likes: 16,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '07 Sept',
        text: 'Good to hear the service worked well and arrived as promised.'
      }
    },
    {
      id: 104,
      name: 'Vanitha',
      location: 'Tiruchengode',
      rating: 5,
      date: '16 Dec 2024',
      category: 'Custom Saree Blouse',
      comment: "Excellent",
      tags: ['Good work', 'High quality', 'Quick service'],
      verified: true,
      source: 'Justdial Verified',
      likes: 12,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '07 Jul',
        text: "Great to hear you're happy."
      }
    },
    {
      id: 105,
      name: 'Anushya',
      location: 'Tiruchengode',
      rating: 5,
      date: '18 May',
      category: 'Custom Saree Blouse',
      comment: "Great quality tailoring and on-time delivery with reasonable pricing. Highly satisfied!",
      tags: ['Good work', 'Quick service', 'On-time delivery', 'Reasonably priced'],
      verified: true,
      source: 'Justdial Verified',
      likes: 14,
      ownerResponse: {
        author: "Nakshatra Designer's",
        date: '15 Jun',
        text: 'Thanks for recognizing the reasonable pricing and good work.'
      }
    },
    {
      id: 106,
      name: 'Sridevi Madhan',
      location: 'Namakkal',
      rating: 5,
      date: '10 Feb 2025',
      category: 'Bridal Aari Work',
      comment: "Quick service and on-time delivery with good management and courteous staff.",
      tags: ['Quick service', 'On-time delivery', 'Good management'],
      verified: true,
      source: 'Justdial Verified',
      likes: 10
    },
    {
      id: 107,
      name: 'Jeeveeka',
      location: 'Tiruchengode',
      rating: 5,
      date: '28 Dec 2024',
      category: 'Custom Saree Blouse',
      comment: "Very good",
      tags: ['Good work', 'Perfect Fitting'],
      verified: true,
      source: 'Justdial Verified',
      likes: 8
    },
    {
      id: 108,
      name: 'Yamini P',
      location: 'Tiruchengode',
      rating: 5,
      date: '25 Dec 2024',
      category: 'Saree-to-Frock Conversion',
      comment: "Good work and nice finishing on saree conversion.",
      tags: ['Good work', 'Quality Stitching'],
      verified: true,
      source: 'Justdial Verified',
      likes: 9
    },
    {
      id: 109,
      name: 'Sivhani',
      location: 'Tiruchengode West',
      rating: 5,
      date: '29 Dec 2024',
      category: 'Bridal Aari Work',
      comment: "Beautiful Aari design work and perfect fit. Highly recommended!",
      tags: ['Good work', 'Bridal Aari'],
      verified: true,
      source: 'Justdial Verified',
      likes: 11
    },
    {
      id: 1,
      name: 'Priya Rajendran',
      location: 'Tiruchengode',
      rating: 5,
      date: '2 days ago',
      category: 'Bridal Aari Work',
      comment: "Nakshatra Designer's stitched my bridal Aari work blouse perfectly! The gold zardozi detailing and fitting were flawless. Everyone at the wedding complimented the neckline finish. Highly recommend for any bride!",
      tags: ['Bridal Aari', 'Perfect Fit', 'Flawless Detailing'],
      verified: true,
      source: 'Verified Client',
      likes: 14
    },
    {
      id: 2,
      name: 'Kavitha S.',
      location: 'Namakkal',
      rating: 5,
      date: '1 week ago',
      category: 'Saree-to-Frock Conversion',
      comment: "Converted my old mother's Kanjivaram silk saree into an umbrella flare maxi frock. The outcome is stunning! Fits like a glove with zero wastage of saree border.",
      tags: ['Saree Reuse', 'Umbrella Flare', 'Zero Waste'],
      verified: true,
      source: 'Verified Client',
      likes: 9
    },
    {
      id: 3,
      name: 'Deepa V.',
      location: 'Erode',
      rating: 5,
      date: '2 weeks ago',
      category: 'Custom Saree Blouse',
      comment: 'Very polite behavior and accurate measurements. Handed over 3 blouses for emergency delivery in 3 days, and they delivered right on time with flawless fitting. Outstanding craftsmanship!',
      tags: ['Emergency Delivery', 'Polite Staff', 'Accurate Measurements'],
      verified: true,
      source: 'Verified Client',
      likes: 11
    },
    {
      id: 4,
      name: 'Sangeetha M.',
      location: 'Tiruchengode West',
      rating: 5,
      date: '3 weeks ago',
      category: 'Saree Pre-Pleating',
      comment: 'Their saree pre-pleating and box folding service is a lifesaver! I wore my silk saree in under 1 minute for a function. Extremely neatly ironed and folded.',
      tags: ['1-Min Draping', 'Box Folding', 'Neat Ironing'],
      verified: true,
      source: 'Verified Client',
      likes: 7
    },
    {
      id: 5,
      name: 'Meenakshi Sundaram',
      location: 'Salem',
      rating: 5,
      date: '1 month ago',
      category: 'Designer Frock',
      comment: 'Got a custom box-pleated Anarkali frock stitched for my daughter. The finishing around the neckline and sleeves is neat with soft double cotton lining. Best boutique in Tiruchengode region!',
      tags: ['Anarkali Frock', 'Cotton Lining', 'Soft Fabric'],
      verified: true,
      source: 'Verified Client',
      likes: 15
    }
  ]);

  // Form State for New Review
  const [newRating, setNewRating] = useState(5);
  const [newCategory, setNewCategory] = useState('Bridal Aari Work');
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser ? currentUser.name : '');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const categories = ['All', 'Bridal Aari Work', 'Saree-to-Frock Conversion', 'Custom Saree Blouse', 'Saree Pre-Pleating', 'Designer Frock'];

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const action = () => {
      const createdReview = {
        id: Date.now(),
        name: reviewerName || (currentUser ? currentUser.name : 'Valued Customer'),
        location: 'Tiruchengode',
        rating: newRating,
        date: 'Just now',
        category: newCategory,
        comment: newComment,
        verified: true,
        likes: 0
      };

      setReviewsList([createdReview, ...reviewsList]);
      setNewComment('');
      setCurrentPage(1);
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 4000);
    };

    if (onRequireAuth) {
      onRequireAuth(action, 'Please sign up or log in to post your customer review.');
    } else {
      action();
    }
  };

  const handleLike = (id) => {
    setReviewsList(reviewsList.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  const totalPages = Math.ceil(reviewsList.length / reviewsPerPage);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const startIndex = (safeCurrentPage - 1) * reviewsPerPage;
  const paginatedReviews = reviewsList.slice(startIndex, startIndex + reviewsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const el = document.getElementById('reviews-list-start');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <div className="section-container" style={{ paddingBottom: '5rem' }}>
      {/* Title & Overview Banner */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
        <span className="gold-badge" style={{ marginBottom: '0.6rem' }}>
          <Sparkles size={14} /> Verified Customer Feedback
        </span>
        <h2 style={{ fontSize: '2.4rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)', marginBottom: '0.6rem' }}>
          Customer Reviews & Rating Overview
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.6 }}>
          Read genuine reviews from thousands of happy customers across Tiruchengode, Salem, Namakkal, and Erode for Nakshatra Designer's custom tailoring services.
        </p>
      </div>

      {/* Ratings Summary Card */}
      <div className="glass-card review-summary-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          
          {/* Overall Rating Block */}
          <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-light)', paddingRight: '1rem' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary-emerald)', lineHeight: 1 }}>4.9</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', margin: '0.5rem 0' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={22} fill="#d4af37" color="#d4af37" />
              ))}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Based on <strong>28+ Justdial Reviews</strong> & Google Reviews
            </p>
            <div className="gold-badge" style={{ marginTop: '0.8rem', display: 'inline-flex' }}>
              <CheckCircle2 size={13} /> 100% Fit Satisfaction Verified
            </div>
          </div>

          {/* Star Distribution Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem' }}>
              <span style={{ width: '55px' }}>5 Stars</span>
              <div style={{ flex: 1, background: '#f1f5f9', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '94%', background: 'var(--accent-gold)', height: '100%' }} />
              </div>
              <span style={{ width: '35px', fontWeight: 600 }}>94%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem' }}>
              <span style={{ width: '55px' }}>4 Stars</span>
              <div style={{ flex: 1, background: '#f1f5f9', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '6%', background: 'var(--accent-gold)', height: '100%' }} />
              </div>
              <span style={{ width: '35px', fontWeight: 600 }}>6%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem' }}>
              <span style={{ width: '55px' }}>3 Stars</span>
              <div style={{ flex: 1, background: '#f1f5f9', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '0%', background: 'var(--accent-gold)', height: '100%' }} />
              </div>
              <span style={{ width: '35px', fontWeight: 600 }}>0%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem' }}>
              <span style={{ width: '55px' }}>2 Stars</span>
              <div style={{ flex: 1, background: '#f1f5f9', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '0%', background: 'var(--accent-gold)', height: '100%' }} />
              </div>
              <span style={{ width: '35px', fontWeight: 600 }}>0%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem' }}>
              <span style={{ width: '55px' }}>1 Star</span>
              <div style={{ flex: 1, background: '#f1f5f9', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '0%', background: 'var(--accent-gold)', height: '100%' }} />
              </div>
              <span style={{ width: '35px', fontWeight: 600 }}>0%</span>
            </div>
          </div>

          {/* Quick Highlight Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ background: '#faf6f0', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f1e5d1' }}>
              <strong style={{ color: 'var(--primary-emerald)', fontSize: '0.9rem' }}>🏆 Top Tailoring Studio</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Voted #1 for Aari Work & Saree-to-Frock conversions in Tiruchengode.</p>
            </div>
            <div style={{ background: '#faf6f0', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f1e5d1' }}>
              <strong style={{ color: 'var(--primary-emerald)', fontSize: '0.9rem' }}>✨ 25+ Years Legacy</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Serving clients with premium fitting & quick delivery since 2000.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Left Review Submission Form, Right Reviews List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Form: Submit Review */}
        <div className="glass-card review-form-card" style={{ padding: '2rem', sticky: 'top', top: '100px' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} color="var(--accent-gold)" /> Share Your Feedback
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Have you stitched a blouse or converted a saree with us? Share your experience!
          </p>

          {submittedSuccess && (
            <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '0.9rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.2rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> Thank you! Your review has been posted successfully.
            </div>
          )}

          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* Rating Picker */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-emerald)', display: 'block', marginBottom: '0.4rem' }}>
                Your Rating:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Star 
                      size={28} 
                      fill={star <= newRating ? "#d4af37" : "none"} 
                      color={star <= newRating ? "#d4af37" : "#cbd5e1"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category dropdown */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-emerald)', display: 'block', marginBottom: '0.4rem' }}>
                Stitching Service Category:
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              >
                <option value="Bridal Aari Work">Bridal Aari Work</option>
                <option value="Saree-to-Frock Conversion">Saree-to-Frock Conversion</option>
                <option value="Custom Saree Blouse">Custom Saree Blouse</option>
                <option value="Saree Pre-Pleating">Saree Pre-Pleating</option>
                <option value="Designer Frock">Designer Frock</option>
              </select>
            </div>

            {/* Customer Name */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-emerald)', display: 'block', marginBottom: '0.4rem' }}>
                Your Name:
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                value={reviewerName}
                onChange={e => setReviewerName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              />
            </div>

            {/* Review Comment */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-emerald)', display: 'block', marginBottom: '0.4rem' }}>
                Your Review & Feedback:
              </label>
              <textarea
                rows={4}
                placeholder="Describe fitting, embroidery quality, customer service..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                required
                style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}>
              <Send size={18} /> Submit Verified Review
            </button>
          </form>
        </div>

        {/* Right List: Filterable Reviews */}
        {/* Right List: Customer Reviews (1 Review at a time with Prev / Next) */}
        <div>
          <div id="reviews-list-start" />

          {/* Reviews List (1 Review per page) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {paginatedReviews.map(rev => (
              <div key={rev.id} className="glass-card review-item-card animate-fade-in" style={{ padding: '1.5rem', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0b2b26 0%, #4a0e17 100%)',
                      color: '#d4af37',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    }}>
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '1rem', color: 'var(--primary-emerald)' }}>{rev.name}</strong>
                        {rev.source === 'Justdial Verified' ? (
                          <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle2 size={11} color="#2563eb" /> Justdial Verified
                          </span>
                        ) : rev.verified && (
                          <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 600 }}>
                            Verified Client
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {rev.location} • {rev.date}</span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={{ display: 'flex', gap: '0.15rem' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#d4af37" color="#d4af37" />
                    ))}
                  </div>
                </div>

                {/* Tags Badges (e.g. Good work, High quality, Quick service, Reasonably priced) */}
                {rev.tags && rev.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.6rem 0 0.8rem 0' }}>
                    {rev.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="review-tag-badge"
                        style={{
                          fontSize: '0.74rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontWeight: 500
                        }}
                      >
                        <ThumbsUp size={11} color="#10b981" /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Review Text */}
                <div style={{ marginBottom: '0.8rem' }}>
                  <span className="gold-badge" style={{ fontSize: '0.75rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                    {rev.category}
                  </span>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', lineHeight: 1.6, fontStyle: rev.comment.length < 20 ? 'italic' : 'normal' }}>
                    "{rev.comment}"
                  </p>

                  {/* Customer Attached Photo Thumbnail (if present) */}
                  {rev.photo && (
                    <div style={{ marginTop: '0.8rem' }}>
                      <div 
                        onClick={() => setSelectedPhotoModal(rev)}
                        style={{
                          width: '90px',
                          height: '90px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '2px solid var(--accent-gold)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                        title="Click to view full photo"
                      >
                        <img 
                          src={rev.photo} 
                          alt="Customer attached work" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          opacity: 0,
                          transition: 'opacity 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                        onMouseOut={e => e.currentTarget.style.opacity = 0}
                        >
                          <Eye size={20} />
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem', cursor: 'pointer' }} onClick={() => setSelectedPhotoModal(rev)}>
                        📷 1 Photo attached by client (Click to view)
                      </span>
                    </div>
                  )}
                </div>

                {/* Owner Response Box (if present) */}
                {rev.ownerResponse && (
                  <div className="review-owner-response" style={{
                    borderLeft: '3px solid var(--accent-gold)',
                    borderRadius: '0 8px 8px 0',
                    padding: '0.8rem 1rem',
                    margin: '0.8rem 0 0.5rem 0',
                    fontSize: '0.84rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary-emerald)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--primary-emerald)', color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>✂️</span>
                        {rev.ownerResponse.author} <span style={{ fontSize: '0.72rem', background: '#e2e8f0', color: '#475569', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>Owner Response</span>
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{rev.ownerResponse.date}</span>
                    </div>
                    <p style={{ color: 'var(--text-dark)', margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
                      {rev.ownerResponse.text}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={13} color="#10b981" /> Verified Review
                  </span>
                  <button
                    onClick={() => handleLike(rev.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                  >
                    <ThumbsUp size={14} /> Helpful ({rev.likes})
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Next / Prev Pagination Controls Bar */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem',
              padding: '0.85rem 1.2rem',
              background: 'var(--bg-card)',
              borderRadius: '14px',
              border: '1px solid var(--border-light)',
              gap: '0.8rem',
              flexWrap: 'wrap'
            }}>
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: safeCurrentPage === 1 ? 'var(--border-light)' : 'var(--accent-gold)',
                  background: 'transparent',
                  color: safeCurrentPage === 1 ? 'var(--text-muted)' : 'var(--text-dark)',
                  opacity: safeCurrentPage === 1 ? 0.4 : 1,
                  cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {/* Review Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.92rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                  Page <strong style={{ color: 'var(--primary-emerald)', fontSize: '1.08rem' }}>{safeCurrentPage}</strong> of <strong>{totalPages}</strong> ({filteredReviews.length} total reviews)
                </span>
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage >= totalPages}
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: safeCurrentPage >= totalPages ? 'var(--border-light)' : 'var(--accent-gold)',
                  background: 'transparent',
                  color: safeCurrentPage >= totalPages ? 'var(--text-muted)' : 'var(--text-dark)',
                  opacity: safeCurrentPage >= totalPages ? 0.4 : 1,
                  cursor: safeCurrentPage >= totalPages ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* High-Resolution Review Photo Lightbox Modal */}
      {selectedPhotoModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setSelectedPhotoModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '2px solid var(--accent-gold)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.3)',
              width: '100%',
              maxWidth: '750px',
              maxHeight: '92vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.2rem 1.6rem',
              borderBottom: '1px solid #e2e8f0',
              background: '#ffffff'
            }}>
              <div>
                <span className="gold-badge" style={{ fontSize: '0.72rem', marginBottom: '0.2rem', display: 'inline-block' }}>
                  Customer Attached Photo • {selectedPhotoModal.category}
                </span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-emerald)', fontWeight: 800, margin: 0, fontFamily: 'var(--font-serif)' }}>
                  Work shared by {selectedPhotoModal.name}
                </h3>
              </div>
              
              <button
                type="button"
                onClick={() => setSelectedPhotoModal(null)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  color: '#334155',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
                title="Close Photo"
              >
                <X size={20} />
              </button>
            </div>

            {/* High-Resolution Full Image */}
            <div style={{ 
              background: '#0b2b26', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '340px', 
              maxHeight: '62vh',
              overflow: 'hidden',
              padding: '0.5rem'
            }}>
              <img 
                src={selectedPhotoModal.photo} 
                alt={selectedPhotoModal.name} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '60vh', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                  display: 'block' 
                }} 
              />
            </div>

            {/* Modal Review Summary / Footer */}
            <div style={{ padding: '1.2rem 1.6rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', margin: 0, fontStyle: 'italic', maxWidth: '80%' }}>
                "{selectedPhotoModal.comment}"
              </p>

              <button
                type="button"
                onClick={() => setSelectedPhotoModal(null)}
                className="btn-gold"
                style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem', cursor: 'pointer' }}
              >
                Close View
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
