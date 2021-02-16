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
    },
    firebase: {
        apiKey: 'AIzaSyBmSMoB3lrmDqP3PcwpCPoDKjrKm8MdMxg',
        authDomain: 'epoc-39f52.firebaseapp.com',
        databaseURL: 'https://epoc-39f52.firebaseio.com',
        projectId: 'epoc-39f52',
        storageBucket: 'epoc-39f52.appspot.com',
        messagingSenderId: '434830911492',
        appId: '1:434830911492:web:87989fac3d0742571d2d51'
    }
};
