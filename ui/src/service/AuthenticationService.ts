import Keycloak from "keycloak-js";

export class AuthenticationService {
  keycloak: Keycloak;

  constructor() {
    const keycloakOptions = {
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "",
      realm: import.meta.env.VITE_KEYCLOAK_REALM || "",
      url: import.meta.env.VITE_KEYCLOAK_URL || "",
    };

    this.keycloak = new Keycloak(keycloakOptions);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  async initKeycloak(onAuthenticatedCallback: Function) {
    try {
      const authenticated = await this.keycloak.init({ onLoad: "check-sso" });

      if (authenticated) {
        await this.keycloak.loadUserProfile();
        onAuthenticatedCallback();
      } else {
        this.login();
      }
    } catch (err) {
      console.error("DEBUG: error initializing keycloak", err);
    }
  }

  async login() {
    try {
      await this.keycloak.login();
    } catch (err) {
      console.error("DEBUG: error logging in", err);
    }
  }

  async logout() {
    try {
      if (!this.keycloak.authenticated) return;
      console.log("DEBUG: logging out");
      await this.keycloak.logout();
    } catch (err) {
      console.error("DEBUG: error logging out", err);
    }
  }

  getToken(): string {
    return this.keycloak.authenticated ? this.keycloak.token || "" : "";
  }

  getUserInfo() {
    return this.keycloak.authenticated ? this.keycloak.profile : {};
  }

  isAuthenticated() {
    return this.keycloak.authenticated;
  }

  getExpiresAt() {
    return this.keycloak.authenticated ? this.keycloak.tokenParsed?.exp : -1;
  }

  async refreshToken() {
    try {
      const refreshed = await this.keycloak.updateToken(20 * 60 * 1000);
      if (refreshed) {
        console.log("DEBUG: token refreshed");
      }
    } catch (err) {
      console.warn("Failed to refresh token", err);
      this.logout();
    }
  }
}

export default new AuthenticationService();
