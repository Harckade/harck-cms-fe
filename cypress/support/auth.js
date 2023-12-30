/// <reference types="cypress" />
//Thanks to Joonas Westlin -> https://www.youtube.com/watch?v=OZh5RmCztrU

import { authSettings } from "./authSettings";
import { decode } from "jsonwebtoken";

const environment = "login.windows.net";
const { clientId, clientSecret, apiScopes, authority, password, username } = authSettings;

const buildAccountEntity = (homeAccountId, realm, localAccountId, username, name, idTokenClaims) => {
    return {
        authorityType: "MSSTS",
        clientInfo: "",
        homeAccountId,
        environment,
        realm,
        localAccountId,
        username,
        name,
        idTokenClaims
    };
};

const buildIdTokenEntity = (homeAccountId, idToken, realm) => {
    return {
        credentialType: "IdToken",
        homeAccountId,
        environment,
        clientId,
        secret: idToken,
        realm,
    };
};

const buildAccessTokenEntity = (homeAccountId, accessToken, expiresIn, extExpiresIn, realm, scopes) => {
    const now = Math.floor(Date.now() / 1000);
    return {
        homeAccountId,
        credentialType: "AccessToken",
        secret: accessToken,
        cachedAt: now.toString(),
        expiresOn: (now + expiresIn).toString(),
        extendedExpiresOn: (now + extExpiresIn).toString(),
        environment,
        clientId,
        realm,
        target: scopes.map((s) => s.toLowerCase()).join(" "),
        // Scopes _must_ be lowercase or the token won't be found
    };
};

const injectTokens = (tokenResponse) => {
    const idToken = decode(tokenResponse.id_token);
    const localAccountId = idToken.oid || idToken.sid;
    const realm = idToken.tid;
    const homeAccountId = `${localAccountId}.${realm}`;
    const username = idToken.preferred_username;
    const name = idToken.name;
    const roles = idToken.roles;

    const accountKey = `${homeAccountId}-${environment}-${realm}`;
    const accountEntity = buildAccountEntity(
        homeAccountId,
        realm,
        localAccountId,
        username,
        name,
        {roles: roles}
    );

    const idTokenKey = `${homeAccountId}-${environment}-idtoken-${clientId}-${realm}-`;
    const idTokenEntity = buildIdTokenEntity(
        homeAccountId,
        tokenResponse.id_token,
        realm
    );

    const accessTokenKey = `${homeAccountId}-${environment}-accesstoken-${clientId}-${realm}-${apiScopes.join(
        " "
    )}`;
    const accessTokenEntity = buildAccessTokenEntity(
        homeAccountId,
        tokenResponse.access_token,
        tokenResponse.expires_in,
        tokenResponse.ext_expires_in,
        realm,
        apiScopes
    );

    localStorage.setItem(accountKey, JSON.stringify(accountEntity));
    localStorage.setItem(idTokenKey, JSON.stringify(idTokenEntity));
    localStorage.setItem(accessTokenKey, JSON.stringify(accessTokenEntity));
}

export const authenticate = (cachedTokenResponse) => {
    let tokenResponse = null;
    let chainable = cy.visit("/");

    if (!cachedTokenResponse) {
        chainable = chainable.request({
            url: authority + "/oauth2/v2.0/token",
            method: "POST",
            body: {
                grant_type: "password",
                client_id: clientId,
                client_secret: clientSecret,
                scope: apiScopes.join(" "),
                username: username,
                password: password,
            },
            form: true,
        });
    } else {
        chainable = chainable.then(() => {
            return {
                body: cachedTokenResponse,
            };
        });
    }

    chainable
        .then((response) => {
            injectTokens(response.body);
            tokenResponse = response.body;
        })
        .reload()
        .then(() => {
            return tokenResponse;
        });
    return chainable;
}