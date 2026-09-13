/**
 * Centralized Strict Admin Verification Utility
 * Ensures ONLY the specific Admin (Nakshatradesign / 9123500065) has access to Admin Studio & Design Upload.
 */

export const ADMIN_PHONE = '9123500065';
export const ADMIN_NAME = 'Nakshatradesign';
export const ADMIN_ID = 'admin_nakshatra_01';

export const isExactAdmin = (user) => {
  if (!user) return false;

  // Extract cleaned phone number
  const rawPhone = (user.phone || user.phoneOrEmail || '').toString().replace(/[\s+-]/g, '');
  const cleanPhone = rawPhone.startsWith('91') && rawPhone.length === 12 ? rawPhone.substring(2) : rawPhone;

  const isPhoneMatch = cleanPhone === ADMIN_PHONE;
  const isIdMatch = user.id === ADMIN_ID;
  const isAdminFlag = user.isAdmin === true || user.role === 'admin';

  // Strictly verify: must have admin role/flag AND match the specific admin phone or ID
  return isAdminFlag && (isPhoneMatch || isIdMatch);
};
