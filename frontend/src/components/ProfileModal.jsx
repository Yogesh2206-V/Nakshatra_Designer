import React, { useRef, useState } from 'react';
import { User, Camera, Upload, Trash2, X, Settings, LogOut, Sparkles, ShieldCheck } from 'lucide-react';
import { compressAvatarImage, persistUserAvatar, removeUserAvatar } from '../utils/avatarStorage';

export default function ProfileModal({ isOpen, onClose, currentUser, onUpdateUser, onLogout, onNavigateSettings }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const base64Image = await compressAvatarImage(file, 400, 0.88);

      const updatedUser = {
        ...currentUser,
        avatar: base64Image
      };

      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }

      // Persist permanently in local storage backup and sync to server
      await persistUserAvatar(currentUser, base64Image);
    } catch (err) {
      console.error('Error processing profile image:', err);
      alert('Could not process image. Please choose another photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = async () => {
    const updatedUser = {
      ...currentUser,
      avatar: ''
    };
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    await removeUserAvatar(currentUser);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      {/* Hidden local device file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div 
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '430px',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.2rem 2rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          border: '2px solid var(--accent-gold)',
          position: 'relative',
          textAlign: 'center'
        }}
      >
        {/* Close Button */}
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
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Member Badge */}
        <div style={{ marginBottom: '1.2rem' }}>
          <span className="gold-badge" style={{ fontSize: '0.8rem', padding: '0.25rem 0.8rem' }}>
            <Sparkles size={13} /> Nakshatra Client Profile
          </span>
        </div>

        {/* Avatar Photo Frame */}
        <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 1.2rem auto' }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #0b2b26 0%, #164e43 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--accent-gold)',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 8px 20px rgba(212,175,55,0.3)',
              transition: 'transform 0.2s ease'
            }}
            title="Click to select image from your device"
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: '#ffffff', fontSize: '2.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User size={40} />}
              </span>
            )}

            {/* Dark Camera Bar at bottom of circle */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(11, 43, 38, 0.75)',
              padding: '3px 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Camera size={14} color="#ffffff" />
            </div>
          </div>

          {/* Quick Floating Camera Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'var(--accent-gold)',
              color: '#0b2b26',
              border: '2px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
            title="Upload photo from device"
          >
            <Camera size={14} />
          </button>
        </div>

        {/* Client Name & Phone */}
        <h3 style={{ fontSize: '1.45rem', color: 'var(--primary-emerald)', fontFamily: 'var(--font-serif)', marginBottom: '0.2rem' }}>
          {currentUser.name}
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.4rem' }}>
          {currentUser.phone || currentUser.email || 'Verified Client Profile'}
        </p>

        {/* Upload Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-gold"
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            disabled={isUploading}
          >
            <Upload size={17} /> {isUploading ? 'Uploading...' : currentUser.avatar ? 'Change Photo from Device' : 'Add Photo from Device'}
          </button>

          {currentUser.avatar && (
            <button
              onClick={removeAvatar}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                padding: '0.2rem'
              }}
            >
              <Trash2 size={13} /> Remove Photo
            </button>
          )}
        </div>

        <hr style={{ borderColor: 'var(--border-light)', margin: '1rem 0' }} />

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => {
              if (onNavigateSettings) onNavigateSettings();
              onClose();
            }}
            className="btn-outline"
            style={{ flex: 1, padding: '0.65rem', fontSize: '0.86rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            <Settings size={15} /> Settings
          </button>

          <button
            onClick={() => {
              if (onLogout) onLogout();
              onClose();
            }}
            style={{
              flex: 1,
              padding: '0.65rem',
              fontSize: '0.86rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid #ef4444',
              background: 'transparent',
              color: '#ef4444',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <LogOut size={15} /> Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
