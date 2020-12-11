// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
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
    },
    admins: ['benoit.rospars@inria.fr', 'jean-marc.hasenfratz@inria.fr']
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
