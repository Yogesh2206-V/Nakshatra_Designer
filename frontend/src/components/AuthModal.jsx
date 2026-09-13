import React, { useState } from 'react';
import { User, Lock, Phone, Mail, X, CheckCircle2, AlertCircle, Sparkles, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { retrieveUserAvatar, persistUserAvatar } from '../utils/avatarStorage';

export default function AuthModal({ onClose, onLoginSuccess, message = '' }) {
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [formData, setFormData] = useState({
    name: '',
    phoneOrEmail: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current input matches the designated Nakshatra Admin
  const cleanPhone = (formData.phoneOrEmail || '').replace(/[\s+-]/g, '');
  const isAdminInput = cleanPhone.endsWith('9123500065') || cleanPhone === '9123500065';

  const validate = () => {
    const errs = {};
    setServerError('');
    setServerSuccess('');

    if (mode === 'signup' && !formData.name.trim()) {
      errs.name = 'Full Name is required';
    }

    if (!formData.phoneOrEmail.trim()) {
      errs.phoneOrEmail = 'Mobile number or Email is required';
    } else if (
      !/^\d{10}$/.test(cleanPhone) &&
      !cleanPhone.endsWith('9123500065') &&
      !/\S+@\S+\.\S+/.test(formData.phoneOrEmail)
    ) {
      errs.phoneOrEmail = 'Please enter a valid 10-digit mobile number or email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');
    setServerSuccess('');

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phoneOrEmail: formData.phoneOrEmail,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerError(data.message || 'Authentication failed. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      setServerSuccess(data.message || 'Authentication successful!');
      if (data.user) {
        const savedAvatar = retrieveUserAvatar(data.user);
        if (!data.user.avatar && savedAvatar) {
          data.user.avatar = savedAvatar;
          persistUserAvatar(data.user, savedAvatar);
        } else if (data.user.avatar) {
          persistUserAvatar(data.user, data.user.avatar);
        }
        localStorage.setItem('nakshatra_user', JSON.stringify(data.user));
      }

      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess(data.user);
      }, 500);

    } catch (err) {
      console.error('Auth request error:', err);
      setServerError('Unable to connect to authentication server. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(6px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      {/* Centered Modal Card */}
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        background: '#ffffff',
        padding: '2.2rem',
        borderRadius: 'var(--radius-md)',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        border: '2px solid var(--accent-gold)'
      }}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span className="gold-badge" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Nakshatra Designer's Member Access
          </span>

          <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)', marginTop: '0.3rem' }}>
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h3>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            {message || (mode === 'signup' ? 'Sign up to customize designs & enter body specs.' : 'Log in to manage your tailoring orders.')}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          <button
            onClick={() => { setMode('signup'); setErrors({}); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              background: mode === 'signup' ? 'var(--primary-emerald)' : 'transparent',
              color: mode === 'signup' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Sign Up
          </button>

          <button
            onClick={() => { setMode('login'); setErrors({}); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              background: mode === 'login' ? 'var(--primary-emerald)' : 'transparent',
              color: mode === 'login' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Log In
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #f87171',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 0.9rem',
            color: '#b91c1c',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            lineHeight: 1.4
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, color: '#dc2626' }} />
            <div>
              <strong>Authentication Error: </strong>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        {/* Server Success Alert */}
        {serverSuccess && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #4ade80',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 0.9rem',
            color: '#15803d',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            lineHeight: 1.4
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0, color: '#16a34a' }} />
            <div>
              <strong>Success: </strong>
              <span>{serverSuccess}</span>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {/* Full Name field (only on Sign Up) */}
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--accent-gold)' }} />
                <input
                  type="text"
                  placeholder="e.g. Meenakshi Sundaram"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.7rem 0.7rem 2.4rem',
                    borderRadius: 'var(--radius-sm)',
                    border: errors.name ? '1px solid #ef4444' : '1px solid var(--border-light)',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              {errors.name && (
                <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={13} /> {errors.name}
                </div>
              )}
            </div>
          )}

          {/* Mobile or Email field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600 }}>
                Mobile Number or Email *
              </label>
              {isAdminInput && (
                <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  👑 Admin Mode
                </span>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: 12, top: 12, color: isAdminInput ? '#d97706' : 'var(--accent-gold)' }} />
              <input
                type="text"
                placeholder="e.g. 9123500065 or client@example.com"
                value={formData.phoneOrEmail}
                onChange={e => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.7rem 0.7rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: errors.phoneOrEmail ? '1.5px solid #ef4444' : isAdminInput ? '1.5px solid #d97706' : '1px solid var(--border-light)',
                  background: isAdminInput ? 'rgba(217, 119, 6, 0.04)' : '#ffffff',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {isAdminInput && (
              <div style={{
                marginTop: '0.4rem',
                background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12) 0%, rgba(180, 83, 9, 0.08) 100%)',
                border: '1px solid #d97706',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.78rem',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 600
              }}>
                <ShieldCheck size={14} color="#d97706" />
                <span>👑 Nakshatra Administrator Account Detected</span>
              </div>
            )}

            {errors.phoneOrEmail && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={13} /> {errors.phoneOrEmail}
              </div>
            )}
          </div>

          {/* Password field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600 }}>
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: showPassword ? 'var(--primary-emerald)' : 'var(--accent-gold)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showPassword ? 'Hide' : 'Show'} Password</span>
              </button>
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: 12, color: isAdminInput ? '#d97706' : 'var(--accent-gold)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isAdminInput ? 'Enter Administrator Password' : 'Minimum 6 characters'}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.8rem 0.75rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: errors.password ? '1.5px solid #ef4444' : isAdminInput ? '1.5px solid #d97706' : '1px solid var(--border-light)',
                  background: isAdminInput ? 'rgba(217, 119, 6, 0.04)' : '#ffffff',
                  outline: 'none',
                  fontSize: '0.92rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: showPassword ? 'var(--primary-emerald)' : '#64748b',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
                title={showPassword ? 'Click to hide password' : 'Click to show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} color="var(--primary-emerald)" /> : <Eye size={18} color="#64748b" />}
              </button>
            </div>
            {errors.password && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={13} /> {errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-gold"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Processing...'
              : mode === 'signup'
              ? 'Sign Up & Continue →'
              : 'Log In & Continue →'}
          </button>

        </form>
      </div>
    </div>
  );
}
