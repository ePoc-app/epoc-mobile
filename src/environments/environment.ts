// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mode: {
    default: {
      libraryUrl: 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/list.json',
      apiUrl: 'https://epoc.inria.fr/api',
      authUrl: 'https://epoc.inria.fr/auth',
      matomoUrl: 'https://epoc.inria.fr/matomo',
      matomoSiteId: 1
    },
    inria: {
      libraryUrl: 'https://epoc.inria.fr/api/library.jsone',
      apiUrl: 'https://epoc.inria.fr/api',
      authUrl: 'https://epoc.inria.fr/auth',
      matomoUrl: 'https://epoc.inria.fr/matomo',
      matomoSiteId: 1
    },
    dev: {
      libraryUrl: 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/list.json',
      apiUrl: 'https://epoc.inria.fr/api',
      authUrl: 'https://epoc.inria.fr/auth',
      matomoUrl: 'https://epoc.inria.fr/matomo',
      matomoSiteId: 1
    },
    preview: {
      libraryUrl: 'https://epoc.inria.fr/api/library.json',
      apiUrl: 'https://epoc.inria.fr/api',
      authUrl: 'https://epoc.inria.fr/auth',
      matomoUrl: 'https://epoc.inria.fr/matomo',
      matomoSiteId: 1
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
