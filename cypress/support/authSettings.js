export const authSettings = {
    authority: `https://login.microsoftonline.com/${Cypress.env("TENANT_ID")}`,
    clientId: Cypress.env("CLIENT_ID"),
    clientSecret: Cypress.env("CLIENT_SECRET"),
    apiScopes: ["openid", "profile", "offline_access", "email", Cypress.env("API_SCOPE")],
    username: Cypress.env("USERNAME"),
    password: Cypress.env("PASSWORD")
}