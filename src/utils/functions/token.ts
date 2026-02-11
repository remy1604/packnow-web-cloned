export const collectUserInfo = () => {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'server',
      cookieEnabled: false,
      localStorage: false,
      sessionStorage: false,
      screenResolution: 'unknown',
      timezone: 'unknown',
      language: 'unknown',
    };
  }
  return {
    userAgent: navigator.userAgent,
    cookieEnabled: navigator.cookieEnabled,
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };
};

export const getTokenExpiryInfo = (
  session: { expires_at?: number } | null,
  accessTokenTTL = 3600,
) => {
  if (!session?.expires_at) {
    return { hasAccessToken: false, expiresAt: null, isExpired: true };
  }
  const issuedAt = session.expires_at - accessTokenTTL;
  const now = Math.floor(Date.now() / 1000);
  return {
    hasAccessToken: true,
    expiresAt: new Date(issuedAt * 1000).toISOString(),
    isExpired: now > issuedAt,
    secondsLeft: issuedAt - now,
  };
};

export const getRefreshTokenExpiryInfo = (
  session: { refresh_token?: string; expires_at?: number } | null,
  refreshTokenTTLSeconds = 604800,
  accessTokenTTL = 3600,
) => {
  if (!session?.refresh_token || !session?.expires_at) {
    return { hasRefreshToken: false, expiresAt: null, isExpired: true };
  }
  const issuedAt = session.expires_at - accessTokenTTL;
  const refreshExpiresAt = issuedAt + refreshTokenTTLSeconds;
  const now = Math.floor(Date.now() / 1000);
  return {
    hasRefreshToken: true,
    expiresAt: new Date(refreshExpiresAt * 1000).toISOString(),
    isExpired: now > refreshExpiresAt,
    secondsLeft: refreshExpiresAt - now,
  };
};

/** 登录/会话失败时上报（当前为控制台输出，可接入 Supabase user_report 等） */
export const reportLoginFailure = async (_error: Error, context: Record<string, unknown>) => {
  console.warn('[Auth] 登录/会话失败', _error.message, context);
};
