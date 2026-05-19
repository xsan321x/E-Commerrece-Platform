/**
 * Utility to handle authentication errors
 * Only logs out user if it's a genuine token expiration/invalid token
 */
export const handleAuthError = (error: any): boolean => {
  if (error?.response?.status !== 401) {
    return false;
  }

  const errorMessage = error.response?.data?.message?.toLowerCase() || '';
  
  console.log('[AuthUtils] 401 Error received:', {
    message: errorMessage,
    url: error.config?.url,
    fullError: error.response?.data
  });
  
  // List of messages that indicate token issues (should logout)
  // Updated to match actual backend error messages
  const tokenIssues = [
    'token expired',
    'invalid token',
    'jwt expired',
    'jwt malformed',
    'no token provided',
    'authentication failed',
    'please authenticate',
    'not authorized, token failed', // Backend message
    'not authorized, no token provided', // Backend message
    'user not found', // Backend message when user is deleted
    'token failed', // Partial match
  ];

  // Check if error message contains any token-related issues
  const isTokenIssue = tokenIssues.some(issue => errorMessage.includes(issue));

  if (isTokenIssue) {
    console.log('[AuthUtils] Token issue detected, logging out:', errorMessage);
    
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('cart-storage');
    
    // Redirect to login if not already there
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login?session=expired';
    }
    
    return true;
  }

  // It's an authorization error (permission denied), not authentication
  console.log('[AuthUtils] Authorization error (not token issue), NOT logging out:', errorMessage);
  return false;
};

/**
 * Check if user's token is still valid
 */
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    // Decode JWT token (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    
    // Check if token is expired
    return Date.now() < exp;
  } catch (error) {
    return false;
  }
};
