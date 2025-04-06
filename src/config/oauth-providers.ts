/**
 * OAuth Providers Configuration
 *
 * This file contains the configuration for all supported OAuth providers.
 * Add new providers here and use them in the authentication context.
 */

export interface OAuthProvider {
  id: string
  name: string
  icon: string
  authUrl: string
  tokenUrl?: string
  userInfoUrl: string
  clientId: string
  redirectUri: string
  scope: string
  responseType: 'token' | 'code'
  extractToken: (hash: string) => string | null
  processUserInfo: (data: UserInfoData) => {
    id: string
    name: string
    email: string
    picture: string
  } | null
}

// Определяем интерфейс для данных пользователя, возвращаемых API
interface UserInfoData {
  id?: string
  name?: string
  displayName?: string
  email?: string
  mail?: string
  userPrincipalName?: string
  picture?: string
  avatar_url?: string
  login?: string
  [key: string]: unknown
}

// Environment variable helper with fallback
const getEnvVar = (key: string, fallback = ''): string => import.meta.env[key] || fallback

// Base URL for redirects
const BASE_URL = 'https://tokenswallet.ru'

/**
 * Google OAuth Provider
 */
export const googleProvider: OAuthProvider = {
  id: 'google',
  name: 'Google',
  icon: 'google',
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  clientId: getEnvVar('VITE_GOOGLE_CLIENT_ID'),
  redirectUri: `${BASE_URL}/callback`,
  scope: 'email profile',
  responseType: 'token',
  extractToken: (hash: string): string | null => {
    const params = new URLSearchParams(hash)
    return params.get('access_token')
  },
  processUserInfo: (data: UserInfoData) => {
    if (!data) {
      return null
    }

    return {
      id: data.id || '',
      name: data.name || '',
      email: data.email || '',
      picture: data.picture || '',
    }
  },
}

/**
 * GitHub OAuth Provider
 *
 * Note: GitHub OAuth requires a server for token exchange
 * This is a placeholder until a backend service is implemented
 */
export const githubProvider: OAuthProvider = {
  id: 'github',
  name: 'GitHub',
  icon: 'github',
  authUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  userInfoUrl: 'https://api.github.com/user',
  clientId: getEnvVar('VITE_GITHUB_CLIENT_ID'),
  redirectUri: `${BASE_URL}/callback`,
  scope: 'user:email',
  responseType: 'code',
  extractToken: (hash: string): string | null => {
    const params = new URLSearchParams(hash)
    return params.get('code')
  },
  processUserInfo: (data: UserInfoData) => {
    if (!data) {
      return null
    }

    return {
      id: data.id ? data.id.toString() : '',
      name: data.name || data.login || '',
      email: data.email || '', // May require additional API call for private emails
      picture: data.avatar_url || '',
    }
  },
}

/**
 * Microsoft OAuth Provider
 *
 * Note: Microsoft OAuth setup is more complex and requires tenant configuration
 * This is a placeholder until proper implementation
 */
export const microsoftProvider: OAuthProvider = {
  id: 'microsoft',
  name: 'Microsoft',
  icon: 'microsoft',
  authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
  clientId: getEnvVar('VITE_MICROSOFT_CLIENT_ID'),
  redirectUri: `${BASE_URL}/callback`,
  scope: 'user.read',
  responseType: 'code',
  extractToken: (hash: string): string | null => {
    const params = new URLSearchParams(hash)
    return params.get('code')
  },
  processUserInfo: (data: UserInfoData) => {
    if (!data) {
      return null
    }

    return {
      id: data.id || '',
      name: data.displayName || '',
      email: data.mail || data.userPrincipalName || '',
      picture: '', // Microsoft Graph API requires separate photo request
    }
  },
}

// Export all providers in a map for easy access
export const oauthProviders: Record<string, OAuthProvider> = {
  google: googleProvider,
  github: githubProvider,
  microsoft: microsoftProvider,
}

// Export the list of available providers
export const availableProviders: OAuthProvider[] = [
  googleProvider,
  // Uncomment when ready to implement
  // githubProvider,
  // microsoftProvider,
]
