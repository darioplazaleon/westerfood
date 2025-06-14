import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import keycloak from '@/lib/keycloak'

export interface UserInfo {
  sub: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: boolean;
  roles?: string[];
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

interface AuthState {
  // Authentication state
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;

  // User data
  user: UserInfo | null;
  roles: string[];

  // Tokens
  token: string | null;
  refreshToken: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  getUserInfo: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  clearAuth: () => void;
  syncServerTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        isInitialized: false,
        isLoading: true,
        user: null,
        roles: [],
        token: null,
        refreshToken: null,

        // Sync tokens with server cookies
        syncServerTokens: async () => {
          const { token, refreshToken } = get()
          await setServerToken(token, refreshToken)
        },

        // Initialize Keycloak
        initialize: async () => {
          try {
            set({ isLoading: true })

            const authenticated = await keycloak.init({
              onLoad: 'check-sso',
              silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
              checkLoginIframe: false,
              silentCheckSsoFallback: false,
              enableLogging: false,
              pkceMethod: 'S256',
              messageReceiveTimeout: 5000,
              flow: 'standard',
            })

            if (authenticated) {
              await get().getUserInfo()

              // Set up automatic token refresh with server sync
              keycloak.onTokenExpired = async () => {
                console.log('Token expired, refreshing...')
                const refreshed = await get().refreshTokens()
                if (refreshed) {
                  console.log('Token refreshed successfully')
                  // Sync the new tokens with server cookies
                  await get().syncServerTokens()
                } else {
                  console.error('Failed to refresh token, logging out')
                  get().clearAuth()
                }
              }

              // Also set up the refresh callback for manual refreshes
              keycloak.onAuthRefreshSuccess = async () => {
                console.log('Auth refresh success, syncing server tokens')
                set({
                  token: keycloak.token || null,
                  refreshToken: keycloak.refreshToken || null,
                })
                await get().syncServerTokens()
              }

              keycloak.onAuthRefreshError = () => {
                console.error('Auth refresh error, clearing auth')
                get().clearAuth()
              }

              set({
                isAuthenticated: true,
                token: keycloak.token || null,
                refreshToken: keycloak.refreshToken || null,
              })

              // Send session data to the server
              const { user } = get()
              await setServerSession(user, true)

              // Send token data to the server
              await setServerToken(keycloak.token || null, keycloak.refreshToken || null)
            }

            set({
              isInitialized: true,
              isLoading: false,
            })

          } catch (error) {
            console.error('Keycloak initialization failed:', error)
            set({
              isInitialized: true,
              isLoading: false,
              isAuthenticated: false,
            })
          }
        },

        // Login
        login: async () => {
          try {
            set({ isLoading: true })
            await keycloak.login({
              redirectUri: window.location.origin + '/dashboard',
            })
          } catch (error) {
            console.error('Login failed:', error)
            set({ isLoading: false })
          }
        },

        // Logout
        logout: async () => {
          try {
            await keycloak.logout({
              redirectUri: window.location.origin,
            })
            get().clearAuth()
          } catch (error) {
            console.error('Logout failed:', error)
            get().clearAuth()
          }
        },

        // Refresh tokens
        refreshTokens: async () => {
          try {
            const refreshed = await keycloak.updateToken(30)
            if (refreshed) {
              const newToken = keycloak.token || null
              const newRefreshToken = keycloak.refreshToken || null

              set({
                token: newToken,
                refreshToken: newRefreshToken,
              })

              // Send session data to the server
              const { user } = get()
              await setServerSession(user, true)

              // Send updated token data to the server
              await setServerToken(newToken, newRefreshToken)

              return true
            }
            return false
          } catch (error) {
            console.error('Token refresh failed:', error)
            get().clearAuth()
            return false
          }
        },

        // Get user info
        getUserInfo: async () => {
          try {
            const userInfo = await keycloak.loadUserInfo()

            // Extract roles from token
            const tokenParsed = keycloak.tokenParsed
            const realmRoles = tokenParsed?.realm_access?.roles || []
            const clientRoles = Object.values(tokenParsed?.resource_access || {})
              .flatMap((client: any) => client.roles || [])

            const allRoles = [...realmRoles, ...clientRoles]

            const updatedUser = {
              ...userInfo,
              roles: allRoles,
            } as UserInfo

            set({
              user: updatedUser,
              roles: allRoles,
            })

            // Send updated user info to the server
            await setServerSession(updatedUser, true)
          } catch (error) {
            console.error('Failed to load user info:', error)
          }
        },

        // Role checking utilities
        hasRole: (role: string) => {
          const { roles } = get()
          return roles.includes(role)
        },

        hasAnyRole: (roles: string[]) => {
          const { roles: userRoles } = get()
          return roles.some(role => userRoles.includes(role))
        },

        // Clear authentication state
        clearAuth: () => {
          set({
            isAuthenticated: false,
            user: null,
            roles: [],
            token: null,
            refreshToken: null,
          })

          // Clear server session
          setServerSession(null, false)

          // Clear server token
          setServerToken(null, null)
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          // Only persist essential data, not sensitive tokens
          user: state.user,
          roles: state.roles,
        }),
      },
    ),
  ),
)

/**
 * Sends user session data to the server to be stored in a cookie
 * This allows server components to access the user's authentication state
 */
const setServerSession = async (user: UserInfo | null, isAuthenticated: boolean) => {
  try {
    const response = await fetch('/api/user/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user,
        isAuthenticated,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to set server session: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Failed to set server session:', error)
    return false
  }
}

/**
 * Sends token data to the server to be stored in cookies
 * This allows server components to access the authentication tokens
 */
const setServerToken = async (token: string | null, refreshToken: string | null) => {
  try {
    const response = await fetch('/api/user/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to set server token: ${response.status}`)
    }

    console.log('Server tokens updated successfully')
    return true
  } catch (error) {
    console.error('Failed to set server token:', error)
    return false
  }
}