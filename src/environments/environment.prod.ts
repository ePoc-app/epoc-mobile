import {secrets} from './secrets';
import {modeLibraries} from './libraries';

export const environment = {
    production: true,
    oauth: secrets.oauth,
    sentry: secrets.sentry,
    mode: modeLibraries,
    devModeSecret: secrets.devModeSecret
};

