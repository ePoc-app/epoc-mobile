export const secrets = {
    oauth: {
        authorizationUrl: 'https://cas.inria.fr/cas/oauth2.0/authorize',
        accessTokenEndpoint: 'https://cas.inria.fr/cas/oauth2.0/accessToken',
        resourceUrl: 'https://cas.inria.fr/cas/oauth2.0/profile',
        clientId: 'inria-learningLab',
        clientSecret: 'T#P+yTJ+3#z8&i',
        responseType: 'token',
        redirectUri: 'http://localhost/callback',
        scope: ''
    },
    sentry: 'https://2992d74734b44e5cbc12b4926bdcd7be@o1092720.ingest.sentry.io/6111359',
    devModeSecret: 'ill2022',
    appleAccount: {
        login: 'apple@apple.com',
        password: 'tD209l@d3EnW'
    }
}