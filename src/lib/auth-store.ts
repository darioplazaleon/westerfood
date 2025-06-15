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
          console.log('🔄 Syncing tokens with server:', { 
            hasToken: !!token, 
            hasRefreshToken: !!refreshToken 
          })
          await setServerToken(token, refreshToken)
        },

        // Initialize Keycloak
        initialize: async () => {
          try {
            set({ isLoading: true })
            console.log('🚀 Initializing Keycloak...')

            const authenticated = await keycloak.init({
              onLoad: 'check-sso',
              silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
              checkLoginIframe: false,
              silentCheckSsoFallback: false,
              enableLogging: true, // Enable logging to see what's happening
              pkceMethod: 'S256',
              messageReceiveTimeout: 10000, // Increase timeout
              flow: 'standard',
            })

            console.log('🔐 Keycloak authenticated:', authenticated)

            if (authenticated) {
              await get().getUserInfo()

              // Set initial tokens
              const initialToken = keycloak.token || null
              const initialRefreshToken = keycloak.refreshToken || null

              console.log('📝 Setting initial tokens:', { 
                hasToken: !!initialToken, 
                hasRefreshToken: !!initialRefreshToken 
              })

              set({
                isAuthenticated: true,
                token: initialToken,
                refreshToken: initialRefreshToken,
              })

              // Send session data to the server
              const { user } = get()
              await setServerSession(user, true)

              // Send token data to the server
              await setServerToken(initialToken, initialRefreshToken)

              // Set up token refresh callbacks - CRITICAL PART
              console.log('⚙️ Setting up Keycloak callbacks...')

              // This fires when token is about to expire (before it expires)
              keycloak.onTokenExpired = async () => {
                console.log('⏰ Token expired callback triggered')
                try {
                  const refreshed = await get().refreshTokens()
                  if (refreshed) {
                    console.log('✅ Token refreshed successfully in callback')
                  } else {
                    console.error('❌ Failed to refresh token in callback')
                    get().clearAuth()
                  }
                } catch (error) {
                  console.error('💥 Error in token expired callback:', error)
                  get().clearAuth()
                }
              }

              // This fires after successful token refresh
              keycloak.onAuthRefreshSuccess = async () => {
                console.log('🎉 Auth refresh success callback triggered')
                const newToken = keycloak.token || null
                const newRefreshToken = keycloak.refreshToken || null
                
                console.log('📝 Updating tokens from success callback:', { 
                  hasToken: !!newToken, 
                  hasRefreshToken: !!newRefreshToken 
                })

                set({
                  token: newToken,
                  refreshToken: newRefreshToken,
                })

                // Sync with server
                await setServerToken(newToken, newRefreshToken)
              }

              // This fires when token refresh fails
              keycloak.onAuthRefreshError = () => {
                console.error('💥 Auth refresh error callback triggered')
                get().clearAuth()
              }

              // Set up automatic token refresh check
              console.log('⏲️ Setting up automatic token refresh...')
              const tokenRefreshInterval = setInterval(async () => {
                try {
                  // Check if token needs refresh (refresh if expires in next 30 seconds)
                  const refreshed = await keycloak.updateToken(30)
                  if (refreshed) {
                    console.log('🔄 Token auto-refreshed via interval')
                    const newToken = keycloak.token || null
                    const newRefreshToken = keycloak.refreshToken || null
                    
                    set({
                      token: newToken,
                      refreshToken: newRefreshToken,
                    })

                    await setServerToken(newToken, newRefreshToken)
                  }
                } catch (error) {
                  console.error('💥 Error in token refresh interval:', error)
                  clearInterval(tokenRefreshInterval)
                  get().clearAuth()
                }
              }, 60000) // Check every minute

              // Clean up interval on logout
              const originalClearAuth = get().clearAuth
              set({
                clearAuth: () => {
                  clearInterval(tokenRefreshInterval)
                  originalClearAuth()
                }
              })
            }

            set({
              isInitialized: true,
              isLoading: false,
            })

          } catch (error) {
            console.error('💥 Keycloak initialization failed:', error)
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
            console.log('🔑 Starting login...')
            await keycloak.login({
              redirectUri: window.location.origin + '/dashboard',
            })
          } catch (error) {
            console.error('💥 Login failed:', error)
            set({ isLoading: false })
          }
        },

        // Logout
        logout: async () => {
          try {
            console.log('👋 Starting logout...')
            await keycloak.logout({
              redirectUri: window.location.origin,
            })
            get().clearAuth()
          } catch (error) {
            console.error('💥 Logout failed:', error)
            get().clearAuth()
          }
        },

        // Refresh tokens
        refreshTokens: async () => {
          try {
            console.log('🔄 Manually refreshing tokens...')
            const refreshed = await keycloak.updateToken(30)
            if (refreshed) {
              const newToken = keycloak.token || null
              const newRefreshToken = keycloak.refreshToken || null

              console.log('✅ Manual token refresh successful:', { 
                hasToken: !!newToken, 
                hasRefreshToken: !!newRefreshToken 
              })

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
            console.log('ℹ️ Token refresh not needed')
            return false
          } catch (error) {
            console.error('💥 Token refresh failed:', error)
            get().clearAuth()
            return false
          }
        },

        // Get user info
        getUserInfo: async () => {
          try {
            console.log('👤 Loading user info...')
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

            console.log('✅ User info loaded:', { 
              username: updatedUser.preferred_username, 
              roles: allRoles 
            })

            set({
              user: updatedUser,
              roles: allRoles,
            })

            // Send updated user info to the server
            await setServerSession(updatedUser, true)
          } catch (error) {
            console.error('💥 Failed to load user info:', error)
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
          console.log('🧹 Clearing auth state...')
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
    console.log('📤 Sending session to server:', { 
      hasUser: !!user, 
      isAuthenticated 
    })

    const response = await fetch('/api/user/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        user,
        isAuthenticated,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to set server session: ${response.status}`)
    }

    console.log('✅ Server session updated successfully')
    return true
  } catch (error) {
    console.error('💥 Failed to set server session:', error)
    return false
  }
}

/**
 * Sends token data to the server to be stored in cookies
 * This allows server components to access the authentication tokens
 */
const setServerToken = async (token: string | null, refreshToken: string | null) => {
  try {
    console.log('📤 Sending tokens to server:', { 
      hasToken: !!token, 
      hasRefreshToken: !!refreshToken,
      tokenLength: token?.length || 0
    })

    const response = await fetch('/api/user/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        token,
        refreshToken,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to set server token: ${response.status} - ${errorText}`)
    }

    console.log('✅ Server tokens updated successfully')
    return true
  } catch (error) {
    console.error('💥 Failed to set server token:', error)
    return false
  }
}