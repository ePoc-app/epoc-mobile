import {secrets} from './secrets';

export const environment = {
    production: true,
    officialCollectionsUrl: 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/official-collections.json',
    devModeSecret: secrets.devModeSecret
};

