export const environment = {
    production: true,
    oauth: {
        authorizationUrl: 'https://cas.inria.fr/cas/oauth2.0/authorize',
        accessTokenEndpoint: 'https://cas.inria.fr/cas/oauth2.0/accessToken',
        resourceUrl: 'https://cas.inria.fr/cas/oauth2.0/profile',
        clientId: 'inria-learningLab',
        clientSecret: 'T#P+yTJ+3#z8&i',
        responseType: 'token',
        redirectUri: 'http://localhost/callback',
        scope: ''
    }
};
