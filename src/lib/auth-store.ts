import {create} from 'zustand';
import {devtools ,persist} from 'zustand/middleware';
import keycloak from "@/lib/keycloak";

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

                // Initialize Keycloak
                initialize: async () => {
                    try {
                        set({ isLoading: true });

                        const authenticated = await keycloak.init({
                            onLoad: 'check-sso',
                            silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
                            checkLoginIframe: false, // Disable iframe check to prevent timeout
                            silentCheckSsoFallback: false, // Disable fallback that can cause issues
                            enableLogging: false, // Disable logging to reduce noise
                            pkceMethod: 'S256',
                            // Add timeout configuration
                            messageReceiveTimeout: 5000, // 5 second timeout
                            // Force a fresh check instead of relying on iframe
                            flow: 'standard'
                        });

                        if (authenticated) {
                            await get().getUserInfo();

                            // Set up token refresh
                            keycloak.onTokenExpired = () => {
                                get().refreshTokens();
                            };

                            set({
                                isAuthenticated: true,
                                token: keycloak.token || null,
                                refreshToken: keycloak.refreshToken || null,
                            });
                        }

                        set({
                            isInitialized: true,
                            isLoading: false
                        });

                    } catch (error) {
                        console.error('Keycloak initialization failed:', error);
                        // Don't fail completely on initialization error - allow manual login
                        set({
                            isInitialized: true,
                            isLoading: false,
                            isAuthenticated: false
                        });
                    }
                },

                // Login
                login: async () => {
                    try {
                        set({ isLoading: true });
                        await keycloak.login({
                            redirectUri: window.location.origin + '/dashboard',
                        });
                    } catch (error) {
                        console.error('Login failed:', error);
                        set({ isLoading: false });
                    }
                },

                // Logout
                logout: async () => {
                    try {
                        await keycloak.logout({
                            redirectUri: window.location.origin,
                        });
                        get().clearAuth();
                    } catch (error) {
                        console.error('Logout failed:', error);
                        get().clearAuth();
                    }
                },

                // Refresh tokens
                refreshTokens: async () => {
                    try {
                        const refreshed = await keycloak.updateToken(30);
                        if (refreshed) {
                            set({
                                token: keycloak.token || null,
                                refreshToken: keycloak.refreshToken || null,
                            });
                            return true;
                        }
                        return false;
                    } catch (error) {
                        console.error('Token refresh failed:', error);
                        get().clearAuth();
                        return false;
                    }
                },

                // Get user info
                getUserInfo: async () => {
                    try {
                        const userInfo = await keycloak.loadUserInfo();

                        // Extract roles from token
                        const tokenParsed = keycloak.tokenParsed;
                        const realmRoles = tokenParsed?.realm_access?.roles || [];
                        const clientRoles = Object.values(tokenParsed?.resource_access || {})
                            .flatMap((client: any) => client.roles || []);

                        const allRoles = [...realmRoles, ...clientRoles];

                        set({
                            user: {
                                ...userInfo,
                                roles: allRoles,
                            } as UserInfo,
                            roles: allRoles,
                        });
                    } catch (error) {
                        console.error('Failed to load user info:', error);
                    }
                },

                // Role checking utilities
                hasRole: (role: string) => {
                    const { roles } = get();
                    return roles.includes(role);
                },

                hasAnyRole: (roles: string[]) => {
                    const { roles: userRoles } = get();
                    return roles.some(role => userRoles.includes(role));
                },

                // Clear authentication state
                clearAuth: () => {
                    set({
                        isAuthenticated: false,
                        user: null,
                        roles: [],
                        token: null,
                        refreshToken: null,
                    });
                },
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({
                    // Only persist essential data, not sensitive tokens
                    user: state.user,
                    roles: state.roles,
                }),
            }
        )
    )
);