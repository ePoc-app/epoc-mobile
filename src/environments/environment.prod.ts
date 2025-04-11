export const environment = {
  production: true,
  mode: {
    default: {
      libraryUrl: 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/list.json',
      apiUrl: 'https://epoc.inria.fr/api',
      authUrl: 'https://epoc.inria.fr/auth',
      matomoUrl: 'https://epoc.inria.fr/matomo',
      matomoSiteId: 1
    },
    inria: {
      libraryUrl: 'https://epoc.inria.fr/api/library.json',
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
