import {
    documentTextOutline,
    cubeOutline,
    playCircleOutline,
    micOutline,
    helpOutline,
    gitBranchOutline,
    lockClosedOutline,
} from 'ionicons/icons';

export const CONTENT_TYPE_ICONS = {
    html: documentTextOutline,
    assessment: cubeOutline,
    video: playCircleOutline,
    audio: micOutline,
    'simple-question': helpOutline,
    choice: gitBranchOutline,
    locked: lockClosedOutline
} as const;