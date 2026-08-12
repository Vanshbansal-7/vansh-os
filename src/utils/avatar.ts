export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return 'V';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'V';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function resolveAvatarUrl(avatarPath?: string | null): string | null {
  if (!avatarPath) return null;
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://') || avatarPath.startsWith('/')) {
    return avatarPath;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otjslotfiiubgehiucmn.supabase.co';
  const cleanPath = avatarPath.startsWith('avatars/') ? avatarPath.replace(/^avatars\//, '') : avatarPath;
  return `${supabaseUrl}/storage/v1/object/public/avatars/${cleanPath}`;
}
