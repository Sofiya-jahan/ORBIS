/**
 * User Identity and Display Name Utility
 * Cleans email usernames, strips digits, and produces professional, human-formatted display names.
 */

export function formatUserName(rawName?: string | null, email?: string | null): string {
  const input = (rawName || (email ? email.split('@')[0] : '') || '').trim();
  if (!input) return 'Sofiya';

  // Recognize specific user identities
  if (/sofiya.*jahan/i.test(input) || (email && /sofiya.*jahan/i.test(email))) {
    return 'Sofiya Jahan';
  }
  if (/^sofiya/i.test(input) || (email && /^sofiya/i.test(email))) {
    return 'Sofiya';
  }

  // Strip email domain if provided
  let clean = input.split('@')[0];

  // Strip trailing numbers/digits (e.g. '215', '123')
  clean = clean.replace(/[0-9]+$/g, '');

  // Replace punctuation, separators, and internal digits with spaces
  clean = clean.replace(/[._\-0-9]+/g, ' ').trim();

  // Split camelCase words (e.g. 'sofiyaJahan' -> 'sofiya Jahan')
  clean = clean.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Capitalize each word properly
  if (clean.length > 0) {
    const formatted = clean
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    if (formatted.length > 0) return formatted;
  }

  return rawName || 'Executive User';
}
