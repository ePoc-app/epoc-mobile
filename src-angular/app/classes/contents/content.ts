import {ChoiceCondition, Html, uid, Video, Audio} from '@epoc/epoc-types/dist/v1';
import {Assessment, SimpleQuestion} from './assessment';

export interface ContentRuntime {
    id: uid;
    viewed?: boolean;
}

// Extends base content types with runtime properties
export type Content = (Video & ContentRuntime) |
    (Audio & ContentRuntime) |
    (Html & ContentRuntime) |
    (ChoiceCondition & ContentRuntime) |
    (SimpleQuestion & ContentRuntime) |
    (Assessment & ContentRuntime);
