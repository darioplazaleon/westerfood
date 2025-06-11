import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8091/',
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'myrealm',
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'myclient',
}

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

export const keycloakInitOptions = {
    onLoad: 'check-sso' as const,
    silentCheckSsoRedirectUri: typeof window !== 'undefined' ? `${window.location.origin}/silent-check-sso.html` : undefined,
    checkLoginIframe: false,
    pkceMethod: 'S256' as const,
}