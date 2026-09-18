import React, { useState, useEffect } from 'react';
import { Ruler, Truck, CheckCircle2, ArrowLeft, ShieldCheck, Phone, MapPin, User, MessageCircle, AlertCircle } from 'lucide-react';
import EnquiryIcon from './EnquiryIcon';

export default function MeasurementForm({ designSpecs, totalPrice, onBack, onOrderSuccess, currentUser, onRequireAuth, onOpenEnquiry }) {
  const [submissionType, setSubmissionType] = useState('digital'); // 'digital' or 'pickup'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Customer Contact State
  const [customer, setCustomer] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phoneOrEmail || '',
    email: '',
    address: ''
  });

  useEffect(() => {
    if (currentUser) {
      setCustomer(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phoneOrEmail || prev.phone
      }));
    }
  }, [currentUser]);

  // Digital Measurement State (inches)
  const [measurements, setMeasurements] = useState({
    bust: '36',
    upperChest: '34',
    underBust: '30',
    waist: '30',
    blouseLength: '14',
    shoulder: '14',
    frontNeckDepth: '7',
    backNeckDepth: '9.5',
    armhole: '16',
    sleeveLength: '10',
    sleeveRound: '12'
  });

  // Pickup Request State
  const [pickupNotes, setPickupNotes] = useState('Include 1 silk fabric + 1 sample best-fitting dress/blouse for master tailor reference');

  const executeOrderSubmission = async (customerData = customer) => {
    if (!customerData.name?.trim() || !customerData.phone?.trim()) {
      setErrorMessage('Please enter your Name and WhatsApp/Phone Number.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const payload = {
        customerName: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        address: customerData.address,
        designSpecs,
        measurements: submissionType === 'digital' ? measurements : null,
        pickupRequested: submissionType === 'pickup',
        pickupAddress: customerData.address,
        totalPrice: totalPrice || 'Affordable Custom Rate'
      };

      let placedOrder = null;

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.order) {
            placedOrder = data.order;
          }
        }
      } catch (err) {
        console.warn('Backend order sync warning:', err);
      }

      // If backend was offline or serverless, create local order object
      if (!placedOrder) {
        placedOrder = {
          id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
          ...payload,
          status: 'Order Received (Pending Verification)',
          orderDate: new Date().toISOString(),
          expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      }

      // Save to local storage
      try {
        const existingRaw = localStorage.getItem('nakshatra_user_orders');
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem('nakshatra_user_orders', JSON.stringify([placedOrder, ...existing]));
      } catch (e) {}

      onOrderSuccess(placedOrder);
    } catch (err) {
      console.error('Order error:', err);
      setErrorMessage('Error submitting order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!currentUser && onRequireAuth) {
      onRequireAuth(() => executeOrderSubmission(customer), 'Please sign up or log in to confirm your custom order.');
      return;
    }

    executeOrderSubmission(customer);
  };

  const garmentName = designSpecs?.category || 'Custom Tailoring';

  return (
    <div className="section-container" style={{ maxWidth: '900px' }}>
      <button className="btn-outline" style={{ marginBottom: '1.5rem' }} onClick={onBack}>
        <ArrowLeft size={16} /> Back to Customizer
      </button>

      <div className="glass-card" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.2rem', marginBottom: '1.8rem' }}>
          <span className="gold-badge" style={{ marginBottom: '0.4rem' }}>
            Final Step • Nakshatra Tailoring Order Setup
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)' }}>
            Customer Details & Garment Measurements
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Provide your contact details and choose whether to enter measurements digitally or visit our Tiruchengode shop for in-person measurement & fitting trial.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Customer Info */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-emerald)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--accent-gold)" /> Customer Contact Info
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Name"
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter Number"
                  value={customer.phone}
                  onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={customer.email}
                  onChange={e => setCustomer({ ...customer, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Customer Address / Area *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Door No, Street Name, Landmark, Tiruchengode"
                value={customer.address}
                onChange={e => setCustomer({ ...customer, address: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              />
            </div>
          </div>

          {/* Section 2: Submission Method Toggle */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-emerald)', marginBottom: '1rem' }}>
              Choose Fitting Reference Method
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              
              <div
                className={`option-card ${submissionType === 'digital' ? 'selected' : ''}`}
                onClick={() => setSubmissionType('digital')}
                style={{ padding: '1.2rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <Ruler size={22} color="var(--primary-emerald)" />
                  <h5 style={{ fontSize: '1rem', color: 'var(--primary-emerald)' }}>Enter Digital Measurements</h5>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Provide exact dimensions (chest, waist, frock length, sleeve) online for our master tailor.
                </p>
              </div>

              <div
                className={`option-card ${submissionType === 'pickup' ? 'selected' : ''}`}
                onClick={() => setSubmissionType('pickup')}
                style={{ padding: '1.2rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <Truck size={22} color="var(--accent-gold)" />
                  <h5 style={{ fontSize: '1rem', color: 'var(--primary-emerald)' }}>In-Shop Fitting Visit / Fabric Drop</h5>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Visit our shop in Tiruchengode to give measurements in-person or drop your silk saree / sample dress!
                </p>
              </div>

            </div>
          </div>

          {/* In-App Error Notification Banner */}
          {errorMessage && (
            <div style={{
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              color: '#991b1b',
              padding: '0.85rem 1.2rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.92rem',
              fontWeight: 600
            }}>
              <AlertCircle size={18} color="#dc2626" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 3: Digital Measurements Form */}
          {submissionType === 'digital' ? (
            <div style={{ background: 'var(--bg-champagne)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-emerald)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Ruler size={18} /> Body Measurement Specs for {garmentName} (All in Inches)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>1. Full Bust / Chest (Inches)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.bust}
                    onChange={e => setMeasurements({ ...measurements, bust: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>2. Upper Chest (Inches)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.upperChest}
                    onChange={e => setMeasurements({ ...measurements, upperChest: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>3. Under Bust (Inches)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.underBust}
                    onChange={e => setMeasurements({ ...measurements, underBust: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>4. Waist / Bottom Fit</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.waist}
                    onChange={e => setMeasurements({ ...measurements, waist: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>5. {garmentName.includes('Frock') || garmentName.includes('Lehenga') ? 'Dress / Skirt Length' : 'Blouse / Top Length'}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.blouseLength}
                    onChange={e => setMeasurements({ ...measurements, blouseLength: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>6. Shoulder Width</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.shoulder}
                    onChange={e => setMeasurements({ ...measurements, shoulder: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>7. Front Neck Depth</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.frontNeckDepth}
                    onChange={e => setMeasurements({ ...measurements, frontNeckDepth: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>8. Back Neck Depth</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.backNeckDepth}
                    onChange={e => setMeasurements({ ...measurements, backNeckDepth: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>9. Sleeve Length</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.sleeveLength}
                    onChange={e => setMeasurements({ ...measurements, sleeveLength: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>10. Sleeve Round / Bicep</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.sleeveRound}
                    onChange={e => setMeasurements({ ...measurements, sleeveRound: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>

              </div>
            </div>
          ) : (
            <div style={{ background: '#fffdf5', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border-gold)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-emerald)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={18} color="var(--accent-gold)" /> Doorstep Sample Pickup Request
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                Our Nakshatra team member will contact you on WhatsApp (+91 {customer.phone || '9123500065'}) to collect your reference dress and fabric.
              </p>
              <textarea
                rows={2}
                placeholder="Pickup Instructions for Delivery Agent"
                value={pickupNotes}
                onChange={e => setPickupNotes(e.target.value)}
                style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>
          )}

          {/* Price & Submit Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Order Amount</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <button
                  type="button"
                  className="btn-outline"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => onOpenEnquiry && onOpenEnquiry(`${garmentName} Order Estimate`)}
                >
                  <EnquiryIcon size={16} /> Enquire
                </button>
              </div>
            </div>

            <button type="submit" className="btn-gold" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }} disabled={isSubmitting}>
              {isSubmitting ? 'Confirming Order...' : `Confirm ${garmentName} Order →`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}


