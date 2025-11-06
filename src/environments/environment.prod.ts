import {secrets} from './secrets';

export const environment = {
    production: true,
    officialCollectionsUrl: 'https://epoc.inria.fr/official-collections.json',
    onboardingUrls: {
        fr : 'https://epoc.inria.fr/onboarding.json',
        en : 'https://epoc.inria.fr/onboarding-en.json'
    },
    devModeSecret: secrets.devModeSecret
};

