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
    mode: {
        normal: {
            libraryUrl: 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/list.json'
        },
        inria: {
            libraryUrl: 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/list-inria.json'
        }
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
