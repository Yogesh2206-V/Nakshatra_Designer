/**
 * Utilities for permanent profile avatar persistence, compression, and server synchronization
 */

// Compresses and resizes any uploaded image file to a lightweight, crystal-clear base64 JPEG
export const compressAvatarImage = (file, maxDimension = 400, quality = 0.88) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scale
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const compressImage = compressAvatarImage;

// Generates persistent key based on phone, email, or user ID
export const getAvatarStorageKey = (user) => {
  if (!user) return 'nakshatra_avatar_default';
  const identifier = (user.phone || user.phoneOrEmail || user.email || user.id || 'client')
    .toString()
    .replace(/[\s+-]/g, '')
    .toLowerCase();
  return `nakshatra_avatar_${identifier}`;
};

// Permanently saves avatar in local device storage and syncs to backend API
export const persistUserAvatar = async (user, base64Image) => {
  if (!user) return;

  const storageKey = getAvatarStorageKey(user);
  
  // 1. Permanent standalone storage key that persists indefinitely
  try {
    localStorage.setItem(storageKey, base64Image);
  } catch (e) {
    console.warn('LocalStorage avatar quota warning:', e);
  }

  // 2. Update user object in localStorage
  try {
    const currentUserRaw = localStorage.getItem('nakshatra_user');
    const parsed = currentUserRaw ? JSON.parse(currentUserRaw) : { ...user };
    parsed.avatar = base64Image;
    localStorage.setItem('nakshatra_user', JSON.stringify(parsed));
  } catch (e) {}

  // 3. Sync with Backend
  try {
    await fetch('/api/auth/avatar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id || user._id,
        phone: user.phone || user.phoneOrEmail,
        email: user.email,
        avatar: base64Image
      })
    });
  } catch (err) {
    console.warn('Backend avatar sync warning:', err);
  }
};

// Permanently removes avatar ONLY when user explicitly clicks "Remove Photo"
export const removeUserAvatar = async (user) => {
  if (!user) return;

  const storageKey = getAvatarStorageKey(user);

  try {
    localStorage.removeItem(storageKey);
  } catch (e) {}

  try {
    const currentUserRaw = localStorage.getItem('nakshatra_user');
    if (currentUserRaw) {
      const parsed = JSON.parse(currentUserRaw);
      parsed.avatar = '';
      localStorage.setItem('nakshatra_user', JSON.stringify(parsed));
    }
  } catch (e) {}

  try {
    await fetch('/api/auth/avatar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id || user._id,
        phone: user.phone || user.phoneOrEmail,
        email: user.email,
        avatar: ''
      })
    });
  } catch (err) {}
};

// Restores user's persistent avatar if present
export const retrieveUserAvatar = (user) => {
  if (!user) return '';
  if (user.avatar && user.avatar.trim() !== '') return user.avatar;
  
  const storageKey = getAvatarStorageKey(user);
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) return cached;
  } catch (e) {}

  return '';
};
